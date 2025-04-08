import mongoose from "mongoose";
import note from "./model/note.js";
import db from './db.js'; // Import Note model


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const seedNotes = async () => {
  try {// Clear existing notes
    await note.insertMany([
      { title: "Learn Node.js", body: "Study the basics of Node.js and Express." },
      { title: "MongoDB Guide", body: "Practice database queries with MongoDB." },
      { title: "Build a Notes App", body: "Create a full-stack Notes app using EJS and Express." },
    ]);
    console.log("✅ Dummy notes added!");
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

seedNotes();
