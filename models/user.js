import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'mod', 'user'], default: 'admin' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    password: { type: String, required: true, },
    permissions: {
      type: [String],
      enum: ['Read', 'Write', 'Delete'],
      default: function () {
        return this.role === 'admin' ? ['Read', 'Write', 'Delete'] : ['Read'];
      },
    },
  });

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
