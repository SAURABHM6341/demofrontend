import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

async function ensureAdminExists() {
  await connectToDatabase();
  const existing = await Admin.findOne({ email: "admin@cargomatter.com" });
  if (!existing) {
    const passwordHash = await bcrypt.hash("admin@123", 10);
    await Admin.create({ email: "admin@cargomatter.com", passwordHash, name: "CargoMatters Admin" });
  }
}

export async function POST(req: Request) {
  try {
    await ensureAdminExists();
    const body = await req.json();
    const { email, password } = body;
    await connectToDatabase();
    const admin = await Admin.findOne({ email });
    if (!admin) return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    const valid = await admin.comparePassword(password);
    if (!valid) return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    const token = jwt.sign({ id: admin._id.toString(), email: admin.email, type: "admin" }, JWT_SECRET, { expiresIn: "8h" });
    return NextResponse.json({ success: true, token });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
