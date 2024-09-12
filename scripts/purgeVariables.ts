/**
 * the generated md theme creates a lot of colour variables.
 *
 * purgecss isn't able to figure out if the css variables are used in .vue files, and removes _all_ of them.
 *
 * this script will go through the src folder create a temporary directory of just the ones that get used, which vite will use instead.
 */
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import * as path from "node:path";

// matches color: var( >> --some-var << );
const definedVariableRegex = new RegExp("[^(](--[^:]+)");

// matches >> --some-var << : #f00;
const usedVariableRegex = new RegExp(/var\((--[^)]+)\)/, "g");

async function findVariablesInFile(filePath: string): Promise<string[]> {
  const file = await readFile(filePath, { encoding: "utf8" });

  const cssVars = [];

  for (let match of file.matchAll(usedVariableRegex)) {
    const [, input] = match;
    cssVars.push(input);
  }

  return cssVars;
}

async function findAllVariables(srcDir: string): Promise<string[]> {
  const files = await readdir(srcDir, {
    recursive: true,
    // withFileTypes: true,
  });

  const promises = files
    .filter(
      (filePath) => filePath.endsWith(".vue") || filePath.endsWith(".css"),
    )
    .map((filePath) => findVariablesInFile(path.join(srcDir, filePath)));

  const variables = await Promise.all(promises);

  return [...new Set(variables.flat())];
}

function isLineUsedOrNotVariable(
  line: string,
  usedVariables: string[],
): boolean {
  const varName = line.match(definedVariableRegex)?.[1];

  return !varName || usedVariables.includes(varName);
}

async function stripVariablesFromFile(
  filePath: string,
  usedVariables: string[],
): Promise<void> {
  const file = await readFile(filePath, { encoding: "utf8" });
  const lines = file
    .split("\n")
    .filter((line) => isLineUsedOrNotVariable(line, usedVariables))
    .join("\n");

  const newFilePath = filePath.replace("variables", "_variables");

  await writeFile(newFilePath, lines);
}

async function trimColorVars(stylesDir: string, usedVariables: string[]) {
  const variableFiles = await readdir(path.resolve(stylesDir), {
    recursive: true,
  });

  const promises = variableFiles
    .filter((filePath) => filePath.endsWith(".css"))
    .map((filePath) =>
      stripVariablesFromFile(path.join(stylesDir, filePath), usedVariables),
    );

  await Promise.all(promises);
}

export async function purgeCssVariables(srcDir: string) {
  // todo delete this dir after build
  await mkdir(path.resolve(srcDir, "styles/_variables"), { recursive: true });

  const usedVariables = await findAllVariables(srcDir);

  await trimColorVars(path.resolve(srcDir, "styles/variables"), usedVariables);
}

export async function removeTempFiles(srcDir: string) {
  await rm(path.resolve(srcDir, "styles/_variables"), {
    force: true,
    recursive: true,
  });
}
