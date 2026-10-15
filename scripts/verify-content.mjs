#!/usr/bin/env node
/**
 * scripts/verify-content.mjs
 *
 * Executes the Python snippets embedded in src/content/<topic>/skills/*.json
 * (material.example, pitfalls, material.tryIt, and question verify blocks)
 * and checks their actual stdout/stderr against what the content claims.
 *
 * This is the *runtime* half of content validation. The *static* half
 * (uniqueness, references, required fields, "don't give away the answer")
 * lives in src/content/validateContent.ts and is checked by Vitest instead,
 * since it doesn't need to execute anything.
 *
 * No dependencies beyond Node's standard library.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const contentRoot = path.join(repoRoot, "src", "content");

/** CRLF -> LF, trim trailing whitespace per line, trim trailing newlines. */
function normalize(output) {
  return output
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");
}

function findSkillFiles() {
  const files = [];
  let topics = [];
  try {
    topics = readdirSync(contentRoot).filter((entry) =>
      statSync(path.join(contentRoot, entry)).isDirectory(),
    );
  } catch {
    return files;
  }
  for (const topic of topics) {
    const skillsDir = path.join(contentRoot, topic, "skills");
    let skillFileNames = [];
    try {
      skillFileNames = readdirSync(skillsDir).filter((f) => f.endsWith(".json"));
    } catch {
      continue;
    }
    for (const fileName of skillFileNames) {
      files.push({
        topic,
        fileName,
        fullPath: path.join(skillsDir, fileName),
        relPath: path.relative(repoRoot, path.join(skillsDir, fileName)),
      });
    }
  }
  return files;
}

/** Resolve which Python executable works on this machine ("python" then "py"). */
function resolvePythonCmd() {
  for (const cmd of ["python", "py"]) {
    const result = spawnSync(cmd, ["--version"], { encoding: "utf8", timeout: 5000 });
    if (!result.error && result.status === 0) {
      return cmd;
    }
  }
  return null;
}

function runPython(cmd, code) {
  return spawnSync(cmd, ["-c", code], { encoding: "utf8", timeout: 5000 });
}

const results = { ok: 0, fail: 0, info: 0 };

function reportOk(id) {
  results.ok += 1;
  console.log(`ok   ${id}`);
}

function reportFail(id, expected, actual) {
  results.fail += 1;
  console.log(`FAIL ${id}`);
  console.log(`     expected: ${JSON.stringify(expected)}`);
  console.log(`     actual:   ${JSON.stringify(actual)}`);
}

function reportInfo(id, message) {
  results.info += 1;
  console.log(`info ${id} ${message}`);
}

function checkStdout(pythonCmd, id, code, expectedOutput) {
  const result = runPython(pythonCmd, code);
  if (result.error) {
    reportFail(id, expectedOutput, `<spawn error: ${result.error.message}>`);
    return;
  }
  const actual = normalize(result.stdout ?? "");
  const expected = normalize(expectedOutput ?? "");
  if (result.status !== 0) {
    reportFail(id, expected, `<exit ${result.status}, stderr: ${(result.stderr ?? "").trim()}>`);
    return;
  }
  if (actual === expected) {
    reportOk(id);
  } else {
    reportFail(id, expected, actual);
  }
}

function checkError(pythonCmd, id, code, expectedErrorName) {
  const result = runPython(pythonCmd, code);
  if (result.error) {
    reportFail(id, `${expectedErrorName}:`, `<spawn error: ${result.error.message}>`);
    return;
  }
  if (result.status === 0) {
    reportFail(id, `non-zero exit raising ${expectedErrorName}`, "exit 0 (no error raised)");
    return;
  }
  const stderrLines = (result.stderr ?? "").replace(/\r\n/g, "\n").trim().split("\n");
  const lastLine = stderrLines[stderrLines.length - 1] ?? "";
  const expectedPrefix = `${expectedErrorName}:`;
  if (lastLine.startsWith(expectedPrefix)) {
    reportOk(id);
  } else {
    reportFail(id, `line starting with "${expectedPrefix}"`, lastLine);
  }
}

function verifySkillFile(pythonCmd, entry) {
  let skill;
  try {
    skill = JSON.parse(readFileSync(entry.fullPath, "utf8"));
  } catch (err) {
    reportFail(entry.relPath, "valid JSON", `<parse error: ${err.message}>`);
    return;
  }

  const material = skill.material ?? {};

  if (material.example) {
    checkStdout(
      pythonCmd,
      `${entry.relPath}:material.example`,
      material.example.code,
      material.example.output,
    );
  }

  (material.pitfalls ?? []).forEach((pitfall, index) => {
    checkStdout(
      pythonCmd,
      `${entry.relPath}:material.pitfalls[${index}] (${pitfall.title ?? "untitled"})`,
      pitfall.code,
      pitfall.output,
    );
  });

  if (material.tryIt) {
    checkStdout(
      pythonCmd,
      `${entry.relPath}:material.tryIt`,
      material.tryIt.code,
      material.tryIt.output,
    );
  }

  for (const question of skill.questions ?? []) {
    const verify = question.verify;
    if (verify && typeof verify.stdout === "string") {
      checkStdout(pythonCmd, `${question.id}:verify.stdout`, question.code, verify.stdout);
    } else if (verify && typeof verify.error === "string") {
      checkError(pythonCmd, `${question.id}:verify.error`, question.code, verify.error);
    }

    if (question.type === "choose_code") {
      const correctOption = (question.options ?? []).find(
        (o) => o.id === question.correctOptionId,
      );
      if (correctOption) {
        const result = runPython(pythonCmd, correctOption.text);
        const id = `${question.id}:choose_code.correct(${correctOption.id})`;
        if (!result.error && result.status === 0) {
          reportOk(id);
        } else {
          const detail = result.error
            ? `<spawn error: ${result.error.message}>`
            : `<exit ${result.status}, stderr: ${(result.stderr ?? "").trim()}>`;
          reportFail(id, "exit 0", detail);
        }
      }
      for (const option of question.options ?? []) {
        if (option.id === question.correctOptionId) continue;
        const result = runPython(pythonCmd, option.text);
        const id = `${question.id}:choose_code.wrong(${option.id})`;
        const outcome = result.error
          ? `spawn error: ${result.error.message}`
          : result.status === 0
            ? `ran fine (exit 0), stdout: ${JSON.stringify(normalize(result.stdout ?? ""))}`
            : `failed as expected (exit ${result.status})`;
        reportInfo(id, outcome);
      }
    }
  }
}

function main() {
  const pythonCmd = resolvePythonCmd();
  if (!pythonCmd) {
    console.error("Could not find a working Python interpreter (tried 'python' and 'py').");
    process.exit(1);
  }
  console.log(`Using Python command: ${pythonCmd}`);

  const skillFiles = findSkillFiles();
  if (skillFiles.length === 0) {
    console.log("No skill content files found under src/content/*/skills/*.json");
  }

  for (const entry of skillFiles) {
    verifySkillFile(pythonCmd, entry);
  }

  console.log("");
  console.log(
    `Summary: ${results.ok} ok, ${results.fail} FAIL, ${results.info} info (not counted as failures)`,
  );

  if (results.fail > 0) {
    process.exit(1);
  }
}

main();
