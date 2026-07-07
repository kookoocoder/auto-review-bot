"use client";

import Papa from "papaparse";
import { useRef, useState } from "react";

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
      <div className="rounded-lg border border-zinc-200 p-4">
        <label className="block text-sm font-medium text-zinc-700">
          Upload CSV
        </label>
        <p className="mt-1 text-xs text-zinc-500">
          One review per row. Use a <code className="text-zinc-600">text</code>{" "}
          column header, or a single column with no header.
        </p>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={onFileChange}
          className="mt-3 block w-full text-sm text-zinc-600 file:mr-3 file:rounded-md file:border file:border-zinc-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-50"
        />
      </div>

      {isParsing ? (
        <p className="text-sm text-zinc-500">Parsing CSV…</p>
      ) : null}

      {parseError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {parseError}
        </p>
      ) : null}

      {texts.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-zinc-600">
            {fileName ? (
              <>
                <span className="font-medium text-zinc-800">{fileName}</span>
                {" · "}
              </>
            ) : null}
            {texts.length} review line{texts.length === 1 ? "" : "s"} ready to
            import
          </p>

          {showLowCountWarning ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Fewer than {MIN_RECOMMENDED_ROWS} lines uploaded. Add at least{" "}
              {MIN_RECOMMENDED_ROWS} varied lines for best rotation.
            </p>
          ) : null}
        </div>
      ) : null}

      <input type="hidden" name="texts" value={JSON.stringify(texts)} readOnly />

      <button
        type="submit"
        disabled={texts.length === 0 || isParsing}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Import review lines
      </button>
    </form>
  );
}
