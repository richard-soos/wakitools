"use client";

import { useMemo, useState } from "react";

type Stat = {
  key: string;
  label: string;
  value: number;
};

type TextStats = {
  totalCount: Stat;
  characterCountWithoutSpaces: Stat;
  wordCount: Stat;
  sentenceCount: Stat;
  paragraphCount: Stat;
  spaces: Stat;
};

type WordDensityItem = {
  word: string;
  count: number;
  percentage: number;
};

const TextCounter = () => {
  const [text, setText] = useState("");

  const stats = useMemo<TextStats>(() => {
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
  }, [text]);

  const wordDensity = useMemo<Array<WordDensityItem>>(() => {
    const words = text
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .split(" ")
      .filter(Boolean);

    const groupedWords = words.reduce<Record<string, number>>(
      (acc, current) => {
        acc[current] = (acc[current] ?? 0) + 1;

        return acc;
      },
      {},
    );

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
  }, [text]);

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 p-4 sm:p-6 lg:grid-cols-[0.3fr_0.7fr]">
        <div className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-primary">Word density</h1>

          <p className="mt-2 text-muted">
            Find the most frequently used words.
          </p>
          {wordDensity.map((item) => (
            <DensityCard
              key={item.word}
              count={item.count}
              word={item.word}
              percentage={item.percentage}
            />
          ))}
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h1 className="text-3xl font-bold text-primary">Character Counter</h1>

          <p className="mt-2 text-muted">
            Count characters, words and lines instantly.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {Object.values(stats).map((stat) => (
              <StatCard key={stat.key} label={stat.label} value={stat.value} />
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text..."
            className="mt-6 min-h-64 w-full rounded-lg border border-border bg-surface-secondary p-4 focus:border-primary focus:outline-none"
          />
        </div>
      </div>
    </main>
  );
};

type StatCardProps = {
  label: string;
  value: number;
};

const StatCard = ({ label, value }: StatCardProps) => (
  <div className="rounded-lg border border-border bg-surface-secondary p-4">
    <p className="text-sm text-muted">{label}</p>
    <p className="mt-1 text-3xl font-bold">{value}</p>
  </div>
);

const DensityCard = ({ word, count, percentage }: WordDensityItem) => (
  <div className="rounded-lg border border-border bg-surface-secondary p-4 flex items-center">
    <p className="flex-1 font-bold">{word}</p>
    <div className="flex flex-col text-right">
      <p className="text-sm text-muted">{count}</p>
      <p className="text-sm text-muted">{percentage.toFixed(2)}%</p>
    </div>
  </div>
);

export default TextCounter;
