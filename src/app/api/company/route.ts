import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transporter from "@/models/Transporter";
import { authenticateRequest } from "@/lib/auth";
import { uploadFileFromBuffer } from "@/lib/cloudinary";

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

    const company = await Transporter.findById(auth.user.id).select("-passwordHash -notes");
    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: company,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get company error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get company data", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request, "company");
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    
    // Extract fields from JSON payload
    const {
      companyName,
      contactPerson,
      primaryPhone,
      altPhone,
      gstNumber,
      panNumber,
      address,
      website,
      operatingStates,
      documents
    } = body;

    const company = await Transporter.findById(auth.user.id);
    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    // Update text fields
    const updateData: any = {};
    if (companyName) updateData.companyName = companyName;
    if (contactPerson) updateData.contactPerson = contactPerson;
    if (primaryPhone) updateData.primaryPhone = primaryPhone;
    if (altPhone !== undefined) updateData.altPhone = altPhone;
    if (gstNumber !== undefined) updateData.gstNumber = gstNumber;
    if (panNumber !== undefined) updateData.panNumber = panNumber;
    if (address !== undefined) updateData.address = address;
    if (operatingStates && operatingStates.length > 0) updateData.operatingStates = operatingStates;
    if (website !== undefined) updateData.website = website;

    // Update document Google Drive links if provided
    if (documents) {
      if (!company.documents) {
        company.documents = {};
      }
      
      if (documents.gstCertificateUrl) {
        company.documents.gstCertificateUrl = documents.gstCertificateUrl;
      }
      if (documents.panCardUrl) {
        company.documents.panCardUrl = documents.panCardUrl;
      }
      if (documents.aadhaarCardUrl) {
        company.documents.aadhaarCardUrl = documents.aadhaarCardUrl;
      }
      if (documents.registrationProofUrl) {
        company.documents.registrationProofUrl = documents.registrationProofUrl;
      }
    }

    // Apply updates
    Object.assign(company, updateData);
    company.updatedAt = new Date();
    await company.save();

    const updatedCompany = await Transporter.findById(auth.user.id).select("-passwordHash -notes");

    return NextResponse.json(
      {
        success: true,
        message: "Company profile updated successfully",
        data: updatedCompany,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update company error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update company", error: error.message },
      { status: 500 }
    );
  }
}
