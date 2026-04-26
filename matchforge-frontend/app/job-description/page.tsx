'use client';
import { Layout } from '@/components/Layout';
import { JobDescriptionForm } from '@/components/JobDescriptionForm';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function JobDescriptionPage() {
  const router = useRouter();
  const { runAnalysis } = useAppContext();   // remove setJobDescription if not used elsewhere

  const handleSubmit = async (jd: string) => {
    await runAnalysis(jd);   // pass the job description directly
    router.push('/match-results');
  };

  return (
    <Layout title="Job Description" subtitle="Paste the job posting to analyze">
      <JobDescriptionForm onSubmit={handleSubmit} />
    </Layout>
  );
}