// Purpose: Establish connection to MongoDB database using mongoose.
import mongoose from "mongoose";

const mongodbUrl = "mongodb://127.0.0.1:27017/flashapp";

mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const db = mongoose.connection;

db.once("open", () => {
  console.log("📡 MongoDB connection is open");
});

export default db;
