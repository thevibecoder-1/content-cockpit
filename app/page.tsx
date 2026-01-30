"use client";

import { useEffect, useState } from "react";

interface Post {
  id: string;
  text: string;
  media: string | null;
  createdAt: string;
  status: "pending" | "posted" | "expired";
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/posts.json")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => setPosts([]));
  }, []);

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const pendingPosts = posts.filter((p) => p.status === "pending");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl">
              ⚡
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Content Cockpit</h1>
              <p className="text-sm text-white/60">Your AI-generated X drafts</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p className="text-white/60 text-sm">Ready to Post</p>
            <p className="text-3xl font-bold text-white">{pendingPosts.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p className="text-white/60 text-sm">Posted Today</p>
            <p className="text-3xl font-bold text-green-400">0</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p className="text-white/60 text-sm">Total Generated</p>
            <p className="text-3xl font-bold text-purple-400">{posts.length}</p>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white/80">📝 Drafts Ready</h2>
          
          {pendingPosts.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <p className="text-white/60">No pending drafts. New content coming soon! 🚀</p>
            </div>
          ) : (
            pendingPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
              >
                {/* Post Content */}
                <p className="text-white whitespace-pre-wrap text-lg leading-relaxed mb-4">
                  {post.text}
                </p>

                {/* Media Preview */}
                {post.media && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
                    <img src={post.media} alt="Media" className="w-full" />
                  </div>
                )}

                {/* Meta & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-sm text-white/40">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    {post.media && (
                      <a
                        href={post.media}
                        download
                        className="px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors text-sm font-medium"
                      >
                        ⬇️ Media
                      </a>
                    )}
                    <button
                      onClick={() => copyText(post.id, post.text)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        copied === post.id
                          ? "bg-green-500 text-white"
                          : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
                      }`}
                    >
                      {copied === post.id ? "✓ Copied!" : "📋 Copy Text"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <p className="text-white/40 text-sm">
            Generated by MoltBot ⚡ • Refresh for new content
          </p>
        </div>
      </footer>
    </div>
  );
}
