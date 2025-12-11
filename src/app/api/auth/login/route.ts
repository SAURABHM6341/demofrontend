import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongodb";
import Transporter from "@/models/Transporter";
import { signToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find company
    const company = await Transporter.findOne({ email: email.toLowerCase() });
    if (!company) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, company.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({
      id: company._id.toString(),
      email: company.email,
      type: "company",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          token,
          company: {
            id: company._id,
            transporterId: company.transporterId,
            companyName: company.companyName,
            contactPerson: company.contactPerson,
            email: company.email,
            vehiclesCount: company.vehiclesCount,
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed", error: error.message },
      { status: 500 }
    );
  }
}
