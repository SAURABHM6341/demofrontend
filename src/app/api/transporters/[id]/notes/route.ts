import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Transporter from "@/models/Transporter";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await req.json();
    const { notes } = body;
    const t = await Transporter.findById(id);
    if (!t) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    t.notes = notes || "";
    await t.save();
    return NextResponse.json({ success: true, item: t });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
