import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transporter from "@/models/Transporter";
import { authenticateRequest } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request, "admin");
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { text } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Note text is required" },
        { status: 400 }
      );
    }

    const company = await Transporter.findById(params.id);
    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    const newNote = {
      adminId: auth.user.id,
      text: text.trim(),
      createdAt: new Date(),
    };

    company.notes.push(newNote);
    await company.save();

    return NextResponse.json(
      {
        success: true,
        message: "Note added successfully",
        data: newNote,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Add note error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add note", error: error.message },
      { status: 500 }
    );
  }
}
