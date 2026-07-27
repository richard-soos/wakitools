"use client";

import React, { useState } from "react";
import { diffChars, diffLines, type Change } from "diff";
import ToolPageLayout from "@/components/ToolPageLayout";

type CompareSide = "left" | "right";

type LineChange = {
  value: string;
  added: boolean;
  removed: boolean;
};

//if diff(left, right) then: left: removed, right: added
type DiffRow = {
  left: LineChange | null;
  right: LineChange | null;
};

const splitLines = (value: string): string[] => {
  const lines = value.split("\n");

  if (value.endsWith("\n")) {
    lines.pop();
  }

  return lines;
};

// break records at \n
const splitDiffIntoLines = (diffs: Change[]): LineChange[] => {
  return diffs.flatMap((part) =>
    splitLines(part.value).map((line) => ({
      value: line,
      added: Boolean(part.added),
      removed: Boolean(part.removed),
    })),
  );
};

const buildDiffRows = (lines: LineChange[]): DiffRow[] => {
  const rows: DiffRow[] = [];

  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    // if line unchanged, push to both side
    if (!line.added && !line.removed) {
      rows.push({
        left: line,
        right: line,
      });

      index++;
      continue;
    }

    if (line.removed) {
      const removedLines: LineChange[] = []; //left side
      const addedLines: LineChange[] = []; //right side

      //push until first chain break
      while (index < lines.length && lines[index].removed) {
        removedLines.push(lines[index]);
        index++;
      }

      //push until first chain break
      while (index < lines.length && lines[index].added) {
        addedLines.push(lines[index]);
        index++;
      }

      const rowCount = Math.max(removedLines.length, addedLines.length);

      // pair removed and added lines
      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        rows.push({
          left: removedLines[rowIndex] ?? null,
          right: addedLines[rowIndex] ?? null,
        });
      }

      continue;
    }

    // if added, push to right
    if (line.added) {
      rows.push({
        left: null,
        right: line,
      });

      index++;
    }
  }

  return rows;
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

type TextPanelProps = {
  label: string;
  text: string;
  editing: boolean;
  rows: DiffRow[];
  side: CompareSide;
  setText: React.Dispatch<React.SetStateAction<string>>;
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

        <span className="text-xs text-muted">
          {text.length} characters
        </span>
      </div>

      {editing ? (
        <TextArea text={text} setText={setText} />
      ) : (
        <CompareView rows={rows} side={side} />
      )}
    </div>
  );
};

type EditLineNumbersProps = {
  text: string;
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

type CompareLineNumbersProps = {
  rows: DiffRow[];
  side: CompareSide;
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
          ? "bg-green-200 text-green-950"
          : line?.removed
            ? "bg-red-200 text-red-950"
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

type TextAreaProps = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
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

type CompareViewProps = {
  rows: DiffRow[];
  side: CompareSide;
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

type CompareRowProps = {
  row: DiffRow;
  side: CompareSide;
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
        ${line.added ? "bg-green-100" : line.removed ? "bg-red-100" : ""}
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
            line.added ? "text-green-950" : line.removed ? "text-red-950" : ""
          }
        >
          {isChanged ? renderWhitespace(line.value) : line.value || "\u00A0"}
        </span>
      )}
    </div>
  );
};

type CharacterDiffProps = {
  leftValue: string;
  rightValue: string;
  side: CompareSide;
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
                ? "bg-green-300 text-green-950"
                : part.removed
                  ? "bg-red-300 text-red-950"
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
