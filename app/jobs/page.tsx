'use client';

import { useState, useEffect } from 'react';

interface JobPost {
  title: string;
  url: string;
  score: number;
  subreddit: string;
  selftext?: string;
}

interface JobCategory {
  category: string;
  items: JobPost[];
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/jobs.json')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const openDraft = (title: string, url: string) => {
    const subject = encodeURIComponent(`Application for: ${title}`);
    const body = encodeURIComponent(`Hi,\n\nI saw your post on Reddit (${title}) and I'd love to apply.\n\nHere is my portfolio: [Your Portfolio URL]\n\nBest,\nSarthak\n${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-500 text-transparent bg-clip-text">
            Job Hunter 💼
          </h1>
          <p className="text-gray-400">Hidden leads from the Reddit underground.</p>
        </div>
        <div className="flex gap-4">
          <a href="/research" className="px-4 py-2 bg-gray-900 rounded hover:bg-gray-800 transition text-sm">
            📡 Trend Radar
          </a>
          <a href="/" className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition text-sm">
            ← Cockpit
          </a>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-20 animate-pulse">Scanning for opportunities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {jobs.map((section) => (
            <div key={section.category} className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-gray-800 pb-2 text-gray-300">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.items.length === 0 ? (
                  <div className="text-gray-500 italic">No open roles found in the last 24h.</div>
                ) : (
                  section.items.map((job, idx) => (
                    <div key={idx} className="bg-gray-900 border border-gray-800 p-4 rounded-lg hover:border-green-500/50 transition group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-green-400 bg-green-900/30 px-2 py-1 rounded">
                          {job.subreddit}
                        </span>
                        <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
                      </div>
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="block mb-2 font-medium hover:text-green-400">
                        {job.title}
                      </a>
                      <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                        {job.selftext || "No description provided."}
                      </p>
                      <button 
                        onClick={() => openDraft(job.title, job.url)}
                        className="w-full py-2 bg-gray-800 hover:bg-green-700 text-sm font-medium rounded text-gray-300 hover:text-white transition flex justify-center items-center gap-2"
                      >
                        📧 Draft Email
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
