import mongoose from "mongoose";

const Schema = mongoose.Schema;
const NoteSchema = new Schema({
  userid: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to auto-update `updatedAt` before saving
NoteSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Note = mongoose.model("Note", NoteSchema);
export default Note;
