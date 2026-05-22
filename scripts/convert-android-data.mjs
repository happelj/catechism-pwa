import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [, , catechismPath, kjvPath] = process.argv;

if (!catechismPath || !kjvPath) {
  throw new Error("Usage: node scripts/convert-android-data.mjs <CatechismData.kt> <KjvVerseLookup.kt>");
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const catechismSource = await readFile(catechismPath, "utf8");
const kjvSource = await readFile(kjvPath, "utf8");

function readQuotedValues(value) {
  return [...value.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((match) => decodeKotlinString(match[1]));
}

function decodeKotlinString(value) {
  const decoded = JSON.parse(`"${value}"`);
  return decoded.replace(/\\n/g, "\n");
}

function buildQuestionData() {
  const proofsByNumber = new Map();
  const proofBlock = catechismSource.match(/private val proofsByQuestion:[\s\S]+?fun getQuestion/)?.[0];

  if (!proofBlock) {
    throw new Error("Could not find proofsByQuestion in CatechismData.kt.");
  }

  for (const match of proofBlock.matchAll(/(\d+)\s+to\s+(listOf\((.*?)\)|emptyList\(\))/g)) {
    proofsByNumber.set(Number(match[1]), match[3] ? readQuotedValues(match[3]) : []);
  }

  const questions = [];
  const questionPattern = /(\d+)\s+to\s+\("((?:[^"\\]|\\.)*)"\s+to\s+"((?:[^"\\]|\\.)*)"\)/g;

  for (const match of catechismSource.matchAll(questionPattern)) {
    const number = Number(match[1]);
    questions.push({
      answer: decodeKotlinString(match[3]),
      number,
      proofs: proofsByNumber.get(number) ?? [],
      question: decodeKotlinString(match[2]),
    });
  }

  if (questions.length !== 107) {
    throw new Error(`Expected 107 catechism questions, found ${questions.length}.`);
  }

  return questions.sort((left, right) => left.number - right.number);
}

function buildKjvData() {
  const passages = [];
  const passagePattern = /"((?:[^"\\]|\\.)*)"\s+to\s+KjvPassage\(\s*titleReference\s*=\s*"((?:[^"\\]|\\.)*)",\s*body\s*=\s*"((?:[^"\\]|\\.)*)"\s*\)/g;

  for (const match of kjvSource.matchAll(passagePattern)) {
    passages.push({
      body: decodeKotlinString(match[3]),
      reference: decodeKotlinString(match[1]),
      titleReference: decodeKotlinString(match[2]),
    });
  }

  if (passages.length === 0) {
    throw new Error("No KJV passages were found in KjvVerseLookup.kt.");
  }

  return passages;
}

function writeTypeScriptData(fileName, typeName, exportName, data) {
  const output = `// Generated from the Android reference sources by scripts/convert-android-data.mjs.
export type ${typeName} = ${typeName === "CatechismQuestion"
    ? `{
  answer: string;
  number: number;
  proofs: string[];
  question: string;
}`
    : `{
  body: string;
  reference: string;
  titleReference: string;
}`};

export const ${exportName} = ${JSON.stringify(data, null, 2)} satisfies ${typeName}[];
`;

  return writeFile(resolve(repoRoot, "src", "data", fileName), output);
}

const questions = buildQuestionData();
const passages = buildKjvData();

await writeTypeScriptData("catechism.ts", "CatechismQuestion", "catechismQuestions", questions);
await writeTypeScriptData("kjvPassages.ts", "KjvPassage", "kjvPassages", passages);

console.log(`Wrote ${questions.length} catechism questions and ${passages.length} KJV passages.`);
