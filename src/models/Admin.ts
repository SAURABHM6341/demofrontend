import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcrypt";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

AdminSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

const Admin = models.Admin || model("Admin", AdminSchema);
export default Admin;
