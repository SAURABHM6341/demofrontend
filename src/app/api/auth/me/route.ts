import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transporter from "@/models/Transporter";
import { authenticateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request, "company");
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: 401 }
      );
    }

    await dbConnect();

    const company = await Transporter.findById(auth.user.id).select("-passwordHash");
    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: company._id,
          transporterId: company.transporterId,
          companyName: company.companyName,
          contactPerson: company.contactPerson,
          email: company.email,
          primaryPhone: company.primaryPhone,
          altPhone: company.altPhone,
          gstNumber: company.gstNumber,
          panNumber: company.panNumber,
          address: company.address,
          operatingStates: company.operatingStates,
          website: company.website,
          vehiclesCount: company.vehiclesCount,
          createdAt: company.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get user data", error: error.message },
      { status: 500 }
    );
  }
}
