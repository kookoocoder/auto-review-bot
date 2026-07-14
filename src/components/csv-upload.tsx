"use client";

import Papa from "papaparse";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconUpload } from "@/components/icons";

const MAX_TEXT_LENGTH = 300;
const MIN_RECOMMENDED_ROWS = 15;

type Props = {
  action: (formData: FormData) => void | Promise<void>;
};

function normalizeTexts(raw: string[]): string[] {
  return raw
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map((value) =>
      value.length > MAX_TEXT_LENGTH ? value.slice(0, MAX_TEXT_LENGTH) : value,
    );
}

function parseCsvFile(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields?.includes("text")) {
          resolve(
            normalizeTexts(results.data.map((row) => String(row.text ?? ""))),
          );
          return;
        }

        Papa.parse<string[]>(file, {
          header: false,
          skipEmptyLines: true,
          complete: (noHeaderResults) => {
            const rows = noHeaderResults.data as string[][];
            if (rows.length === 0) {
              resolve([]);
              return;
            }

            const firstCell = String(rows[0]?.[0] ?? "")
              .trim()
              .toLowerCase();
            const dataRows = firstCell === "text" ? rows.slice(1) : rows;
            resolve(normalizeTexts(dataRows.map((row) => String(row[0] ?? ""))));
          },
          error: (error) => reject(error),
        });
      },
      error: (error) => reject(error),
    });
  });
}

export function CsvUpload({ action }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [texts, setTexts] = useState<string[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setParseError(null);
    setTexts([]);
    setFileName(null);

    if (!file) return;

    setIsParsing(true);
    try {
      const parsed = await parseCsvFile(file);
      if (parsed.length === 0) {
        setParseError("No review lines found in this CSV.");
        return;
      }
      setFileName(file.name);
      setTexts(parsed);
    } catch {
      setParseError("Could not parse this CSV file.");
    } finally {
      setIsParsing(false);
    }
  }

  function onSubmit() {
    formRef.current?.reset();
    setTexts([]);
    setFileName(null);
    setParseError(null);
  }

  const showLowCountWarning = texts.length > 0 && texts.length < MIN_RECOMMENDED_ROWS;

  return (
    <form ref={formRef} action={action} onSubmit={onSubmit} className="space-y-3">
      <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-5">
        <label className="flex cursor-pointer flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
            <IconUpload className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-foreground">Import from CSV</span>
          <span className="mt-1 text-xs text-muted-foreground">
            One review per row. Use a <code className="text-foreground font-semibold">text</code>{" "}
            column, or a single column with no header.
          </span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={onFileChange}
            className="mt-3 block w-full max-w-xs text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border file:border-border file:bg-muted/50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted"
          />
        </label>
      </div>

      {isParsing ? (
        <p className="text-sm text-muted-foreground">Parsing CSV…</p>
      ) : null}

      {parseError ? (
        <Alert variant="destructive">
          <AlertDescription>{parseError}</AlertDescription>
        </Alert>
      ) : null}

      {texts.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {fileName ? (
              <>
                <span className="font-medium text-foreground">{fileName}</span>
                {" · "}
              </>
            ) : null}
            {texts.length} review line{texts.length === 1 ? "" : "s"} ready to
            import
          </p>

          {showLowCountWarning ? (
            <Alert className="border-warning/20 bg-warning-soft text-warning dark:bg-warning-soft/10">
              <AlertDescription>
                Fewer than {MIN_RECOMMENDED_ROWS} lines uploaded. Add at least{" "}
                {MIN_RECOMMENDED_ROWS} varied lines for best rotation.
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
      ) : null}

      <input type="hidden" name="texts" value={JSON.stringify(texts)} readOnly />

      <Button
        type="submit"
        disabled={texts.length === 0 || isParsing}
      >
        Import review lines
      </Button>
    </form>
  );
}

