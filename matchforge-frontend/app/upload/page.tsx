// app/upload/page.tsx
'use client';
import { Layout } from '@/components/Layout';
import { ResumeUploader } from '@/components/ResumeUploader';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function UploadPage() {
  const router = useRouter();
  const { setResumeFile } = useAppContext();

  const handleUpload = (file: File) => {
    setResumeFile(file);
    router.push('/job-description');
  };

  return (
    <Layout title="Upload Resume" subtitle="PDF or DOCX up to 5MB">
      <ResumeUploader onUpload={handleUpload} />
    </Layout>
  );
}