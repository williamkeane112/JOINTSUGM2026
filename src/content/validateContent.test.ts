/// <reference types="vite/client" />

import { describe, expect, it } from "vitest";
import { validateSkill, validateTopic } from "./validateContent";
import type {
  Question,
  QuestionOption,
  SkillContent,
  SkillMeta,
  TopicContent,
} from "./types";

/** Deep clone via JSON round-trip; all fixtures here are plain JSON-shaped data. */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function makeOption(id: string, text: string, correct: boolean): QuestionOption {
  return correct
    ? { id, text }
    : { id, text, misconception: `misconception for ${id}`, feedback: `feedback for ${id}` };
}

function makeQuestion(skillKey: string, n: number, overrides: Partial<Question> = {}): Question {
  const base: Question = {
    id: `${skillKey}.q${n}`,
    type: "predict_output",
    difficulty: "easy",
    prompt: `Apa yang dicetak? (${n})`,
    code: `print(${n})`,
    options: [
      makeOption("a", String(n), true),
      makeOption("b", String(n + 1), false),
      makeOption("c", String(n + 2), false),
      makeOption("d", String(n + 3), false),
    ],
    correctOptionId: "a",
    explanation: `Explanation for question ${n}`,
    verify: { stdout: String(n) },
  };
  return { ...base, ...overrides };
}

const SKILL_A_KEY = "topik-contoh.skill-a";
const SKILL_B_KEY = "topik-contoh.skill-b";

function makeValidSkillContent(skillKey: string): SkillContent {
  return {
    skillKey,
    material: {
      goal: "Setelah ini kamu bisa melakukan sesuatu.",
      explanation: ["Paragraf pertama.", "Paragraf kedua."],
      example: { code: "print('example')", output: "example", note: "contoh" },
      pitfalls: [
        {
          title: "Kesalahan umum",
          code: "print('pitfall')",
          output: "pitfall",
          why: "karena begini",
        },
      ],
      notes: ["Catatan singkat."],
      tryIt: {
        code: "print('tryit')",
        output: "tryit",
        note: "catatan",
        prompt: "Tebak dulu outputnya.",
      },
    },
    questions: [
      makeQuestion(skillKey, 1, { difficulty: "easy" }),
      makeQuestion(skillKey, 2, { difficulty: "medium" }),
      makeQuestion(skillKey, 3, {
        difficulty: "medium",
        type: "predict_error",
        code: "print(belum_ada)",
        options: [
          makeOption("a", "NameError", true),
          makeOption("b", "TypeError", false),
          makeOption("c", "Tidak ada error", false),
          makeOption("d", "SyntaxError", false),
        ],
        correctOptionId: "a",
        verify: { error: "NameError" },
      }),
      makeQuestion(skillKey, 4, { difficulty: "hard" }),
      makeQuestion(skillKey, 5, {
        difficulty: "medium",
        type: "choose_code",
        code: undefined,
        prompt: "Kode mana yang benar?",
        options: [
          makeOption("a", "x = 1\nx = x + 1", true),
          makeOption("b", "x = 1\nx + 1", false),
          makeOption("c", "1 = x", false),
          makeOption("d", "x == x + 1", false),
        ],
        correctOptionId: "a",
        verify: undefined,
      }),
    ],
  };
}

function makeValidSkillMeta(key: string, file: string | null): SkillMeta {
  return {
    key,
    name: "Skill",
    prerequisites: [],
    objectives: ["Melakukan sesuatu"],
    file,
  };
}

function makeValidTopic(): TopicContent {
  return {
    slug: "topik-contoh",
    name: "Topik Contoh",
    language: "python",
    level: "pemula",
    description: "Topik contoh untuk pengujian.",
    units: [
      {
        key: "unit-1",
        name: "Unit 1",
        skills: [
          { ...makeValidSkillMeta(SKILL_A_KEY, "skill-a.json") },
          {
            ...makeValidSkillMeta(SKILL_B_KEY, null),
            prerequisites: [SKILL_A_KEY],
          },
        ],
      },
    ],
  };
}

function makeValidSkillFiles(): Record<string, SkillContent> {
  return { "skill-a.json": makeValidSkillContent(SKILL_A_KEY) };
}

describe("validateTopic — valid baseline", () => {
  it("returns no problems for a well-formed topic", () => {
    const topic = makeValidTopic();
    const skillFiles = makeValidSkillFiles();
    expect(validateTopic(topic, skillFiles)).toEqual([]);
  });
});

describe("validateTopic — structural checks", () => {
  it("flags a slug that is not kebab-case", () => {
    const topic = makeValidTopic();
    topic.slug = "Topik_Contoh";
    const problems = validateTopic(topic, {});
    expect(problems.some((p) => p.includes("kebab-case"))).toBe(true);
  });

  it("flags a duplicate skill key", () => {
    const topic = makeValidTopic();
    topic.units[0].skills[1].key = SKILL_A_KEY;
    const problems = validateTopic(topic, makeValidSkillFiles());
    expect(problems.some((p) => p.includes("used by more than one skill"))).toBe(true);
  });

  it("flags a duplicate unit key", () => {
    const topic = makeValidTopic();
    topic.units.push(clone(topic.units[0]));
    const problems = validateTopic(topic, {});
    expect(problems.some((p) => p.includes("used by more than one unit"))).toBe(true);
  });

  it("flags a skill key that does not start with the topic slug prefix", () => {
    const topic = makeValidTopic();
    topic.units[0].skills[0].key = "lain.skill-a";
    const problems = validateTopic(topic, {});
    expect(problems.some((p) => p.includes("does not start with the topic slug prefix"))).toBe(
      true,
    );
  });

  it("flags a skill with no objectives", () => {
    const topic = makeValidTopic();
    topic.units[0].skills[0].objectives = [];
    const problems = validateTopic(topic, makeValidSkillFiles());
    expect(problems.some((p) => p.includes("at least 1 objective"))).toBe(true);
  });

  it("flags a prerequisite that does not exist", () => {
    const topic = makeValidTopic();
    topic.units[0].skills[1].prerequisites = ["topik-contoh.tidak-ada"];
    const problems = validateTopic(topic, makeValidSkillFiles());
    expect(problems.some((p) => p.includes('prerequisite "topik-contoh.tidak-ada" does not exist'))).toBe(
      true,
    );
  });

  it("flags a prerequisite that appears later in reading order", () => {
    const topic = makeValidTopic();
    // skill-a (index 0) depends on skill-b (index 1): wrong order.
    topic.units[0].skills[0].prerequisites = [SKILL_B_KEY];
    const problems = validateTopic(topic, makeValidSkillFiles());
    expect(problems.some((p) => p.includes("must appear earlier in reading order"))).toBe(true);
  });

  it("flags a self-prerequisite", () => {
    const topic = makeValidTopic();
    topic.units[0].skills[0].prerequisites = [SKILL_A_KEY];
    const problems = validateTopic(topic, makeValidSkillFiles());
    expect(problems.some((p) => p.includes("lists itself as its own prerequisite"))).toBe(true);
  });

  it("flags a file reference that is missing from skillFiles", () => {
    const topic = makeValidTopic();
    const problems = validateTopic(topic, {});
    expect(problems.some((p) => p.includes('file "skill-a.json" was not found in skillFiles'))).toBe(
      true,
    );
  });

  it("flags a skillFiles entry that is not referenced by any skill", () => {
    const topic = makeValidTopic();
    const skillFiles = { ...makeValidSkillFiles(), "orphan.json": makeValidSkillContent("x.orphan") };
    const problems = validateTopic(topic, skillFiles);
    expect(problems.some((p) => p.includes('"orphan.json" is not referenced by any skill'))).toBe(
      true,
    );
  });

  it("flags a skillFiles entry referenced by more than one skill", () => {
    const topic = makeValidTopic();
    topic.units[0].skills[1].file = "skill-a.json";
    const problems = validateTopic(topic, makeValidSkillFiles());
    expect(
      problems.some((p) => p.includes('"skill-a.json" is referenced by more than one skill')),
    ).toBe(true);
  });

  it("flags a skillKey that does not match the meta key referencing it", () => {
    const topic = makeValidTopic();
    const skillFiles = makeValidSkillFiles();
    skillFiles["skill-a.json"].skillKey = "topik-contoh.wrong-key";
    const problems = validateTopic(topic, skillFiles);
    expect(problems.some((p) => p.includes("expected \"topik-contoh.skill-a\""))).toBe(true);
  });
});

describe("validateSkill — question bank checks", () => {
  it("flags fewer than 5 questions", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions = skill.questions.slice(0, 3);
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("at least 5 questions"))).toBe(true);
  });

  it("flags a duplicate question id", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[1].id = skill.questions[0].id;
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("is used more than once"))).toBe(true);
  });

  it("flags a question id that does not start with the skill key prefix", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[0].id = "lain.q01";
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("does not start with"))).toBe(true);
  });

  it("flags a question without exactly 4 options", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[0].options.pop();
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("exactly 4 options"))).toBe(true);
  });

  it("flags a duplicate option id", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[0].options[1].id = skill.questions[0].options[0].id;
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("option id") && p.includes("more than once"))).toBe(
      true,
    );
  });

  it("flags a duplicate option text", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[0].options[1].text = skill.questions[0].options[0].text;
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("option text") && p.includes("more than once"))).toBe(
      true,
    );
  });

  it("flags a correctOptionId that does not match any option", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[0].correctOptionId = "z";
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("does not match any option"))).toBe(true);
  });

  it("flags a correct option that has a misconception", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[0].options[0].misconception = "should not be here";
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("correct option must not have a misconception"))).toBe(
      true,
    );
  });

  it("flags a wrong option missing a misconception", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    delete skill.questions[0].options[1].misconception;
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("missing a misconception"))).toBe(true);
  });

  it("flags a wrong option missing feedback", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    delete skill.questions[0].options[1].feedback;
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("missing feedback"))).toBe(true);
  });

  it("flags predict_output without code", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    delete skill.questions[0].code;
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("(predict_output) must have code"))).toBe(true);
  });

  it("flags predict_output verify.stdout that does not match the correct option text", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[0].verify = { stdout: "999" };
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("does not match the correct option text"))).toBe(true);
  });

  it("accepts predict_output verify.stdout that only differs by trailing whitespace per line", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[0].options[0].text = "1 ";
    skill.questions[0].verify = { stdout: "1" };
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("does not match the correct option text"))).toBe(
      false,
    );
  });

  it("flags predict_error verify.error that is not a PascalCase *Error name", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    const errorQuestion = skill.questions.find((q) => q.type === "predict_error");
    if (!errorQuestion) throw new Error("fixture missing predict_error question");
    errorQuestion.verify = { error: "not_an_error" };
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("does not look like an exception name"))).toBe(true);
  });

  it("flags choose_code with verify.stdout present", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    const chooseCodeQuestion = skill.questions.find((q) => q.type === "choose_code");
    if (!chooseCodeQuestion) throw new Error("fixture missing choose_code question");
    chooseCodeQuestion.verify = { stdout: "x = 1\nx = x + 1" };
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("(choose_code) must not have verify.stdout"))).toBe(
      true,
    );
  });

  it("flags an empty explanation", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[0].explanation = "";
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("non-empty explanation"))).toBe(true);
  });

  it("flags a question code identical to material.example.code", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[0].code = skill.material.example.code;
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("identical to material.example.code"))).toBe(true);
  });

  it("flags a question code identical to a pitfall's code", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[0].code = skill.material.pitfalls[0].code;
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes('identical to pitfall "Kesalahan umum" code'))).toBe(
      true,
    );
  });

  it("flags a question code identical to material.tryIt.code", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions[0].code = skill.material.tryIt.code;
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("identical to material.tryIt.code"))).toBe(true);
  });
});

describe("validateSkill — material checks", () => {
  it("flags an empty material.explanation", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.material.explanation = [];
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("material.explanation must be non-empty"))).toBe(true);
  });

  it("flags zero pitfalls", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.material.pitfalls = [];
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes("at least 1 pitfall"))).toBe(true);
  });

  it("flags a question bank with no easy question", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions.forEach((q) => {
      q.difficulty = "medium";
    });
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes('difficulty "easy"'))).toBe(true);
  });

  it("flags a question bank with no medium-or-hard question", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    skill.questions.forEach((q) => {
      q.difficulty = "easy";
    });
    const problems = validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"));
    expect(problems.some((p) => p.includes('"medium" or "hard"'))).toBe(true);
  });
});

describe("validateSkill — valid baseline", () => {
  it("returns no problems for a well-formed skill", () => {
    const skill = makeValidSkillContent(SKILL_A_KEY);
    expect(validateSkill(skill, makeValidSkillMeta(SKILL_A_KEY, "skill-a.json"))).toEqual([]);
  });
});

describe("real content", () => {
  const topicModules = import.meta.glob("./*/topic.json", {
    eager: true,
    import: "default",
  }) as Record<string, TopicContent>;
  const skillModules = import.meta.glob("./*/skills/*.json", {
    eager: true,
    import: "default",
  }) as Record<string, SkillContent>;

  const folders = new Set(
    Object.keys(topicModules).map((path) => path.replace(/^\.\//, "").split("/")[0]),
  );

  for (const folder of folders) {
    it(`topic "${folder}" has no content problems`, () => {
      const topic = topicModules[`./${folder}/topic.json`];
      const skillFiles: Record<string, SkillContent> = {};
      const prefix = `./${folder}/skills/`;
      for (const [skillPath, skill] of Object.entries(skillModules)) {
        if (skillPath.startsWith(prefix)) {
          skillFiles[skillPath.slice(prefix.length)] = skill;
        }
      }
      expect(validateTopic(topic, skillFiles)).toEqual([]);
    });
  }
});
