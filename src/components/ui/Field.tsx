import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import type { ContactFieldSpec } from "@/lib/contacts/schema";

const CONTROL =
  "w-full rounded-md border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:bg-input";

/**
 * One labelled form control, driven by the field metadata in
 * `lib/contacts/schema.ts` so the form and its validation cannot drift apart.
 */
export default function Field({
  field,
  defaultValue,
  error,
}: {
  field: ContactFieldSpec;
  defaultValue?: string;
  error?: string;
}) {
  const id = `field-${field.name}`;
  const errorId = `${id}-error`;
  const borderClass = error
    ? "border-destructive focus:border-destructive"
    : "border-border focus:border-primary";
  const [dataUrlValue, setDataUrlValue] = useState(defaultValue ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDataUrlValue(defaultValue ?? "");
  }, [defaultValue]);

  const handleFile = (file?: File | null) => {
    if (!file) return;

    const type = file.type.toLowerCase();
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(type)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setDataUrlValue(result);
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const shared = {
    id,
    name: field.name,
    defaultValue,
    maxLength: field.maxLength,
    required: field.required,
    placeholder: field.placeholder,
    autoComplete: field.autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: `${CONTROL} ${borderClass}`,
  };

  if (field.type === "file") {
    return (
      <div className={field.wide ? "sm:col-span-2" : undefined}>
        <label
          htmlFor={id}
          className="mb-1.5 block text-[13px] font-medium text-foreground"
        >
          {field.label}
          {field.required ? (
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
          ) : (
            <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
              optional
            </span>
          )}
        </label>

        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className="space-y-2"
        >
          <input
            ref={hiddenInputRef}
            type="hidden"
            name={field.name}
            value={dataUrlValue}
          />

          <input
            ref={fileInputRef}
            id={id}
            type="file"
            accept={field.accept}
            onChange={handleFileChange}
            className={`${CONTROL} ${borderClass} cursor-pointer file:mr-3 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1 file:text-sm file:text-foreground`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
        </div>

        {error ? (
          <p id={errorId} role="alert" className="mt-1.5 text-[13px] text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={field.wide ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium text-foreground"
      >
        {field.label}
        {field.required ? (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
            optional
          </span>
        )}
      </label>

      {field.type === "textarea" ? (
        <textarea {...shared} rows={4} className={`${shared.className} resize-y`} />
      ) : (
        <input {...shared} type={field.type ?? "text"} />
      )}

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-[13px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
