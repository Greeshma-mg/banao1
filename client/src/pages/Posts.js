import React, { useState, useEffect } from "react";
import axios from "axios";
import './Posts.css';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({}); 

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const res = await axios.get("http://localhost:5000/api/posts", config);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to create/update posts");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/posts/${editingId}`,
          { title, content },
          config
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/posts",
          { title, content },
          config
        );
      }

      setTitle("");
      setContent("");
      setEditingId(null);
      fetchPosts();
    } catch (err) {
      console.error("Error saving post:", err);
      alert("Failed to save post. Check console for details.");
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title || "");
    setContent(post.content || "");
    setEditingId(post._id);
  };

  const handleDelete = async (id) => {
    if (!token) {
      alert("You must be logged in to delete posts");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/posts/${id}`, config);
      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Check console for details.");
    }
  };

  const handleLike = async (id) => {
    if (!token) {
      alert("You must be logged in to like/unlike posts");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(
        `http://localhost:5000/api/posts/${id}/like`,
        {},
        config
      );

      setPosts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, likesCount: res.data.likesCount } : p
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (id) => {
    if (!token) {
      alert("You must be logged in to comment");
      return;
    }

    if (!commentText[id]) {
      alert("Comment cannot be empty");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(
        `http://localhost:5000/api/posts/${id}/comment`,
        { text: commentText[id] },
        config
      );

      setPosts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, comments: res.data } : p
        )
      );

      setCommentText((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  const toggleComments = (id) => {
    setOpenComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="posts-container">
      <h2>{editingId ? "Edit Post" : "Create Post"}</h2>
      <form onSubmit={handleSubmit} className="posts-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
      </form>

      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            <p>👍 {post.likesCount || (post.likes ? post.likes.length : 0)}</p>
            <button onClick={() => handleLike(post._id)}>Like/Unlike</button>

            <button onClick={() => toggleComments(post._id)}>
              {openComments[post._id] ? "Hide Comments" : "Show Comments"}
            </button>

            {openComments[post._id] && (
              <div className="comments">
                <h4>Comments</h4>
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((c, i) => (
                    <p key={i}>
                      <strong>{c.user?.username || "User"}:</strong> {c.text}
                    </p>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}

                <input
                  type="text"
                  placeholder="Add a comment"
                  value={commentText[post._id] || ""}
                  onChange={(e) =>
                    setCommentText({ ...commentText, [post._id]: e.target.value })
                  }
                />
                <button onClick={() => handleComment(post._id)}>Comment</button>
              </div>
            )}

            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}
