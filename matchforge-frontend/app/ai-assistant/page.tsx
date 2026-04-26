'use client';
import { Layout } from '@/components/Layout';
import { useAppContext } from '@/context/AppContext';
import { useState } from 'react';

export default function AIAssistantPage() {
  const { resumeFile, jobDescription, token } = useAppContext();  // ← added token
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [followUp, setFollowUp] = useState('');
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([]);

  const getSuggestions = async () => {
    if (!resumeFile || !jobDescription) {
      alert('Please upload a resume and job description first.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const res = await fetch('http://localhost:8080/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,   // ← token now defined
        },
        body: formData,
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      const data = await res.json();
      const aiAdvice = data.advice;
      setAdvice(aiAdvice);
      setConversation([{ role: 'assistant', content: aiAdvice }]);
    } catch (err) {
      console.error(err);
      setAdvice('Failed to generate advice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const askFollowUp = async () => {
    if (!followUp.trim()) return;
    const userMessage = followUp;
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setFollowUp('');
    setLoading(true);

    const history = conversation.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n');
    const prompt = `
Continue the resume coaching conversation. The user asked: "${userMessage}"
Previous conversation:
${history}
Give a helpful, concise answer about improving the resume. Be specific.
    `;

    try {
      const res = await fetch('http://localhost:8080/api/ai/advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,   // ← also needed here
        },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const assistantReply = data.advice;
      setConversation(prev => [...prev, { role: 'assistant', content: assistantReply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="AI Assistant" subtitle="Get personalized resume improvement advice">
      <div className="max-w-3xl mx-auto">
        {!advice && (
          <div className="text-center py-10">
            <button
              onClick={getSuggestions}
              disabled={loading}
              className="btn-primary btn px-6 py-3 text-lg"
            >
              {loading ? 'Analyzing your resume...' : 'Generate Resume Improvement Plan'}
            </button>
            {(!resumeFile || !jobDescription) && (
              <p className="text-sm text-[var(--ink3)] mt-4">
                ⚠️ Please upload a resume and job description first (using the Upload and Job Description pages).
              </p>
            )}
          </div>
        )}

        {advice && (
          <>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold mb-3">Your Personalized Resume Advice</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {advice}
              </div>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="text-md font-semibold mb-3">Ask a follow‑up question</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {conversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-[var(--accent)] text-white ml-8'
                        : 'bg-[var(--paper)] text-[var(--ink)] mr-8'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {loading && <div className="text-center text-[var(--ink3)]">Thinking...</div>}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && askFollowUp()}
                  placeholder="e.g., How can I quantify my achievements?"
                  className="flex-1 p-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--ink)]"
                />
                <button onClick={askFollowUp} disabled={loading} className="btn-primary btn">
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}