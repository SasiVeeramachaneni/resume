"use client";
import React, { useRef, useState } from "react";
import { Box, Text, Group, ThemeIcon, Notification } from "@mantine/core";
import { IconUpload, IconFileTypePdf, IconX } from "@tabler/icons-react";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { usePdfImport } from "@/hooks/usePdfImport";

export function PdfDropZone() {
  const { status, error, importFromFile, reset } = usePdfImport();
  const [dragError, setDragError] = useState<string | null>(null);

  const handleDrop = async (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      setDragError(null);
      await importFromFile(file as File);
    }
  };

  const handleReject = () => {
    setDragError("Only PDF files are accepted.");
    setTimeout(() => setDragError(null), 3000);
  };

  return (
    <>
      <Dropzone
        onDrop={handleDrop}
        onReject={handleReject}
        maxSize={10 * 1024 * 1024}
        accept={["application/pdf"]}
        maxFiles={1}
        loading={status === "loading"}
        style={{
          borderWidth: 1.5,
          borderStyle: "dashed",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <Group justify="center" gap="xl" mih={90} style={{ pointerEvents: "none" }}>
          <Dropzone.Accept>
            <ThemeIcon size={44} radius="xl" color="blue">
              <IconUpload size={22} />
            </ThemeIcon>
          </Dropzone.Accept>
          <Dropzone.Reject>
            <ThemeIcon size={44} radius="xl" color="red">
              <IconX size={22} />
            </ThemeIcon>
          </Dropzone.Reject>
          <Dropzone.Idle>
            <ThemeIcon size={44} radius="xl" variant="light" color="blue">
              <IconFileTypePdf size={22} />
            </ThemeIcon>
          </Dropzone.Idle>

          <div>
            <Text size="sm" fw={600} ta="center">
              Drag your resume PDF here, or click to browse
            </Text>
            <Text size="xs" c="dimmed" ta="center" mt={4}>
              We&apos;ll extract your details so you can keep editing. Works best with PDFs created here.
            </Text>
          </div>
        </Group>
      </Dropzone>

      {(error || dragError) && (
        <Notification
          color="red"
          title="Upload failed"
          onClose={() => {
            reset();
            setDragError(null);
          }}
          mt="sm"
        >
          {error || dragError}
        </Notification>
      )}
    </>
  );
}

export default PdfDropZone;
