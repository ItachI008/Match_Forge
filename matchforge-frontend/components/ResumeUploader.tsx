// components/ResumeUploader.tsx
'use client';
import { useRef, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

export function ResumeUploader({ onUpload }: { onUpload: (file: File) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
      onUpload(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${dragActive ? 'border-[var(--emerald)] bg-[var(--emerald)]/5' : 'border-[var(--border)] hover:border-[var(--ink3)]'}`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
    >
      <div className="w-14 h-14 bg-[var(--paper)] rounded-xl flex items-center justify-center mx-auto mb-4">
        <Upload className="w-6 h-6 text-[var(--ink3)]" />
      </div>
      <h3 className="font-medium mb-1">Drop your resume here</h3>
      <p className="text-sm text-[var(--ink3)]">PDF or DOCX · Up to 5MB</p>
      <input ref={inputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
    </div>
  );
}