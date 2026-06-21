import { useState, useContext } from 'react';
import { Image, ActionIcon, rem } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { IconCamera } from "@tabler/icons-react";
import { ResumeContext } from '../declarations/ResumeContext';

export function ImageUpload() {
    const resumeContext = useContext(ResumeContext);
    if (!resumeContext) {
        throw new Error('ResumeContext must be used within a ResumeProvider');
    }

    const { resumeData, updatePersonalInfo } = resumeContext;
    const [imageUploaded, setImageUploaded] = useState(!!resumeData.personalInfo.image);

    const handleDrop = (files: FileWithPath[]) => {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = () => {
            updatePersonalInfo('image', reader.result as string);
            setImageUploaded(true);
        };
        reader.readAsDataURL(file);
    };

    const imageNotUploaded = (
        <ActionIcon size={110} radius="xl" color="#E5E4E2" variant="filled">
            <IconCamera style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
        </ActionIcon>
    );

    const preview = resumeData.personalInfo.image ? (
        <Image
            height={120}
            fit="contain"
            radius="lg"
            src={resumeData.personalInfo.image}
        />
    ) : null;

    return (
        <Dropzone accept={IMAGE_MIME_TYPE} onDrop={handleDrop}>
            {!imageUploaded ? imageNotUploaded : preview}
        </Dropzone>
    );
}
