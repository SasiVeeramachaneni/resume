// app/useResume.ts
import { useContext } from 'react';
import { ResumeContext } from './ResumeContext';

const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export default useResume;
