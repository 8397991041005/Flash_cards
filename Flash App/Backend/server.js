import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import ejs from 'ejs';
import path from 'path';
import db from './db.js'; // Database connection
import User from './model/user.js';
import Note from './model/note.js'; // Note model

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../Frontend"));
app.use(express.static(path.join(__dirname, "../Frontend")));
app.use(express.static(path.join(__dirname, "../Frontend/public")));
app.use(express.static(path.join(__dirname, "../Frontend/resources")));

app.get("/", (req, res) => {
    res.render("login"); // Changed from sendFile to render
});

app.get("/signup", (req, res) => {
    res.render("index"); // Changed from sendFile to render
});

app.get("/login", (req, res) => {
    res.render("login", { message: "logged in successfully" });
});

app.get("/home", (req, res) => {
    if (!req.cookies.userid) {
        return res.redirect("/login");
    }
    res.render("home");
});

// Signup Route
app.post("/signup", async (req, res) => {
    try {   
        console.log("Received data:", req.body);

        const { userid, username, email, password } = req.body;
        if (!userid || !username || !email || !password) {
            return res.json({ status: "error", error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ status: "error", error: "User already exists" });
        }

        const newUser = new User({ userid, username, email, password });
        await newUser.save();

        console.log("User registered successfully:", newUser);
        res.render("login", { message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.json({ status: "error", error: "Something went wrong" });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ status: "error", error: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ status: "error", error: "User not found" });
        }

        if (password !== user.password) {
            return res.json({ status: "error", error: "Invalid password" });
        }

        // Store userid in cookies
        res.cookie("userid", user.userid, { httpOnly: true });

        res.redirect("/home");
    } catch (error) {
        console.error("Login Error:", error);
        res.json({ status: "error", error: "Something went wrong" });
    }
});

// Get User Notes
app.get("/note", async (req, res) => {
    try {
        const userid = req.cookies.userid;
        if (!userid) {
            return res.redirect("/login");
        }

        const userNotes = await Note.find({ userid }).sort({ updatedAt: -1 });
        res.render("notesdash", { notes: userNotes });
    } catch (err) {
        console.error(err);
        res.send("Error loading notes.");
    }
});

// Render Add Note Page
app.get("/addnote", (req, res) => {
    if (!req.cookies.userid) {
        return res.redirect("/login");
    }
    res.render("addnote");
});

// Add a New Note
app.post("/addnote", async (req, res) => {
    try {
        const userid = req.cookies.userid;
        if (!userid) {
            return res.redirect("/login");
        }

        const { title, body } = req.body;

        const user = await User.findOne({ userid });
        if (!user) {
            return res.json({ status: "error", error: "User not found" });
        }

        await Note.create({ title, body, userid, username: user.username });
        res.redirect("/note");
    } catch (err) {
        console.error(err);
        res.send("Error adding note.");
    }
});

// Delete Note
app.post("/deletenote/:id", async (req, res) => {
    try {
        const userid = req.cookies.userid;
        if (!userid) {
            return res.redirect("/login");
        }

        await Note.findByIdAndDelete(req.params.id);
        res.redirect("/note");
    } catch (err) {
        console.error(err);
        res.send("Error deleting note.");
    }
});

// Edit Note Page
app.get("/editnote/:id", async (req, res) => {
    try {
        const userid = req.cookies.userid;
        if (!userid) {
            return res.redirect("/login");
        }

        const notes = await Note.findById(req.params.id);
        if (!notes || notes.userid !== userid) {
            return res.send("Note not found or access denied");
        }
        res.render("editnote", { note: notes });
    } catch (err) {
        console.error(err);
        res.send("Error loading note.");
    }
});

// Update Note
app.post("/updatenote/:id", async (req, res) => {
    try {
        const userid = req.cookies.userid;
        if (!userid) {
            return res.redirect("/login");
        }

        const note = await Note.findById(req.params.id);
        if (!note || note.userid !== userid) {
            return res.send("Note not found or access denied");
        }

        await Note.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect("/note");
    } catch (err) {
        console.error(err);
        res.send("Error updating note.");
    }
});

// Logout
app.get("/logout", (req, res) => {
    res.clearCookie("userid");
    res.redirect("/login");
});

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
