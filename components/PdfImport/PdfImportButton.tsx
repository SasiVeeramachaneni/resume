"use client";
import React, { useEffect, useRef } from "react";
import { Button, ActionIcon, Notification, Tooltip } from "@mantine/core";
import { IconUpload, IconCheck, IconFileTypePdf } from "@tabler/icons-react";
import { usePdfImport } from "@/hooks/usePdfImport";

interface PdfImportButtonProps {
  variant?: "button" | "icon" | "large";
  label?: string;
}

export function PdfImportButton({ variant = "button", label }: PdfImportButtonProps) {
  const { status, error, importedCount, importFromFile, reset } = usePdfImport();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(reset, 3500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [status, reset]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importFromFile(file);
      // reset input so same file can be selected again
      e.target.value = "";
    }
  };

  const defaultLabel = (() => {
    if (isLoading) return "Reading PDF...";
    if (isSuccess) return `Imported ${importedCount} fields`;
    if (status === "error") return "Retry upload";
    return label || "Upload Resume PDF";
  })();

  const leftSection = isSuccess ? <IconCheck size={18} /> : variant === "large" ? <IconFileTypePdf size={20} /> : <IconUpload size={18} />;

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: "none" }}
        onChange={handleFileChange}
        aria-hidden
        tabIndex={-1}
      />

      {variant === "icon" ? (
        <Tooltip label={defaultLabel} position="bottom">
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Upload Resume PDF"
            onClick={handleClick}
            loading={isLoading}
            disabled={isLoading}
            color={isSuccess ? "teal" : undefined}
          >
            {isSuccess ? <IconCheck size={18} /> : <IconUpload size={18} />}
          </ActionIcon>
        </Tooltip>
      ) : variant === "large" ? (
        <Button
          onClick={handleClick}
          loading={isLoading}
          disabled={isLoading}
          color={isSuccess ? "teal" : "blue"}
          leftSection={leftSection}
          size="md"
          radius="xl"
          variant={isSuccess ? "filled" : "filled"}
        >
          {defaultLabel}
        </Button>
      ) : (
        <Button
          onClick={handleClick}
          loading={isLoading}
          disabled={isLoading}
          color={isSuccess ? "teal" : undefined}
          leftSection={leftSection}
          variant="default"
        >
          {defaultLabel}
        </Button>
      )}

      {status === "error" && error && (
        <Notification
          color="red"
          title="PDF import failed"
          onClose={reset}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            maxWidth: 420,
          }}
        >
          {error}
        </Notification>
      )}

      {status === "success" && (
        <Notification
          color="teal"
          title="PDF imported"
          onClose={reset}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            maxWidth: 420,
          }}
        >
          Resume loaded. Redirecting to editor...
        </Notification>
      )}
    </>
  );
}

export default PdfImportButton;
