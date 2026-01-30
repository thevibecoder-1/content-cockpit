'use client';

import { useState } from 'react';

export default function OutreachPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    setLoading(true);
    // Simulation for frontend (real backend would call the script)
    setTimeout(() => {
      const domain = url.replace('https://', '').replace('http://', '').split('/')[0];
      setResult({
        domain: domain,
        analysis: "Detected: SaaS / High-Traffic / React",
        pain_points: ["Manual Outreach", "Lead Qual", "Content Scale"],
        email: `Hey team,\n\nChecking out ${domain} and noticed you're scaling content. Love the recent post about AI.\n\nWe built a tool that automates the 'boring part' of research so you can focus on strategy.\n\nWorth a peek?\n\nBest,\nSarthak`,
        subject: `Idea for ${domain}`
      });
      setLoading(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
            SniperMail 🎯
          </h1>
          <p className="text-gray-400">Hyper-personalized outreach generator.</p>
        </div>
        <div className="flex gap-4">
          <a href="/jobs" className="px-4 py-2 bg-gray-900 rounded hover:bg-gray-800 transition text-sm">
            💼 Job Hunter
          </a>
          <a href="/research" className="px-4 py-2 bg-gray-900 rounded hover:bg-gray-800 transition text-sm">
            📡 Trends
          </a>
          <a href="/" className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition text-sm">
            ← Cockpit
          </a>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Paste LinkedIn or Website URL (e.g. stripe.com)"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={analyze}
            disabled={!url || loading}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Generate"}
          </button>
        </div>

        {result && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-fade-in">
            <div className="flex gap-2 mb-6">
              <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-mono">
                {result.domain}
              </span>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-mono">
                {result.analysis}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Subject</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    readOnly 
                    value={result.subject} 
                    className="flex-1 bg-black border border-gray-800 rounded p-2 text-sm text-gray-300"
                  />
                  <button onClick={() => copyToClipboard(result.subject)} className="text-gray-500 hover:text-white">📋</button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Email Body</label>
                <div className="relative mt-1">
                  <textarea 
                    readOnly 
                    value={result.email} 
                    className="w-full h-48 bg-black border border-gray-800 rounded p-4 text-sm text-gray-300 leading-relaxed resize-none"
                  />
                  <button 
                    onClick={() => copyToClipboard(result.email)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white bg-black/50 p-2 rounded"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
