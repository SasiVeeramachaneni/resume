import { Footer } from '@/components/Footer/Footer';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
