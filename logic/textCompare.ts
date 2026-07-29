import { DiffRow, LineChange } from "@/components/pages/TextCompare";
import { Change } from "diff";

// break records at \n
export const splitDiffIntoLines = (diffs: Change[]): LineChange[] => {
  return diffs.flatMap((part) =>
    splitLines(part.value).map((line) => ({
      value: line,
      added: Boolean(part.added),
      removed: Boolean(part.removed),
    })),
  );
};

export const buildDiffRows = (lines: LineChange[]): DiffRow[] => {
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

export const splitLines = (value: string): string[] => {
  const lines = value.split("\n");

  if (value.endsWith("\n")) {
    lines.pop();
  }

  return lines;
};
