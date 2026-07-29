"use client";

import React, { useState } from "react";
import { diffChars, diffLines } from "diff";
import ToolPageLayout from "@/components/ToolPageLayout";
import { buildDiffRows, splitDiffIntoLines } from "@/logic/textCompare";

type CompareSide = "left" | "right";

export type LineChange = {
  value: string;
  added: boolean;
  removed: boolean;
};

//if diff(left, right) then: left: removed, right: added
export type DiffRow = {
  left: LineChange | null;
  right: LineChange | null;
};

//UI TYPES

type TextPanelProps = {
  label: string;
  text: string;
  editing: boolean;
  rows: DiffRow[];
  side: CompareSide;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

type EditLineNumbersProps = {
  text: string;
};

type CompareLineNumbersProps = {
  rows: DiffRow[];
  side: CompareSide;
};

type CharacterDiffProps = {
  leftValue: string;
  rightValue: string;
  side: CompareSide;
};

type CompareRowProps = {
  row: DiffRow;
  side: CompareSide;
};

type CompareViewProps = {
  rows: DiffRow[];
  side: CompareSide;
};

type TextAreaProps = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

const TextCompare = () => {
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");

  const [rows, setRows] = useState<DiffRow[]>([]);
  const [editing, setEditing] = useState(true);

  //using external lib
  const compare = () => {
    setEditing((current) => !current);

    //if state was not editing, should return
    if (!editing) return;

    const rawLineDiff = diffLines(leftText, rightText);
    const lineChanges = splitDiffIntoLines(rawLineDiff);
    const diffRows = buildDiffRows(lineChanges);

    setRows(diffRows);
  };

  return (
    <ToolPageLayout
      title="Text Compare"
      description="Compare two texts and highlight their differences."
      action={
        <button
          type="button"
          onClick={compare}
          disabled={editing && !leftText && !rightText}
          className="
              rounded-lg
              bg-primary
              w-full
              px-5
              py-2.5
              font-medium
              text-background
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
        >
          {editing ? "Compare" : "Edit texts"}
        </button>
      }
    >
      <section className="w-full rounded-xl border border-border bg-surface p-3 shadow-sm sm:p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TextPanel
            label="Original text"
            text={leftText}
            editing={editing}
            rows={rows}
            side="left"
            setText={setLeftText}
          />

          <TextPanel
            label="Modified text"
            text={rightText}
            editing={editing}
            rows={rows}
            side="right"
            setText={setRightText}
          />
        </div>
      </section>
    </ToolPageLayout>
  );
};

const TextPanel = ({
  label,
  text,
  editing,
  rows,
  side,
  setText,
}: TextPanelProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{label}</h2>

        <span className="text-xs text-muted">{text.length} characters</span>
      </div>

      {editing ? (
        <TextArea text={text} setText={setText} />
      ) : (
        <CompareView rows={rows} side={side} />
      )}
    </div>
  );
};

const EditLineNumbers = ({ text }: EditLineNumbersProps) => {
  return (
    <div
      className="
        flex
        w-[58px]
        shrink-0
        flex-col
        border-r
        border-border
        bg-surface
        p-4
        text-right
        font-mono
        leading-6
        text-muted
        select-none
      "
    >
      {text.split("\n").map((_, index) => (
        <span key={index}>{index + 1}</span>
      ))}
    </div>
  );
};

const CompareLineNumbers = ({ rows, side }: CompareLineNumbersProps) => {
  let lineNumber = 0;

  return (
    <div
      className="
        flex
        w-[58px]
        shrink-0
        flex-col
        border-r
        border-border
        bg-surface
        py-4
        text-right
        font-mono
        leading-6
        text-muted
        select-none
      "
    >
      {rows.map((row, index) => {
        const line = side === "left" ? row.left : row.right;

        if (line !== null) {
          lineNumber++;
        }

const lineClassName = line?.added
  ? "bg-green-200 text-green-950 dark:bg-green-500/25 dark:text-green-100"
  : line?.removed
    ? "bg-red-200 text-red-950 dark:bg-red-500/25 dark:text-red-100"
    : "";

        return (
          <span key={index} className={`w-[58px] ${lineClassName}`}>
            {line !== null ? lineNumber : "\u00A0"}
          </span>
        );
      })}
    </div>
  );
};

const TextArea = ({ text, setText }: TextAreaProps) => {
  return (
    <div className="flex min-w-0 overflow-hidden rounded-lg border border-border">
      <EditLineNumbers text={text} />

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Start typing or paste your text..."
        wrap="off"
        spellCheck={false}
        className="
          min-h-80
          min-w-0
          flex-1
          resize-none
          overflow-x-auto
          overflow-y-hidden
          bg-surface-secondary
          p-4
          font-mono
          leading-6
          outline-none
          transition
          placeholder:text-muted
          focus:bg-surface
        "
      />
    </div>
  );
};

const CompareView = ({ rows, side }: CompareViewProps) => {
  return (
    <div className="flex min-w-0 overflow-hidden rounded-lg border border-border">
      <CompareLineNumbers rows={rows} side={side} />

      <div
        className="
          min-h-80
          min-w-0
          flex-1
          overflow-x-auto
          bg-surface-secondary
          py-4
          font-mono
          leading-6
        "
      >
        {rows.map((row, index) => (
          <CompareRow key={index} row={row} side={side} />
        ))}
      </div>
    </div>
  );
};

const CompareRow = ({ row, side }: CompareRowProps) => {
  const line = side === "left" ? row.left : row.right;
  const oppositeLine = side === "left" ? row.right : row.left;

  // placeholder, blank row
  if (line === null) {
    return (
      <div
        className="
          h-6
          min-w-max
          bg-foreground/5
          
        "
      >
        {"\u00A0"}
      </div>
    );
  }

  const isChanged = line.added || line.removed;

  const isModifiedPair =
    oppositeLine !== null &&
    isChanged &&
    (oppositeLine.added || oppositeLine.removed);

  return (
    <div
      className={`
        h-6
        min-w-max
        whitespace-pre
        px-4
                      ${line.added ? "bg-green-100 dark:bg-green-500/15" : line.removed ? "bg-red-100 dark:bg-red-500/15" : ""}
      `}
    >
      {isModifiedPair ? (
        <CharacterDiff
          leftValue={side === "left" ? line.value : oppositeLine.value}
          rightValue={side === "right" ? line.value : oppositeLine.value}
          side={side}
        />
      ) : (
        <span
                          className={
                            line.added
                              ? "text-green-950 dark:text-green-200"
                              : line.removed
                                ? "text-red-950 dark:text-red-200"
                                : ""
                          }
        >
          {isChanged ? renderWhitespace(line.value) : line.value || "\u00A0"}
        </span>
      )}
    </div>
  );
};

const CharacterDiff = ({ leftValue, rightValue, side }: CharacterDiffProps) => {
  const charDiffs = diffChars(leftValue, rightValue);

  return (
    <>
      {charDiffs.map((part, index) => {
        if (side === "left" && part.added) {
          return null;
        }

        if (side === "right" && part.removed) {
          return null;
        }

        const isChanged = Boolean(part.added || part.removed);

        return (
          <span
            key={index}
                              className={
                                part.added
                                  ? "bg-green-300 text-green-950 dark:bg-green-400/30 dark:text-green-100"
                                  : part.removed
                                    ? "bg-red-300 text-red-950 dark:bg-red-400/30 dark:text-red-100"
                                    : ""
                              }
          >
            {isChanged ? renderWhitespace(part.value) : part.value}
          </span>
        );
      })}
    </>
  );
};

const renderWhitespace = (value: string): React.ReactNode => {
  if (value === "") {
    return "\u00A0";
  }

  return value.split("").map((character, index) => {
    if (character === " ") {
      return (
        <span key={index} className="opacity-60">
          ·
        </span>
      );
    }

    if (character === "\t") {
      return (
        <span key={index} className="opacity-60">
          →
        </span>
      );
    }

    return <React.Fragment key={index}>{character}</React.Fragment>;
  });
};

export default TextCompare;
