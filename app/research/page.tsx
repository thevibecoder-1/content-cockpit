'use client';

import { useState, useEffect } from 'react';

interface RedditPost {
  title: string;
  url: string;
  score: number;
  subreddit: string;
  selftext?: string;
}

interface TrendCategory {
  category: string;
  items: RedditPost[];
}

export default function ResearchPage() {
  const [trends, setTrends] = useState<TrendCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/trends.json')
      .then(res => res.json())
      .then(data => {
        setTrends(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Trend Radar 📡
          </h1>
          <p className="text-gray-400">Fresh signals from the hive mind. Updated nightly.</p>
        </div>
        <a href="/" className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition">
          ← Back to Cockpit
        </a>
      </header>

      {loading ? (
        <div className="text-center py-20 animate-pulse">Scanning frequencies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {trends.map((section) => (
            <div key={section.category} className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-gray-800 pb-2 text-gray-300">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.items.length === 0 ? (
                  <div className="text-gray-500 italic">No signals found.</div>
                ) : (
                  section.items.map((post, idx) => (
                    <div key={idx} className="bg-gray-900 border border-gray-800 p-4 rounded-lg hover:border-purple-500/50 transition group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-purple-400 bg-purple-900/30 px-2 py-1 rounded">
                          {post.subreddit}
                        </span>
                        <span className="text-xs text-gray-500">Score: {post.score}</span>
                      </div>
                      <a href={post.url} target="_blank" rel="noopener noreferrer" className="block mb-2 font-medium hover:text-blue-400">
                        {post.title}
                      </a>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {post.selftext || "No preview text available."}
                      </p>
                      <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-sm font-medium rounded text-gray-300 group-hover:bg-purple-600 group-hover:text-white transition">
                        ⚡ Generate Draft
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
