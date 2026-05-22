export type KjvVerse = {
  verseNumber: number | null;
  verseText: string;
};

function normalizeTypography(text: string) {
  return text
    .replaceAll("\uFFFD", "'")
    .replaceAll("\u2019", "'")
    .replaceAll("\u2018", "'")
    .replaceAll("\u00E2\u20AC\u2122", "'")
    .replaceAll("\u00E2\u20AC\u02DC", "'")
    .replaceAll("\u201C", "\"")
    .replaceAll("\u201D", "\"")
    .replaceAll("\u00E2\u20AC\u0153", "\"")
    .replaceAll("\u00E2\u20AC\u009D", "\"")
    .replaceAll("\u2013", "-")
    .replaceAll("\u2014", "-")
    .replaceAll("\u00E2\u20AC\u201C", "-")
    .replaceAll("\u00E2\u20AC\u201D", "-")
    .replaceAll("\u2026", "...")
    .replaceAll("\u00C2", "");
}

function normalizeRawKjvText(rawText: string) {
  return normalizeTypography(
    rawText
      .replaceAll("\\r\\n", "\n")
      .replaceAll("\\n", "\n")
      .replaceAll("\\r", "\n")
      .replaceAll("\r\n", "\n")
      .replaceAll("\r", "\n"),
  ).trim();
}

function normalizeVerseText(text: string) {
  return text
    .replace(/\n+/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function parseVerseNumbersFromReference(reference: string) {
  const spec = reference.split(":").slice(1).join(":").trim();

  if (!spec) {
    return [];
  }

  const numbers: number[] = [];

  for (const rawToken of spec.split(",")) {
    const token = rawToken.trim().replaceAll(";", "").replace(/[^0-9-]/g, "");

    if (!token) {
      continue;
    }

    if (token.includes("-")) {
      const [rangeStart, rangeEnd] = token.split("-", 2).map((value) => Number(value));

      if (Number.isInteger(rangeStart) && Number.isInteger(rangeEnd) && rangeEnd >= rangeStart) {
        for (let verseNumber = rangeStart; verseNumber <= rangeEnd; verseNumber += 1) {
          numbers.push(verseNumber);
        }
      }

      continue;
    }

    const verseNumber = Number(token);

    if (Number.isInteger(verseNumber)) {
      numbers.push(verseNumber);
    }
  }

  return [...new Set(numbers)];
}

function alignBlocksToCount(blocks: string[], targetCount: number) {
  if (targetCount <= 0) {
    return [];
  }

  if (blocks.length === 0) {
    return Array.from({ length: targetCount }, () => "");
  }

  if (blocks.length === targetCount) {
    return blocks;
  }

  if (targetCount === 1) {
    return [blocks.join(" ").trim()];
  }

  return Array.from({ length: targetCount }, (_, index) => {
    const start = Math.floor((index * blocks.length) / targetCount);
    const end = Math.floor(((index + 1) * blocks.length) / targetCount);
    const safeEnd = end <= start ? Math.min(start + 1, blocks.length) : end;

    return blocks.slice(start, safeEnd).join(" ").trim();
  });
}

function splitIntoVerseBlocks(text: string, expectedCount: number | null) {
  const strongBreakBlocks = text
    .split(/\n{3,}/)
    .map(normalizeVerseText)
    .filter(Boolean);

  if (strongBreakBlocks.length > 1) {
    return strongBreakBlocks;
  }

  const weakBreakBlocks = text
    .split(/\n{2,}/)
    .map(normalizeVerseText)
    .filter(Boolean);

  if (expectedCount && expectedCount > 1 && weakBreakBlocks.length >= expectedCount) {
    return alignBlocksToCount(weakBreakBlocks, expectedCount);
  }

  if (weakBreakBlocks.length > 1) {
    return weakBreakBlocks;
  }

  const normalized = normalizeVerseText(text);

  return normalized ? [normalized] : [];
}

export function getKjvVerses(reference: string, rawText?: string): KjvVerse[] {
  if (!rawText) {
    return [];
  }

  const normalized = normalizeRawKjvText(rawText);

  if (!normalized) {
    return [];
  }

  const parsedVerseNumbers = parseVerseNumbersFromReference(reference);
  const expectedVerseCount = parsedVerseNumbers.length > 1 ? parsedVerseNumbers.length : null;
  const verseBlocks = splitIntoVerseBlocks(normalized, expectedVerseCount);

  if (verseBlocks.length === 0) {
    return [];
  }

  if (parsedVerseNumbers.length > 1) {
    const alignedBlocks = alignBlocksToCount(verseBlocks, parsedVerseNumbers.length);

    return parsedVerseNumbers.map((verseNumber, index) => ({
      verseNumber,
      verseText: alignedBlocks[index],
    }));
  }

  if (parsedVerseNumbers.length === 1) {
    return [{
      verseNumber: null,
      verseText: verseBlocks.join(" ").trim(),
    }];
  }

  if (verseBlocks.length > 1) {
    return verseBlocks.map((verseText, index) => ({
      verseNumber: index + 1,
      verseText,
    }));
  }

  return [{
    verseNumber: null,
    verseText: verseBlocks[0],
  }];
}
