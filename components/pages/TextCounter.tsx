"use client";

import { useMemo, useState } from "react";
import ToolPageLayout from "@/components/ToolPageLayout";
import { calculateStats, calculateWordDensity } from "@/logic/textCounter";

//#region Types

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

export type WordDensityItem = {
  word: string;
  count: number;
  percentage: number;
};

//#endregion

const TextCounter = () => {
  const [text, setText] = useState("");

  const stats = useMemo<TextStats>(() => {
    return calculateStats(text);
  }, [text]);

  const wordDensity = useMemo<Array<WordDensityItem>>(() => {
    return calculateWordDensity(text);
  }, [text]);

  return (
    <ToolPageLayout
      title="Text Counter"
      description="Count characters, words and lines instantly."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.3fr_0.7fr]">
        <section className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-xl font-bold">Word density</h2>

          <p className="text-sm text-muted">
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
        </section>

        <section className="rounded-xl border border-border bg-surface p-6">
          <h2 className="text-xl font-bold">Text statistics</h2>

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
        </section>
      </div>
    </ToolPageLayout>
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
