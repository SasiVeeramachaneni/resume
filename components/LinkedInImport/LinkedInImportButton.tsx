"use client";

import React, { useEffect } from "react";
import { Button, ActionIcon, Notification, Tooltip } from "@mantine/core";
import { IconBrandLinkedin, IconCheck } from "@tabler/icons-react";
import { useLinkedInImport } from "@/hooks/useLinkedInImport";

interface LinkedInImportButtonProps {
  variant?: "button" | "icon";
}

export function LinkedInImportButton({
  variant = "button",
}: LinkedInImportButtonProps) {
  const { status, error, importedFields, importFromLinkedIn, reset } =
    useLinkedInImport();

  // Auto-clear the success notification after a few seconds.
  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(reset, 4000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [status, reset]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  const label = (() => {
    if (isLoading) return "Importing...";
    if (isSuccess)
      return `Imported ${importedFields} field${importedFields === 1 ? "" : "s"}`;
    if (status === "error") return "Retry LinkedIn";
    return "Connect with LinkedIn";
  })();

  const leftSection = isSuccess ? (
    <IconCheck size={18} />
  ) : (
    <IconBrandLinkedin size={18} />
  );
  const color = isSuccess ? "teal" : "#0a66c2";

  return (
    <>
      {variant === "icon" ? (
        <Tooltip label={label} position="bottom">
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Connect with LinkedIn"
            onClick={importFromLinkedIn}
            disabled={isLoading}
            loading={isLoading}
            color={isSuccess ? "teal" : "blue"}
          >
            {leftSection}
          </ActionIcon>
        </Tooltip>
      ) : (
        <Button
          onClick={importFromLinkedIn}
          disabled={isLoading}
          loading={isLoading}
          color={color}
          leftSection={leftSection}
          variant="default"
        >
          {label}
        </Button>
      )}

      {status === "error" && error && (
        <Notification
          color="red"
          title="LinkedIn import failed"
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
    </>
  );
}

export default LinkedInImportButton;
