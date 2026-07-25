import { Box, Text, Textarea } from "@mantine/core";
import { useContext } from "react";
import { ResumeContext } from "@/components/declarations/ResumeContext";
import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import type { TemplateLayoutProps } from "../types";

// Photo layout for Template 3:
// Full-height dark sidebar on the left (~35%) with photo, contact info, skills, certifications, languages, patents.
// White main area on the right (~65%) with name, title, profile (about me), experience, projects, education, awards.
export function PhotoLayout({
  sections,
  isPatents,
  isPersonalProjects,
  isLanguages,
  wrapSection,
}: TemplateLayoutProps) {
  const resumeContext = useContext(ResumeContext);
  if (!resumeContext) {
    throw new Error("ResumeContext must be used within a ResumeProvider");
  }

  const { resumeData, updatePersonalInfo } = resumeContext;
  const { name, title, aboutMe, phoneNumber, email, linkedIn, github } =
    resumeData.personalInfo;
  const { settings } = resumeData;

  const handlePersonalInfoChange = (
    field: keyof typeof resumeData.personalInfo,
    value: string,
  ) => {
    updatePersonalInfo(field, value);
  };

  return (
    <div className="photo-template">
      {/* Left sidebar with dark background */}
      <div className="photo-template-sidebar">
        {/* Profile photo centered and styled as a perfect circle */}
        {settings.isImage && (
          <div className="photo-template-avatar-container">
            <ImageUpload />
          </div>
        )}

        {/* Contact Section vertically stacked */}
        <div style={{ marginBottom: "24px" }}>
          <h3 className="sidebar-contact-title">Contact</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {/* Phone */}
            {phoneNumber !== undefined && (
              <div>
                <Text size="xs" className="sidebar-field-label">
                  Phone
                </Text>
                <input
                  value={phoneNumber}
                  placeholder="+1 2345 6789"
                  onChange={(e) =>
                    handlePersonalInfoChange("phoneNumber", e.target.value)
                  }
                  className="sidebar-input"
                />
              </div>
            )}

            {/* Email */}
            {email !== undefined && (
              <div>
                <Text size="xs" className="sidebar-field-label">
                  Email
                </Text>
                <input
                  value={email}
                  placeholder="max.johnson@email.com"
                  onChange={(e) =>
                    handlePersonalInfoChange("email", e.target.value)
                  }
                  className="sidebar-input"
                />
              </div>
            )}

            {/* LinkedIn */}
            {settings.isLinkedIn && linkedIn !== undefined && (
              <div>
                <Text size="xs" className="sidebar-field-label">
                  LinkedIn
                </Text>
                <input
                  value={linkedIn}
                  placeholder="linkedin.com/in/username"
                  onChange={(e) =>
                    handlePersonalInfoChange("linkedIn", e.target.value)
                  }
                  className="sidebar-input"
                />
              </div>
            )}

            {/* GitHub */}
            {settings.isGithub && github !== undefined && (
              <div>
                <Text size="xs" className="sidebar-field-label">
                  GitHub
                </Text>
                <input
                  value={github}
                  placeholder="github.com/username"
                  onChange={(e) =>
                    handlePersonalInfoChange("github", e.target.value)
                  }
                  className="sidebar-input"
                />
              </div>
            )}
          </div>
        </div>

        {/* Other sidebar sections */}
        <div className="sidebar-sections-wrapper">
          {wrapSection("skills", sections.skills)}
          {wrapSection("certifications", sections.certifications)}
          {isLanguages && wrapSection("languages", sections.languages)}
          {isPatents && wrapSection("patents", sections.patents)}
        </div>
      </div>

      {/* Right main area with white background */}
      <div className="photo-template-main">
        {/* HUGE all-caps Name and Title */}
        <div style={{ marginBottom: "28px" }}>
          <Textarea
            variant="unstyled"
            placeholder="YOUR NAME"
            autosize
            minRows={1}
            maxRows={3}
            value={name || ""}
            onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
            className="main-name-textarea"
          />
          <Textarea
            variant="unstyled"
            placeholder="UX Designer"
            autosize
            minRows={1}
            maxRows={3}
            value={title || ""}
            onChange={(e) => handlePersonalInfoChange("title", e.target.value)}
            className="main-title-textarea"
          />
        </div>

        {/* Profile (About Me) heading and content */}
        <div className="profile-section-container">
          <h3>Profile</h3>
          <Textarea
            variant="unstyled"
            placeholder="Experienced UX Designer specializing in user research, interaction design..."
            autosize
            minRows={1}
            maxRows={8}
            value={aboutMe || ""}
            onChange={(e) =>
              handlePersonalInfoChange("aboutMe", e.currentTarget.value)
            }
            className="profile-textarea"
          />
        </div>

        {/* Dynamic resume sections */}
        <div className="main-sections-wrapper">
          {wrapSection("workExperience", sections.workExperience)}
          {isPersonalProjects && wrapSection("projects", sections.projects)}
          {wrapSection("education", sections.education)}
          {wrapSection("awards", sections.awards)}
        </div>
      </div>

      {/* Global stylesheet for Photo layout */}
      <style>{`
        /* True 2-column layout extending full height of the container */
        .photo-template {
          display: flex;
          flex-direction: row;
          width: 100%;
          min-height: 297mm; /* Standard A4 height */
          background-color: #ffffff;
          font-family: inherit;
        }

        /* Sidebar column */
        .photo-template-sidebar {
          width: 28%;
          background-color: #1e2531; /* Deep navy slate color */
          color: #ecf0f1;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          box-sizing: border-box;
        }

        /* Sidebar contact title */
        .photo-template-sidebar .sidebar-contact-title {
          color: #ffffff !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          letter-spacing: 1.5px !important;
          text-transform: uppercase !important;
          margin: 0 0 12px 0 !important;
          padding-bottom: 6px !important;
          border-bottom: 1.5px solid rgba(255, 255, 255, 0.2) !important;
        }

        /* Sidebar labels & inputs styling */
        .photo-template-sidebar .sidebar-field-label {
          color: #95a5a6 !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px !important;
          text-transform: uppercase !important;
          margin-bottom: 2px !important;
          font-size: 11px !important;
        }

        .photo-template-sidebar .sidebar-input {
          background-color: transparent !important;
          border: none !important;
          color: #ffffff !important;
          font-size: 13px !important;
          padding: 0 !important;
          width: 100% !important;
          outline: none !important;
          font-family: inherit !important;
        }

        .photo-template-sidebar .sidebar-input:focus {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3) !important;
          padding-bottom: 2px !important;
        }

        /* Force sidebar standard headings to be white, uppercase, styled with bottom line */
        .photo-template-sidebar h3 {
          color: #ffffff !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          letter-spacing: 1.5px !important;
          text-transform: uppercase !important;
          margin: 20px 0 10px 0 !important;
          padding-bottom: 6px !important;
          border-bottom: 1.5px solid rgba(255, 255, 255, 0.2) !important;
        }

        /* Photo Image Upload styling overlay for circle avatar */
        .photo-template-sidebar .photo-template-avatar-container {
          display: flex;
          justify-content: center;
          margin-bottom: 15px;
          width: 100%;
        }

        /* Target image upload dropzone inside the sidebar */
        .photo-template-sidebar .mantine-Dropzone-root {
          border-radius: 50% !important;
          width: 130px !important;
          height: 130px !important;
          min-height: 130px !important;
          margin: 0 auto !important;
          overflow: hidden !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 !important;
          border: 2px solid rgba(255, 255, 255, 0.25) !important;
          background-color: rgba(255, 255, 255, 0.05) !important;
          transition: all 0.2s ease !important;
          cursor: pointer !important;
        }

        /* Ensure clicking on any inner elements of dropzone delegates nicely */
        .photo-template-sidebar .mantine-Dropzone-root * {
          pointer-events: none !important;
        }

        /* Hover style for dropping photo */
        .photo-template-sidebar .mantine-Dropzone-root:hover {
          border-color: rgba(255, 255, 255, 0.5) !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }

        /* Target inner image from ImageUpload in sidebar */
        .photo-template-sidebar .mantine-Dropzone-root img,
        .photo-template-sidebar .mantine-Dropzone-root .mantine-Image-root {
          width: 100% !important;
          height: 100% !important;
          border-radius: 50% !important;
          object-fit: cover !important;
        }

        /* Center add-buttons inside sidebar sections */
        .photo-template-sidebar button {
          color: #bdc3c7 !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          font-size: 11px !important;
        }
        .photo-template-sidebar button:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }

        /* Light sidebar-specific inputs for editing lists */
        .photo-template-sidebar .mantine-Input-input {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          font-size: 12px !important;
        }
        .photo-template-sidebar .mantine-Input-input:focus {
          border-color: rgba(255, 255, 255, 0.3) !important;
        }

        /* Right / main area column */
        .photo-template-main {
          width: 72%;
          background-color: #ffffff;
          padding: 35px 30px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }

        /* All-caps massive Name */
        .photo-template-main .main-name-textarea textarea {
          font-weight: 900 !important;
          font-size: 38px !important;
          width: 100% !important;
          border: none !important;
          outline: none !important;
          color: #1e2531 !important;
          text-transform: uppercase !important;
          letter-spacing: 1.5px !important;
          font-family: inherit !important;
          padding: 0 !important;
          margin-bottom: 2px !important;
          background: transparent !important;
          line-height: 1.2 !important;
          min-height: unset !important;
        }

        /* Medium Subtitle/Title */
        .photo-template-main .main-title-textarea textarea {
          font-weight: 600 !important;
          font-size: 18px !important;
          width: 100% !important;
          border: none !important;
          outline: none !important;
          color: #7f8c8d !important;
          font-family: inherit !important;
          padding: 0 !important;
          background: transparent !important;
          line-height: 1.3 !important;
          min-height: unset !important;
        }

        /* Overwrite headings in the main column of the photo layout */
        .photo-template-main h3 {
          color: #1e2531 !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          letter-spacing: 1.5px !important;
          text-transform: uppercase !important;
          margin: 25px 0 12px 0 !important;
          padding-bottom: 6px !important;
          border-bottom: 1.5px solid #1e2531 !important;
        }

        /* Style textareas for profile and items */
        .photo-template-main .profile-textarea textarea {
          padding: 0 !important;
          font-size: 13px !important;
          line-height: 1.6 !important;
          color: #2c3e50 !important;
        }
      `}</style>
    </div>
  );
}

export default PhotoLayout;
