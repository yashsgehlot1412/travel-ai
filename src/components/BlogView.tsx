/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compass, BookOpen, Clock, User, Heart, Send, Sparkles, Filter, Plus, X } from 'lucide-react';

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  imageUrl: string;
}

export default function BlogView() {
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Creation form state
  const [showCreator, setShowCreator] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Luxury Travel');
  const [newImg, setNewImg] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Failed fetching blogs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newExcerpt || !newContent || !newAuthor) {
      setMessage('Please fill in all core fields to dispatch your diary.');
      return;
    }

    setIsPublishing(true);
    setMessage('');

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          excerpt: newExcerpt,
          content: newContent,
          author: newAuthor,
          category: newCategory,
          imageUrl: newImg || undefined
        })
      });

      const resData = await response.json();
      if (resData.success) {
        setMessage('✓ Congratulations! Your luxury travel diary is now live.');
        // Reset states
        setNewTitle('');
        setNewExcerpt('');
        setNewContent('');
        setNewAuthor('');
        setNewImg('');
        // Refresh list
        fetchBlogs();
        // Hide form shortly
        setTimeout(() => {
          setShowCreator(false);
          setMessage('');
        }, 2500);
      } else {
        setMessage('Failed to publish at this second.');
      }
    } catch (err) {
      console.error('Save blog error', err);
      setMessage('Error connection. Failed dispatching diary.');
    } finally {
      setIsPublishing(false);
    }
  };

  const filteredBlogs = selectedCategory === 'all'
    ? blogs
    : blogs.filter(b => b.category === selectedCategory);

  const categories = ['all', 'Luxury Travel', 'Spiritual & Nature', 'Adventure'];

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
          <div className="space-y-4">
            <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">Editorial Desk</span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              The TravelAI Gazette
            </h1>
            <p className="text-sm text-zinc-400">
              Explore custom written guides, secret itineraries, and travel advice compiled by global experts.
            </p>
          </div>

          <button
            onClick={() => setShowCreator(!showCreator)}
            className="self-start md:self-end bg-amber-500 hover:bg-amber-600 text-black px-5 py-3 rounded-full text-xs font-mono uppercase tracking-wider font-semibold shadow-lg shadow-amber-500/10 flex items-center space-x-2"
            id="write-article-toggle-btn"
          >
            {showCreator ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showCreator ? 'Close Editor' : 'Write a Travel Diary'}</span>
          </button>
        </div>

        {/* Dynamic Journal Creator Form */}
        {showCreator && (
          <div className="bg-zinc-900/60 border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl mx-auto animate-fade-in" id="journal-creator">
            <div className="flex items-center space-x-2 text-amber-500 border-b border-zinc-800 pb-4">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-serif text-lg font-bold">Bespoke Travel Diary Publisher</h3>
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-xs sm:text-sm font-sans ${message.startsWith('✓') ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleCreateBlog} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono text-zinc-500">Traveler Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Sophia Sterling"
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono text-zinc-500">Diary Category</label>
                  <select
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs focus:outline-none"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Luxury Travel">Luxury Travel</option>
                    <option value="Spiritual & Nature">Spiritual & Nature</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono text-zinc-500">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dreaming in White: Overlaters Maldives Honeymoon Suite"
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono text-zinc-500">Brief Summary (Excerpt)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Discover how to secure cheap luxury boat transfers and dining menus under water."
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono text-zinc-500">Cover Photo Unsplash URL (Optional)</label>
                <input
                  type="url"
                  placeholder="e.g., https://images.unsplash.com/photo-..."
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  value={newImg}
                  onChange={(e) => setNewImg(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono text-zinc-500">Complete Diary Body Content</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Type your unforgettable travel journal notes, hidden locations, tips, and memory lanes..."
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl p-4 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-black py-4.5 rounded-xl text-xs font-mono uppercase font-bold tracking-wide transition-all disabled:opacity-50"
              >
                {isPublishing ? 'Publishing on Cloud Server...' : 'Secure & Publish Diary'}
              </button>
            </form>
          </div>
        )}

        {/* Categories bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs border-b border-zinc-900 pb-6">
          <span className="text-zinc-500 font-mono flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-mono text-[11px] capitalize border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black border-amber-500 font-semibold'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-850 hover:text-white'
              }`}
              id={`cat-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat === 'all' ? 'All Gazettes' : cat}
            </button>
          ))}
        </div>

        {/* Loader */}
        {isLoading ? (
          <div className="text-center py-20 space-y-3">
            <Compass className="w-8 h-8 text-amber-500 mx-auto animate-spin" />
            <p className="text-xs text-zinc-500">Syncing news feed dispatch database...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/10 rounded-3xl border border-dashed border-zinc-850">
            <BookOpen className="w-8 h-8 text-zinc-500 mx-auto" />
            <h4 className="text-md mt-4 font-bold text-white">No articles under this division</h4>
            <p className="text-xs text-zinc-500">Feel free to launch the creator above and draft a custom diary first!</p>
          </div>
        ) : (
          /* Blogs Editorial Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post) => (
              <article
                key={post.id}
                className="group bg-zinc-900/20 border border-zinc-900 rounded-3xl overflow-hidden hover:border-zinc-850 duration-350"
                id={`blog-card-${post.id}`}
              >
                <div className="h-52 relative overflow-hidden bg-zinc-900">
                  <img
                    referrerPolicy="no-referrer"
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <span className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md border border-zinc-800 text-[9px] text-zinc-300 font-mono px-2.5 py-1 rounded-full uppercase">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-1 text-[10px] text-zinc-500 font-mono">
                    <User className="w-3 h-3 text-amber-500" />
                    <span>{post.author}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <hr className="border-zinc-900/60" />

                  <div className="text-[11px] text-zinc-500 font-mono flex items-center justify-between">
                    <span>Dispatched on: {post.date}</span>
                    <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-[10px]">Verified Diary</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
