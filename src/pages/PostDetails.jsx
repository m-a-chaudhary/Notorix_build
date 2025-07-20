// src/pages/PostDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { useForm, validationSchemas } from "../hooks/useForm";
import LoadingSpinner, { CardSkeleton } from "../components/LoadingSpinner";

/**
 * Enhanced Post Details Page Component
 * Features:
 * - Detailed post display with rich formatting
 * - Comments system with nested replies
 * - Like/dislike functionality
 * - Share functionality
 * - Related posts
 * - Author information
 * - Reading time estimation
 * - Social sharing
 */
const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showComments, setShowComments] = useState(true);
  const [sortComments, setSortComments] = useState('newest');

  // Fetch post details
  const { 
    data: post, 
    loading: postLoading, 
    error: postError, 
    refetch: refetchPost 
  } = useApi(`/api/posts/${id}`);

  // Fetch comments
  const { 
    data: commentsData, 
    loading: commentsLoading, 
    error: commentsError,
    refetch: refetchComments 
  } = useApi(`/api/posts/${id}/comments`);

  // Form for adding comments
  const {
    values: commentValues,
    errors: commentErrors,
    isSubmitting: isCommentSubmitting,
    handleChange: handleCommentChange,
    handleSubmit: handleCommentSubmit,
    resetForm: resetCommentForm
  } = useForm(
    { content: '' },
    { content: { required: 'Comment cannot be empty', minLength: 2 } },
    async (values) => {
      try {
        const response = await fetch(`/api/posts/${id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ content: values.content })
        });

        if (response.ok) {
          resetCommentForm();
          refetchComments();
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  );

  // Extract comments from API response
  const comments = commentsData?.comments || [];

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
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  /**
   * Calculate reading time
   */
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  /**
   * Handle like/dislike
   */
  const handleReaction = async (type) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ type })
      });

      if (response.ok) {
        refetchPost();
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  /**
   * Handle share
   */
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content?.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Loading state
  if (postLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <CardSkeleton />
      </div>
    );
  }

  // Error state
  if (postError) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800">Error Loading Post</h3>
          </div>
          <p className="mt-2 text-red-700">{postError}</p>
          <button
            onClick={refetchPost}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Post not found
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Post not found</h3>
          <p className="text-gray-600 mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-red-600 transition-colors duration-200">
              Home
            </Link>
          </li>
          <li>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <Link to={`/category/${post.category}`} className="hover:text-red-600 transition-colors duration-200">
              {post.category}
            </Link>
          </li>
          <li>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-gray-900 truncate">{post.title}</li>
        </ol>
      </nav>

      {/* Main Post Content */}
      <article className="bg-white rounded-lg shadow-sm border mb-8">
        {/* Post Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              {/* Post Meta */}
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <span className="text-red-600 font-semibold text-sm">
                      {post.author?.username?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <span>{post.author?.username || 'Anonymous'}</span>
                </div>
                <span>•</span>
                <time dateTime={post.createdAt}>
                  {formatDate(post.createdAt)}
                </time>
                <span>•</span>
                <span>{getReadingTime(post.content)} min read</span>
                {post.updatedAt !== post.createdAt && (
                  <>
                    <span>•</span>
                    <span className="text-xs">Edited</span>
                  </>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </div>

        {/* Post Actions */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Like Button */}
              <button
                onClick={() => handleReaction('like')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                  post.userReaction === 'like'
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>{post.likes || 0}</span>
              </button>

              {/* Dislike Button */}
              <button
                onClick={() => handleReaction('dislike')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                  post.userReaction === 'dislike'
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
                <span>{post.dislikes || 0}</span>
              </button>

              {/* Comments Button */}
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-1 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{comments.length} comments</span>
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Comments ({comments.length})
              </h3>
              
              <select
                value={sortComments}
                onChange={(e) => setSortComments(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>
          </div>

          {/* Add Comment Form */}
          {isAuthenticated && (
            <div className="p-6 border-b border-gray-200">
              <form onSubmit={handleCommentSubmit}>
                <div className="mb-4">
                  <textarea
                    name="content"
                    value={commentValues.content}
                    onChange={(e) => handleCommentChange('content', e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                    disabled={isCommentSubmitting}
                  />
                  {commentErrors.content && (
                    <p className="mt-1 text-sm text-red-600">
                      {commentErrors.content}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isCommentSubmitting || !commentValues.content.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isCommentSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            </div>
          )}

          {/* Comments List */}
          <div className="p-6">
            {commentsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
                <p className="text-gray-600">
                  {isAuthenticated 
                    ? 'Be the first to share your thoughts!'
                    : 'Sign in to leave a comment'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-semibold text-sm">
                        {comment.author?.username?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {comment.author?.username || 'Anonymous'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;