/**
 * Static validation for learning content (src/content/<topic>/).
 *
 * These checks only look at the JSON structure (uniqueness, references,
 * prerequisite ordering, required fields, "don't give away the answer").
 * They do NOT execute any code — see scripts/verify-content.mjs for the
 * Python-execution checks (stdout/error matching).
 *
 * Pure functions: no side effects, no console output. Callers (tests,
 * scripts) decide how to report the returned problem strings.
 */

import type {
  Question,
  QuestionOption,
  SkillContent,
  SkillMeta,
  TopicContent,
  UnitContent,
} from "./types";

const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EXCEPTION_NAME = /^[A-Z][A-Za-z]*Error$/;

function isNonEmptyString(value: string | undefined | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/** Trim trailing whitespace from every line, matching how terminal/stdout capture is compared. */
function trimTrailingWhitespacePerLine(value: string): string {
  return value
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n");
}

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }
  return [...duplicates];
}

/**
 * Validate a topic map: slug/unit/skill-key shape, prerequisite graph
 * (must exist and come earlier in reading order), and the file <-> skill
 * cross-references into skillFiles. Then validates every referenced skill
 * file with validateSkill and folds those problems in too.
 *
 * @param skillFiles keyed by file name as it appears in SkillMeta.file (e.g. "variabel.json")
 */
export function validateTopic(
  topic: TopicContent,
  skillFiles: Record<string, SkillContent>,
): string[] {
  const problems: string[] = [];

  if (!isNonEmptyString(topic.slug) || !KEBAB_CASE.test(topic.slug)) {
    problems.push(`Topic slug "${topic.slug}" is not kebab-case`);
  }

  // Unit key uniqueness.
  const unitKeys = topic.units.map((unit) => unit.key);
  for (const dup of findDuplicates(unitKeys)) {
    problems.push(`Unit key "${dup}" is used by more than one unit`);
  }

  // Flatten units -> skills in reading order (units in array order, skills in array order).
  const flatSkills: { unit: UnitContent; meta: SkillMeta }[] = [];
  for (const unit of topic.units) {
    for (const meta of unit.skills) {
      flatSkills.push({ unit, meta });
    }
  }

  const allKeys = flatSkills.map(({ meta }) => meta.key);
  for (const dup of findDuplicates(allKeys)) {
    problems.push(`Skill key "${dup}" is used by more than one skill`);
  }

  const expectedPrefix = `${topic.slug}.`;
  const keyIndex = new Map<string, number>();
  flatSkills.forEach(({ meta }, index) => {
    // Keep the first occurrence's index for ordering checks, matching reading order.
    if (!keyIndex.has(meta.key)) {
      keyIndex.set(meta.key, index);
    }
  });

  // References from skillFiles file name -> meta keys that point to it.
  const referencedBy = new Map<string, string[]>();

  flatSkills.forEach(({ unit, meta }, index) => {
    if (!isNonEmptyString(meta.key) || !meta.key.startsWith(expectedPrefix)) {
      problems.push(
        `Skill "${meta.key}" (unit "${unit.key}") does not start with the topic slug prefix "${expectedPrefix}"`,
      );
    }

    if (!meta.objectives || meta.objectives.length < 1) {
      problems.push(`Skill "${meta.key}": must have at least 1 objective`);
    }

    for (const prereq of meta.prerequisites) {
      if (prereq === meta.key) {
        problems.push(`Skill "${meta.key}": lists itself as its own prerequisite`);
        continue;
      }
      const prereqIndex = keyIndex.get(prereq);
      if (prereqIndex === undefined) {
        problems.push(`Skill "${meta.key}": prerequisite "${prereq}" does not exist`);
      } else if (prereqIndex >= index) {
        problems.push(
          `Skill "${meta.key}": prerequisite "${prereq}" must appear earlier in reading order (units in order, skills in order)`,
        );
      }
    }

    if (meta.file !== null) {
      if (!(meta.file in skillFiles)) {
        problems.push(`Skill "${meta.key}": file "${meta.file}" was not found in skillFiles`);
      } else {
        const list = referencedBy.get(meta.file) ?? [];
        list.push(meta.key);
        referencedBy.set(meta.file, list);
      }
    }
  });

  for (const file of Object.keys(skillFiles)) {
    const refs = referencedBy.get(file) ?? [];
    if (refs.length === 0) {
      problems.push(`Skill file "${file}" is not referenced by any skill in topic.units`);
    } else if (refs.length > 1) {
      problems.push(
        `Skill file "${file}" is referenced by more than one skill: ${refs.join(", ")}`,
      );
    }
  }

  for (const { meta } of flatSkills) {
    if (meta.file === null || !(meta.file in skillFiles)) {
      continue;
    }
    const content = skillFiles[meta.file];
    if (content.skillKey !== meta.key) {
      problems.push(
        `Skill "${meta.key}": file "${meta.file}" has skillKey "${content.skillKey}", expected "${meta.key}"`,
      );
    }
    problems.push(...validateSkill(content, meta));
  }

  return problems;
}

function optionMisconceptionFeedbackProblems(
  skillKey: string,
  question: Question,
  correctOption: QuestionOption,
): string[] {
  const problems: string[] = [];

  if (isNonEmptyString(correctOption.misconception)) {
    problems.push(
      `Skill "${skillKey}": question "${question.id}": correct option must not have a misconception`,
    );
  }
  if (isNonEmptyString(correctOption.feedback)) {
    problems.push(
      `Skill "${skillKey}": question "${question.id}": correct option must not have feedback`,
    );
  }

  for (const option of question.options) {
    if (option.id === correctOption.id) {
      continue;
    }
    if (!isNonEmptyString(option.misconception)) {
      problems.push(
        `Skill "${skillKey}": question "${question.id}": wrong option "${option.id}" is missing a misconception`,
      );
    }
    if (!isNonEmptyString(option.feedback)) {
      problems.push(
        `Skill "${skillKey}": question "${question.id}": wrong option "${option.id}" is missing feedback`,
      );
    }
  }

  return problems;
}

function verifyProblems(skillKey: string, question: Question, correctOption: QuestionOption): string[] {
  const problems: string[] = [];
  const prefix = `Skill "${skillKey}": question "${question.id}"`;

  if (question.type === "predict_output" || question.type === "predict_error") {
    if (!isNonEmptyString(question.code)) {
      problems.push(`${prefix} (${question.type}) must have code`);
    }
    if (!question.verify) {
      problems.push(`${prefix} (${question.type}) must have a verify`);
    } else if (question.type === "predict_output") {
      if (!("stdout" in question.verify)) {
        problems.push(`${prefix} (predict_output) must have a verify.stdout`);
      } else {
        const expected = trimTrailingWhitespacePerLine(question.verify.stdout);
        const actual = trimTrailingWhitespacePerLine(correctOption.text);
        if (expected !== actual) {
          problems.push(
            `${prefix}: verify.stdout "${question.verify.stdout}" does not match the correct option text "${correctOption.text}"`,
          );
        }
      }
    } else {
      // predict_error
      if (!("error" in question.verify)) {
        problems.push(`${prefix} (predict_error) must have a verify.error`);
      } else if (!EXCEPTION_NAME.test(question.verify.error)) {
        problems.push(
          `${prefix}: verify.error "${question.verify.error}" does not look like an exception name (expected PascalCase ending in "Error")`,
        );
      }
    }
  } else if (question.type === "choose_code") {
    if (question.verify && "stdout" in question.verify) {
      problems.push(`${prefix} (choose_code) must not have verify.stdout`);
    }
  }

  return problems;
}

function codeLeakProblems(skillKey: string, question: Question, skill: SkillContent): string[] {
  const problems: string[] = [];
  if (!isNonEmptyString(question.code)) {
    return problems;
  }
  const prefix = `Skill "${skillKey}": question "${question.id}"`;

  if (question.code === skill.material.example.code) {
    problems.push(`${prefix}: code is identical to material.example.code (gives away the answer)`);
  }
  for (const pitfall of skill.material.pitfalls) {
    if (question.code === pitfall.code) {
      problems.push(
        `${prefix}: code is identical to pitfall "${pitfall.title}" code (gives away the answer)`,
      );
    }
  }
  if (question.code === skill.material.tryIt.code) {
    problems.push(`${prefix}: code is identical to material.tryIt.code (gives away the answer)`);
  }

  return problems;
}

/**
 * Validate one skill's material + question bank.
 *
 * @param meta the SkillMeta that references this skill (used for the ".key." id prefix check)
 */
export function validateSkill(skill: SkillContent, meta: SkillMeta): string[] {
  const problems: string[] = [];
  const skillKey = meta.key;

  if (skill.questions.length < 5) {
    problems.push(
      `Skill "${skillKey}": must have at least 5 questions (found ${skill.questions.length})`,
    );
  }

  const questionIds = skill.questions.map((q) => q.id);
  for (const dup of findDuplicates(questionIds)) {
    problems.push(`Skill "${skillKey}": question id "${dup}" is used more than once`);
  }

  const expectedPrefix = `${skillKey}.`;
  for (const question of skill.questions) {
    if (!question.id.startsWith(expectedPrefix)) {
      problems.push(
        `Skill "${skillKey}": question id "${question.id}" does not start with "${expectedPrefix}"`,
      );
    }

    if (question.options.length !== 4) {
      problems.push(
        `Skill "${skillKey}": question "${question.id}" must have exactly 4 options (found ${question.options.length})`,
      );
    }

    const optionIds = question.options.map((o) => o.id);
    for (const dup of findDuplicates(optionIds)) {
      problems.push(
        `Skill "${skillKey}": question "${question.id}": option id "${dup}" is used more than once`,
      );
    }

    const optionTexts = question.options.map((o) => o.text);
    for (const dup of findDuplicates(optionTexts)) {
      problems.push(
        `Skill "${skillKey}": question "${question.id}": option text "${dup}" is used more than once`,
      );
    }

    const correctOption = question.options.find((o) => o.id === question.correctOptionId);
    if (!correctOption) {
      problems.push(
        `Skill "${skillKey}": question "${question.id}": correctOptionId "${question.correctOptionId}" does not match any option`,
      );
    } else {
      problems.push(...optionMisconceptionFeedbackProblems(skillKey, question, correctOption));
      problems.push(...verifyProblems(skillKey, question, correctOption));
    }

    if (!isNonEmptyString(question.explanation)) {
      problems.push(`Skill "${skillKey}": question "${question.id}" must have a non-empty explanation`);
    }

    problems.push(...codeLeakProblems(skillKey, question, skill));
  }

  if (!skill.material.explanation || skill.material.explanation.length < 1) {
    problems.push(`Skill "${skillKey}": material.explanation must be non-empty`);
  } else if (skill.material.explanation.some((paragraph) => !isNonEmptyString(paragraph))) {
    problems.push(`Skill "${skillKey}": material.explanation must not contain empty paragraphs`);
  }

  if (!skill.material.pitfalls || skill.material.pitfalls.length < 1) {
    problems.push(`Skill "${skillKey}": material must have at least 1 pitfall`);
  }

  const hasEasy = skill.questions.some((q) => q.difficulty === "easy");
  const hasMediumOrHard = skill.questions.some(
    (q) => q.difficulty === "medium" || q.difficulty === "hard",
  );
  if (!hasEasy) {
    problems.push(`Skill "${skillKey}": must have at least one question with difficulty "easy"`);
  }
  if (!hasMediumOrHard) {
    problems.push(
      `Skill "${skillKey}": must have at least one question with difficulty "medium" or "hard"`,
    );
  }

  return problems;
}
