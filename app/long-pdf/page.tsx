"use client";

import {
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  LockKeyhole,
  UploadCloud,
  X,
} from "lucide-react";
import { PDFDocument } from "pdf-lib";
import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useState,
} from "react";
import ToolPageLayout from "@/components/ToolPageLayout";

const LongPdf = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectFile = (file?: File) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    setError(null);
    setPdfFile(file);

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
  };

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);

    selectFile(event.dataTransfer.files?.[0]);
  };

  const removeFile = () => {
    setPdfFile(null);
    setError(null);

    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    }
  };

  const convertIntoOnePage = async () => {
    if (!pdfFile) return;

    setIsConverting(true);
    setError(null);

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();

      if (pages.length === 0) {
        throw new Error("The PDF does not contain any pages.");
      }

      let maxWidth = 0;
      let totalHeight = 0;

      pages.forEach((page) => {
        maxWidth = Math.max(maxWidth, page.getWidth());
        totalHeight += page.getHeight();
      });

      const newPdf = await PDFDocument.create();
      const longPage = newPdf.addPage([maxWidth, totalHeight]);
      const embeddedPages = await newPdf.embedPages(pages);

      let currentY = totalHeight;

      embeddedPages.forEach((page) => {
        currentY -= page.height;

        longPage.drawPage(page, {
          x: 0,
          y: currentY,
        });
      });

      const newPdfBytes = await newPdf.save();
      const blobBytes = new Uint8Array(newPdfBytes);
      const blob = new Blob([blobBytes], {
        type: "application/pdf",
      });

      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }

      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      setError("The PDF could not be converted.");
    } finally {
      setIsConverting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [resultUrl]);

  const outputFilename = pdfFile
    ? `${pdfFile.name.replace(/\.pdf$/i, "")}-long.pdf`
    : "long-document.pdf";

  return (
    <ToolPageLayout
      title="Long PDF"
      description="Combine every page of a PDF into one continuous page."
    >
      <div className="mx-auto w-full max-w-3xl">
        <section className="rounded-3xl border border-border bg-surface p-4 shadow-[0_1.5rem_4rem_rgba(19,32,29,0.08)] sm:p-7 dark:shadow-[0_1.5rem_4rem_rgba(0,0,0,0.22)]">
          {!pdfFile ? (
            <label
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center outline-none transition focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface ${
                isDragging
                  ? "scale-[0.99] border-primary bg-primary-soft"
                  : "border-border bg-surface-secondary hover:border-primary/60 hover:bg-primary-soft"
              }`}
            >
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileInput}
                className="sr-only"
              />

              <div className="mb-5 grid size-14 place-items-center rounded-2xl border border-border bg-surface text-primary shadow-sm">
                <UploadCloud className="size-6" aria-hidden="true" />
              </div>

              <p className="text-base font-semibold">Drop your PDF here</p>

              <p className="mt-2 text-sm text-muted">
                or click to choose one from your device
              </p>

              <span className="mt-5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground shadow-sm">
                Choose PDF
              </span>
            </label>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface-secondary p-4 sm:p-5">
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <FileText className="size-5" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {pdfFile.name}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    PDF · {formatFileSize(pdfFile.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <X className="size-4" aria-hidden="true" />
                  Remove
                </button>
              </div>

              <button
                type="button"
                onClick={convertIntoOnePage}
                disabled={isConverting}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 font-semibold text-background shadow-sm transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
                aria-busy={isConverting}
              >
                {isConverting ? (
                  <>
                    <span className="mr-2 size-4 animate-spin rounded-full border-2 border-background/40 border-t-background" />
                    Converting...
                  </>
                ) : (
                  <>
                    Convert PDF
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <p
              className="mt-5 rounded-xl border border-red-600/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
              role="alert"
            >
              {error}
            </p>
          )}

          {resultUrl && (
            <div
              className="mt-5 rounded-2xl border border-primary/20 bg-primary-soft p-4 sm:p-5"
              aria-live="polite"
            >
              <div className="mb-5 flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-background">
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    Your long PDF is ready
                  </p>

                  <p className="mt-1 text-sm text-muted">
                    Review the result before downloading it.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={resultUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-foreground transition hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Open PDF
                  <ExternalLink className="ml-2 size-4" aria-hidden="true" />
                </a>

                <a
                  href={resultUrl}
                  download={outputFilename}
                  className="flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-background transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Download className="mr-2 size-4" aria-hidden="true" />
                  Download
                </a>
              </div>
            </div>
          )}
        </section>

        <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted">
          <LockKeyhole className="size-3.5" aria-hidden="true" />
          Your file stays on this device and is never uploaded.
        </div>
      </div>
    </ToolPageLayout>
  );
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default LongPdf;
