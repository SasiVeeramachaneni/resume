import { useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  ActionIcon, Group, Tooltip, Divider, Menu,
} from '@mantine/core';
import {
  IconBold, IconItalic, IconH2, IconH3,
  IconList, IconListNumbers, IconQuote, IconLink,
  IconPhoto, IconStrikethrough, IconClearFormatting, IconUpload,
} from '@tabler/icons-react';
import classes from './RichEditor.module.css';

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function MenuBar({ editor }: { editor: NonNullable<ReturnType<typeof useEditor>> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Link URL', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImageByUrl = useCallback(() => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [editor]);

  const tools = [
    { icon: IconBold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'Bold' },
    { icon: IconItalic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'Italic' },
    { icon: IconStrikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike'), label: 'Strikethrough' },
    { type: 'divider' as const },
    { icon: IconH2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), label: 'Heading 2' },
    { icon: IconH3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), label: 'Heading 3' },
    { type: 'divider' as const },
    { icon: IconList, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), label: 'Bullet List' },
    { icon: IconListNumbers, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), label: 'Numbered List' },
    { icon: IconQuote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), label: 'Blockquote' },
    { type: 'divider' as const },
    { icon: IconLink, action: addLink, active: editor.isActive('link'), label: 'Link' },
    { type: 'image-menu' as const },
    { type: 'divider' as const },
    { icon: IconClearFormatting, action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(), active: false, label: 'Clear formatting' },
  ];

  return (
    <Group gap={4} p="xs" className={classes.toolbar}>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
      {tools.map((tool, i) => {
        if ('type' in tool && tool.type === 'divider') {
          return <Divider key={i} orientation="vertical" mx={2} />;
        }
        if ('type' in tool && tool.type === 'image-menu') {
          return (
            <Menu key={i} trigger="hover" openDelay={200} closeDelay={100}>
              <Menu.Target>
                <Tooltip label="Image" withArrow>
                  <ActionIcon size="lg" variant="subtle">
                    <IconPhoto size={18} />
                  </ActionIcon>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconUpload size={16} />} onClick={() => fileInputRef.current?.click()}>
                  Upload from device
                </Menu.Item>
                <Menu.Item leftSection={<IconLink size={16} />} onClick={addImageByUrl}>
                  Insert from URL
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          );
        }
        return (
          <Tooltip key={i} label={tool.label} withArrow>
            <ActionIcon
              variant={tool.active ? 'filled' : 'subtle'}
              onClick={tool.action}
              size="lg"
            >
              <tool.icon size={18} />
            </ActionIcon>
          </Tooltip>
        );
      })}
    </Group>
  );
}

export function RichEditor({ content, onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension.configure({ inline: false }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: classes.editor,
      },
    },
  });

  return (
    <div className={classes.root}>
      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} className={classes.content} />
    </div>
  );
}
