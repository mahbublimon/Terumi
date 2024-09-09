import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  reputation: { type: Number, default: 0 },
});

export default mongoose.model("User", userSchema);
