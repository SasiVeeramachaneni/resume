'use client';
import { useState } from 'react';
import { Image, ActionIcon, rem } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { IconCamera } from "@tabler/icons-react";

export function ImageUpload() {
    const [file, setFile] = useState<FileWithPath | null>(null);
    const [imageUploaded, setImageUploaded] = useState(false);

    const handleDrop = (files: FileWithPath[]) => {
        setFile(files[0]); // Only upload the first file
        setImageUploaded(true);
    };

    const imageNotUploaded = (
        <ActionIcon size={110} radius="xl" color="#E5E4E2" variant="filled">
            <IconCamera style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
        </ActionIcon>
    );

    const preview = file ? (
        <Image
            height={120}
            fit="contain"
            radius="xl"
            src={URL.createObjectURL(file)}
        />
    ) : null;

    return (
        <>
                <Dropzone accept={IMAGE_MIME_TYPE} onDrop={handleDrop}>
                    {!imageUploaded ? imageNotUploaded : preview}
                </Dropzone>

        </>
    );
}
