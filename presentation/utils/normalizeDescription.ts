export interface DescriptionSection {
  title: string | null;
  paragraphs: string[];
}

export interface NormalizedDescription {
  sections: DescriptionSection[];
  disclaimers: string[];
}

function toSafeString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return (value as unknown[]).map(toSafeString).join(" ");
  if (typeof value === "object") return "";
  return String(value);
}

function isDisclaimer(text: string): boolean {
  const trimmed = text.trim();
  return (
    /^\*+/.test(trimmed) ||
    /^(trademark|registered trademark|all rights reserved)/i.test(trimmed)
  );
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function splitIntoSentences(text: string): string[] {
  const results: string[] = [];
  let current = "";
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    current += char;
    i++;

    if (!/[.!?]/.test(char)) continue;

    const rest = text.slice(i);
    if (!/^\s+[A-ZÁÉÍÓÚÜÑ*]/.test(rest)) continue;

    const cleaned = cleanText(current);
    if (cleaned.length > 0) results.push(cleaned);
    current = "";

    while (i < text.length && /\s/.test(text[i])) i++;
  }

  const remaining = cleanText(current);
  if (remaining.length > 0) results.push(remaining);
  return results;
}

function groupSentencesIntoParagraphs(sentences: string[], maxPerParagraph = 3): string[] {
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += maxPerParagraph) {
    paragraphs.push(sentences.slice(i, i + maxPerParagraph).join(" "));
  }
  return paragraphs;
}

function hasTitleColonPattern(text: string): boolean {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const titleLineCount = lines.filter((line) =>
    /^[A-ZÁÉÍÓÚÜÑ][^:\n]{3,60}:\s+[^\s]{5,}/.test(line)
  ).length;
  return titleLineCount >= 2;
}

function hasSemicolonPattern(text: string): boolean {
  return (/;/g.exec(text) || []).length >= 2;
}

function parseTitleColonBlocks(text: string): { title: string | null; content: string }[] {
  const lines = text.split(/\n+/).map(cleanText).filter(Boolean);
  const blocks: { title: string | null; content: string }[] = [];

  for (const line of lines) {
    const match = /^([^:.\n]{3,60}):\s+([\s\S]+)$/.exec(line);
    if (match) {
      blocks.push({ title: match[1].trim(), content: match[2].trim() });
    } else if (blocks.length > 0) {
      blocks.at(-1).content += " " + line;
    } else {
      blocks.push({ title: null, content: line });
    }
  }

  return blocks;
}

function parseSemicolonText(text: string): DescriptionSection {
  const parts = text.split(";").map(cleanText).filter(Boolean);
  return { title: null, paragraphs: parts };
}

export function normalizeDescription(rawText: unknown): NormalizedDescription {
  const text = toSafeString(rawText).trim();

  if (text.length === 0) {
    return { sections: [], disclaimers: [] };
  }

  const disclaimers: string[] = [];
  const contentLines: string[] = [];

  for (const line of text.split(/\n/)) {
    const trimmed = line.trim();
    if (trimmed.length > 0 && isDisclaimer(trimmed)) {
      disclaimers.push(cleanText(trimmed));
    } else {
      contentLines.push(line);
    }
  }

  const cleanedText = contentLines.join("\n").trim();

  if (!cleanedText) {
    return { sections: [], disclaimers };
  }

  // Estrategia 1: bloques "Título: contenido"
  if (hasTitleColonPattern(cleanedText)) {
    const sections = parseTitleColonBlocks(cleanedText).map(({ title, content }) => {
      if (hasSemicolonPattern(content)) {
        return { title, paragraphs: parseSemicolonText(content).paragraphs };
      }
      return { title, paragraphs: groupSentencesIntoParagraphs(splitIntoSentences(content), 2) };
    });
    return { sections, disclaimers };
  }

  // Estrategia 2: separado por punto y coma
  if (hasSemicolonPattern(cleanedText)) {
    return { sections: [parseSemicolonText(cleanedText)], disclaimers };
  }

  // Estrategia 3: texto plano
  const paragraphs = groupSentencesIntoParagraphs(
    splitIntoSentences(cleanedText.replaceAll("\n", " ")),
    3
  );
  return { sections: [{ title: null, paragraphs }], disclaimers };
}
