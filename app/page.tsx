import { HeroBullets } from '@/components/HeroBullets/HeroBullets';
import { Header } from '@/components/Heading/Header';
import { usePageMeta } from './usePageMeta';

export default function HomePage() {
  usePageMeta(
    'Create Resume - Build Your Professional Resume Online Free',
    'Create a standout resume effortlessly with our free resume builder. Choose from professional templates, highlight your skills, and download as PDF.',
  );

  return (
    <>
      <Header />
      <HeroBullets />
    </>
  );
}
