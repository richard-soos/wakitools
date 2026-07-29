import { WordDensityItem } from "@/components/pages/TextCounter";

export const calculateStats = (text: string) => {
  const trimmedText = text.trim();

  return {
    totalCount: {
      key: "totalCount",
      label: "Total Characters",
      value: text.length,
    },
    characterCountWithoutSpaces: {
      key: "characterCountWithoutSpaces",
      label: "Character Count Without Spaces",
      value: trimmedText.replace(/\s+/g, "").length,
    },
    wordCount: {
      key: "wordCount",
      label: "Word Count",
      value:
        trimmedText.length > 0
          ? trimmedText.replace(/\s+/g, " ").split(" ").length
          : 0,
    },
    sentenceCount: {
      key: "sentenceCount",
      label: "Sentence Count",
      value: trimmedText
        .replace(/[!?]/g, ".")
        .split(".")
        .filter((element) => element.trim().length > 0).length,
    },
    paragraphCount: {
      key: "paragraphCount",
      label: "Paragraph Count",
      value: trimmedText
        .split("\n")
        .filter((element) => element.trim().length > 0).length,
    },
    spaces: {
      key: "spaces",
      label: "Spaces",
      value: [...text].filter((char) => char === " ").length,
    },
  };
};

export const calculateWordDensity = (text: string) => {
  const words = text
    .toLocaleLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(" ")
    .filter(Boolean);

  const groupedWords = words.reduce<Record<string, number>>((acc, current) => {
    acc[current] = (acc[current] ?? 0) + 1;

    return acc;
  }, {});

  const result: Array<WordDensityItem> = [];
  for (const [key, value] of Object.entries(groupedWords)) {
    result.push({
      word: key,
      count: value,
      percentage: (value / text.length) * 100,
    });
  }

  result.sort(
    (wordDensityItem1, wordDensityItem2) =>
      wordDensityItem2.count - wordDensityItem1.count,
  );

  return result;
};
