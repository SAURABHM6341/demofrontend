import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongodb";
import Transporter from "@/models/Transporter";
import { generateTransporterId } from "@/lib/idGenerator";
import { signToken } from "@/lib/jwt";
import { sendEmail, emailTemplates } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { companyName, contactPerson, primaryPhone, email, password } = body;

    // Validation
    if (!companyName || !contactPerson || !primaryPhone || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingCompany = await Transporter.findOne({ email: email.toLowerCase() });
    if (existingCompany) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate transporter ID
    const transporterId = await generateTransporterId();

    // Create company
    const company = await Transporter.create({
      transporterId,
      companyName,
      contactPerson,
      primaryPhone,
      email: email.toLowerCase(),
      passwordHash,
      vehiclesCount: 0,
      visitors: 0,
      vehicles: [],
      notes: [],
    });

    // Send acknowledgement email
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to CargoMatters - Registration Successful",
        html: emailTemplates.registrationAcknowledgement({
          companyName,
          contactPerson,
          transporterId,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send acknowledgement email:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful! Please login to continue.",
        data: {
          transporterId: company.transporterId,
          companyName: company.companyName,
          email: company.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed", error: error.message },
      { status: 500 }
    );
  }
}
