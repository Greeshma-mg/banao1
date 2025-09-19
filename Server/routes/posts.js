import express from "express";
import auth from "../middleware/auth.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content required" });
    const post = await Post.create({ author: req.user.id, content });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });
    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    post.content = req.body.content || post.content;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err); 
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });

    const idx = post.likes.findIndex((l) => l.toString() === req.user.id);
    if (idx === -1) post.likes.push(req.user.id);
    else post.likes.splice(idx, 1);

    await post.save();
    res.json({ likesCount: post.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();

    const populated = await Post.findById(post._id).populate("comments.user", "username");
    res.json(populated.comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router; 