import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Modern Natarix Home Page
 * Features:
 * - Clean light theme design
 * - Modern card-based post layout
 * - Improved typography and spacing
 * - Smooth hover animations
 * - Better visual hierarchy
 */
const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState("hot");
  const [votedPosts, setVotedPosts] = useState({});

  // Mock communities data
  const communities = [
    { id: 1, name: "programming", displayName: "Programming", members: 125000, description: "A community for programmers to discuss coding, share projects, and help each other.", icon: "💻" },
    { id: 2, name: "technology", displayName: "Technology", members: 89000, description: "Latest tech news, gadgets, and discussions about the future of technology.", icon: "🚀" },
    { id: 3, name: "gaming", displayName: "Gaming", members: 210000, description: "Video games, gaming news, and discussions about your favorite games.", icon: "🎮" },
    { id: 4, name: "science", displayName: "Science", members: 67000, description: "Scientific discoveries, research, and discussions about the natural world.", icon: "🔬" },
    { id: 5, name: "movies", displayName: "Movies", members: 95000, description: "Movie reviews, discussions, and news from the world of cinema.", icon: "🎬" }
  ];

  // Mock posts data with Reddit-style structure
  const posts = [
    {
      id: 1,
      title: "Just finished building my first React app! Here's what I learned",
      content: "After 3 months of learning, I finally completed my first full-stack React application. The journey was incredible - from struggling with useState to building complex state management with Context API. Here are the key lessons I learned...",
      author: { username: "reactdev", karma: 15420, isVerified: true },
      community: "programming",
      createdAt: "2024-01-15T10:30:00Z",
      upvotes: 1247,
      downvotes: 23,
      commentCount: 89,
      awards: ["gold", "silver"],
      isStickied: false,
      isLocked: false,
      flair: "Discussion",
      imageUrl: null,
      isNSFW: false
    },
    {
      id: 2,
      title: "What's your favorite programming language and why?",
      content: "I've been coding for 5 years now and I'm curious about what languages other developers prefer. Personally, I love Python for its readability and JavaScript for its versatility. What about you?",
      author: { username: "coder123", karma: 8920, isVerified: false },
      community: "programming",
      createdAt: "2024-01-15T08:15:00Z",
      upvotes: 892,
      downvotes: 15,
      commentCount: 156,
      awards: ["silver"],
      isStickied: false,
      isLocked: false,
      flair: "Question",
      imageUrl: null,
      isNSFW: false
    },
    {
      id: 3,
      title: "New AI breakthrough: Machine learning shows remarkable reasoning capabilities",
      content: "Researchers have announced significant improvements in machine learning reasoning abilities. The new models show unprecedented performance in logical reasoning tasks...",
      author: { username: "technews", karma: 45600, isVerified: true },
      community: "technology",
      createdAt: "2024-01-15T06:45:00Z",
      upvotes: 2156,
      downvotes: 67,
      commentCount: 234,
      awards: ["gold", "platinum"],
      isStickied: true,
      isLocked: false,
      flair: "News",
      imageUrl: null,
      isNSFW: false
    },
    {
      id: 4,
      title: "My gaming setup after 2 years of saving",
      content: "Finally completed my dream gaming setup! RTX 4080, 32GB RAM, 4K monitor. The difference is night and day compared to my old laptop. Worth every penny!",
      author: { username: "gamerpro", karma: 12340, isVerified: false },
      community: "gaming",
      createdAt: "2024-01-15T05:20:00Z",
      upvotes: 3421,
      downvotes: 89,
      commentCount: 445,
      awards: ["gold", "silver", "silver"],
      isStickied: false,
      isLocked: false,
      flair: "Setup",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
      isNSFW: false
    },
    {
      id: 5,
      title: "Scientists discover new species of deep-sea creatures",
      content: "Marine biologists have discovered three new species of bioluminescent creatures in the Mariana Trench. These fascinating organisms could provide insights into evolution in extreme environments...",
      author: { username: "marinebio", karma: 28900, isVerified: true },
      community: "science",
      createdAt: "2024-01-15T04:10:00Z",
      upvotes: 1892,
      downvotes: 34,
      commentCount: 167,
      awards: ["gold"],
      isStickied: false,
      isLocked: false,
      flair: "Research",
      imageUrl: null,
      isNSFW: false
    }
  ];

  /**
   * Handle post upvote
   */
  const handlePostUpvote = (postId) => {
    if (!isAuthenticated) {
      alert("Please login to vote");
      return;
    }
    
    setVotedPosts(prev => {
      const currentVote = prev[postId];
      if (currentVote === 'upvote') {
        const newVotes = { ...prev };
        delete newVotes[postId];
        return newVotes;
      } else {
        return { ...prev, [postId]: 'upvote' };
      }
    });
  };

  /**
   * Handle post downvote
   */
  const handlePostDownvote = (postId) => {
    if (!isAuthenticated) {
      alert("Please login to vote");
      return;
    }
    
    setVotedPosts(prev => {
      const currentVote = prev[postId];
      if (currentVote === 'downvote') {
        const newVotes = { ...prev };
        delete newVotes[postId];
        return newVotes;
      } else {
        return { ...prev, [postId]: 'downvote' };
      }
    });
  };

  /**
   * Get post vote count
   */
  const getPostVoteCount = (post) => {
    const baseCount = (post.upvotes || 0) - (post.downvotes || 0);
    const userVote = votedPosts[post.id];
    
    if (userVote === 'upvote') {
      return baseCount + 1;
    } else if (userVote === 'downvote') {
      return baseCount - 1;
    }
    return baseCount;
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  /**
   * Format number with K/M suffix
   */
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  /**
   * Filter posts based on selected filter
   */
  const filteredPosts = useMemo(() => {
    let sorted = [...posts];
    
    switch (selectedFilter) {
      case 'hot':
        return sorted.sort((a, b) => getPostVoteCount(b) - getPostVoteCount(a));
      case 'new':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'top':
        return sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      case 'rising':
        return sorted.sort((a, b) => b.commentCount - a.commentCount);
      default:
        return sorted;
    }
  }, [posts, selectedFilter, votedPosts]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - Communities */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Create Community */}
              {isAuthenticated && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6 hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Community</h3>
                  <Link
                    to="/create-community"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 text-center block shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Create Community
                  </Link>
                </div>
              )}

              {/* Communities List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Popular Communities</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {communities.map((community) => (
                    <Link
                      key={community.id}
                      to={`/r/${community.name}`}
                      className="flex items-center p-4 hover:bg-gray-50 transition-all duration-300 group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-red-100 to-red-200 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl">{community.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-300">r/{community.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatNumber(community.members)} members</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Posts */}
          <div className="lg:col-span-3">
            {/* Filter Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
              <div className="flex">
                {[
                  { key: 'hot', label: 'Hot', icon: '🔥' },
                  { key: 'new', label: 'New', icon: '🆕' },
                  { key: 'top', label: 'Top', icon: '📈' },
                  { key: 'rising', label: 'Rising', icon: '📈' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 ${
                      selectedFilter === filter.key
                        ? 'bg-red-50 text-red-600 border-b-2 border-red-600'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                    title={`Sort by ${filter.label.toLowerCase()}`}
                    aria-label={`Sort posts by ${filter.label.toLowerCase()}`}
                    aria-pressed={selectedFilter === filter.key}
                  >
                    <span className="mr-2" aria-hidden="true">{filter.icon}</span>
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Post Button */}
            {isAuthenticated && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 hover:shadow-md transition-all duration-300">
                <Link
                  to="/submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 text-center block shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-lg font-semibold">Create Post</span>
                  </div>
                </Link>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  {/* Post Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <Link to={`/r/${post.community}`} className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors duration-300">
                        r/{post.community}
                      </Link>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">Posted by u/{post.author.username}</span>
                      <span className="text-gray-300">•</span>
                      <time className="text-sm text-gray-500">{formatDate(post.createdAt)}</time>
                      {post.isStickied && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Stickied</span>
                        </>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      <Link to={`/r/${post.community}/comments/${post.id}`} className="hover:text-red-600 transition-colors duration-300">
                        {post.title}
                      </Link>
                    </h2>
                    
                    {post.flair && (
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-medium mb-4">
                        {post.flair}
                      </span>
                    )}
                    
                    {post.content && (
                      <p className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-3">
                        {post.content}
                      </p>
                    )}
                    
                    {post.imageUrl && (
                      <div className="mb-4">
                        <img 
                          src={post.imageUrl} 
                          alt="Post content" 
                          className="w-full h-64 object-cover rounded-xl"
                        />
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        {/* Upvote */}
                        <button
                          onClick={() => handlePostUpvote(post.id)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                            votedPosts[post.id] === 'upvote'
                              ? 'text-red-600 bg-red-50'
                              : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title="Upvote"
                          aria-label={`Upvote post by ${post.author.username}`}
                        >
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ 
                              width: '20px', 
                              height: '20px',
                              stroke: 'currentColor',
                              strokeWidth: '2'
                            }}
                          >
                            <path d="M12 4L4 12H9V20H15V12H20L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>

                        {/* Vote Count */}
                        <span className="text-sm font-semibold text-gray-900 min-w-[40px] text-center">
                          {formatNumber(getPostVoteCount(post))}
                        </span>

                        {/* Downvote */}
                        <button
                          onClick={() => handlePostDownvote(post.id)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                            votedPosts[post.id] === 'downvote'
                              ? 'text-blue-600 bg-blue-50'
                              : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                          title="Downvote"
                          aria-label={`Downvote post by ${post.author.username}`}
                        >
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ 
                              width: '20px', 
                              height: '20px',
                              stroke: 'currentColor',
                              strokeWidth: '2'
                            }}
                          >
                            <path d="M12 20L4 12H9V4H15V12H20L12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>

                        {/* Comments */}
                        <Link
                          to={`/r/${post.community}/comments/${post.id}`}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                          title="View comments"
                          aria-label={`View ${formatNumber(post.commentCount)} comments on this post`}
                          style={{ maxWidth: 'fit-content' }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={{ minWidth: '14px', maxWidth: '14px', width: '14px', height: '14px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-sm font-medium">{formatNumber(post.commentCount)} Comments</span>
                        </Link>

                        {/* Share */}
                        <button 
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                          title="Share post"
                          aria-label="Share this post"
                          style={{ maxWidth: 'fit-content' }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={{ minWidth: '14px', maxWidth: '14px', width: '14px', height: '14px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          <span className="text-sm font-medium">Share</span>
                        </button>

                        {/* Save */}
                        <button 
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                          title="Save post"
                          aria-label="Save this post"
                          style={{ maxWidth: 'fit-content' }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={{ minWidth: '14px', maxWidth: '14px', width: '14px', height: '14px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          <span className="text-sm font-medium">Save</span>
                        </button>
                      </div>

                      {/* Awards */}
                      {post.awards.length > 0 && (
                        <div className="flex items-center space-x-1">
                          {post.awards.map((award, index) => (
                            <span key={index} className="text-yellow-500 text-lg">🏆</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-8 text-center">
              <button 
                className="bg-white text-gray-700 px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 font-medium"
                title="Load more posts"
                aria-label="Load more posts"
              >
                Load More Posts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;