import { useEffect, useState } from 'react';
import {
  Container, Title, Text, TextInput, Textarea, Button, Group, Paper,
  Card, SimpleGrid, ActionIcon, Badge, Code, Anchor,
} from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import { IconTrash, IconEdit, IconEye } from '@tabler/icons-react';
import { BlogPost, saveBlogPost, deleteBlogPost, getBlogPosts, isCustomPost } from '@/app/blog/posts';
import { Header } from '@/components/Heading/Header';
import { RichEditor } from '@/components/RichEditor/RichEditor';

const isDev = import.meta.env.DEV;

export default function EditorPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Create Resume Team');
  const [readTime, setReadTime] = useState('');
  const [tags, setTags] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [exportCode, setExportCode] = useState('');

  useEffect(() => {
    if (!isDev) { navigate('/', { replace: true }); return; }
    setPosts(getBlogPosts().filter(p => isCustomPost(p.slug)));
  }, [navigate]);

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!editing) setSlug(generateSlug(val));
  }

  function handleSave() {
    if (!title || !content) return;
    const post: BlogPost = {
      slug: slug || generateSlug(title),
      title,
      excerpt,
      content,
      date: new Date().toISOString().slice(0, 10),
      author,
      readTime: readTime || `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    saveBlogPost(post);
    setPosts(getBlogPosts().filter(p => isCustomPost(p.slug)));
    resetForm();
  }

  function editPost(post: BlogPost) {
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setAuthor(post.author);
    setReadTime(post.readTime);
    setTags(post.tags.join(', '));
    setEditing(post.slug);
  }

  function deletePost(slug: string) {
    deleteBlogPost(slug);
    setPosts(getBlogPosts().filter(p => isCustomPost(p.slug)));
    if (editing === slug) resetForm();
  }

  function exportPost() {
    const post: BlogPost = {
      slug: slug || generateSlug(title),
      title,
      excerpt,
      content,
      date: new Date().toISOString().slice(0, 10),
      author,
      readTime: readTime || `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    setExportCode(`{
  slug: '${post.slug}',
  title: '${post.title.replace(/'/g, "\\'")}',
  excerpt: '${post.excerpt.replace(/'/g, "\\'")}',
  content: \`${post.content.replace(/`/g, '\\`')}\`,
  date: '${post.date}',
  author: '${post.author.replace(/'/g, "\\'")}',
  readTime: '${post.readTime}',
  tags: [${post.tags.map(t => `'${t}'`).join(', ')}],
}`);
  }

  function resetForm() {
    setTitle(''); setSlug(''); setExcerpt(''); setContent('');
    setAuthor('Create Resume Team'); setReadTime(''); setTags(''); setEditing(null);
    setExportCode('');
  }

  if (!isDev) return null;

  return (
    <>
      <Header />
      <Container size="lg" py="xl">
        <Group justify="space-between" mb="lg">
          <Title order={1}>Blog Editor</Title>
          <Anchor component={Link} to="/blog" size="sm">View Blog →</Anchor>
        </Group>

        <Paper withBorder p="lg" radius="md" mb="xl">
          <Title order={3} mb="md">{editing ? 'Edit Post' : 'New Post'}</Title>

          <Group grow mb="sm">
            <TextInput label="Title" value={title} onChange={e => handleTitleChange(e.currentTarget.value)} required />
            <TextInput label="Slug" value={slug} onChange={e => setSlug(e.currentTarget.value)} />
          </Group>

          <Textarea label="Excerpt" value={excerpt} onChange={e => setExcerpt(e.currentTarget.value)} minRows={2} mb="sm" />

          <Text size="sm" fw={500} mb={4}>Content</Text>
          <RichEditor key={editing || 'new'} content={content} onChange={setContent} placeholder="Start writing your blog post..." />

          <Group grow mb="sm">
            <TextInput label="Author" value={author} onChange={e => setAuthor(e.currentTarget.value)} />
            <TextInput label="Read Time" value={readTime} onChange={e => setReadTime(e.currentTarget.value)} placeholder="e.g. 3 min read" />
            <TextInput label="Tags (comma-separated)" value={tags} onChange={e => setTags(e.currentTarget.value)} placeholder="resume, career" />
          </Group>

          <Group mt="md">
            <Button onClick={handleSave}>{editing ? 'Update Post' : 'Save Post'} (localStorage)</Button>
            <Button variant="light" onClick={exportPost}>Export as Code</Button>
            {editing && <Button variant="subtle" onClick={resetForm}>Cancel</Button>}
          </Group>

          {exportCode && (
            <Paper withBorder p="sm" mt="md" bg="gray.0">
              <Text size="sm" fw={500} mb="xs">Copy this into app/blog/posts.ts:</Text>
              <Code block style={{ whiteSpace: 'pre', fontSize: 12 }}>{exportCode}</Code>
            </Paper>
          )}
        </Paper>

        {posts.length > 0 && (
          <>
            <Title order={3} mb="md">Your Custom Posts</Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {posts.map(post => (
                <Card key={post.slug} withBorder padding="md" radius="md">
                  <Text fw={500} lineClamp={1}>{post.title}</Text>
                  <Text size="sm" c="dimmed" lineClamp={2} mt={4}>{post.excerpt}</Text>
                  <Group mt="sm" gap="xs">
                    <ActionIcon variant="light" onClick={() => editPost(post)}><IconEdit size={16} /></ActionIcon>
                    <ActionIcon variant="light" color="red" onClick={() => deletePost(post.slug)}><IconTrash size={16} /></ActionIcon>
                    <Button component={Link} to={`/blog/${post.slug}`} variant="subtle" size="xs" leftSection={<IconEye size={14} />}>View</Button>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </>
        )}
      </Container>
    </>
  );
}
