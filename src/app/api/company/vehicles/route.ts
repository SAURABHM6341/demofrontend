import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transporter from "@/models/Transporter";
import { authenticateRequest } from "@/lib/auth";
import { generateVehicleId } from "@/lib/idGenerator";
import { uploadFileFromBuffer } from "@/lib/cloudinary";
import { sendEmail, emailTemplates } from "@/lib/mailer";

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

    const company = await Transporter.findById(auth.user.id).select("vehicles");
    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: company.vehicles || [],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get vehicles error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get vehicles", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
      registrationNumber,
      vehicleType,
      capacity,
      modelYear,
      driverName,
      driverPhone,
      availability,
      route,
      permit,
      consentToContact,
      confirmAccuracy,
      documents
    } = body;

    // Validation
    if (!registrationNumber || !vehicleType || !capacity || !modelYear) {
      return NextResponse.json(
        { success: false, message: "Required fields: registrationNumber, vehicleType, capacity, modelYear" },
        { status: 400 }
      );
    }

    if (!consentToContact || !confirmAccuracy) {
      return NextResponse.json(
        { success: false, message: "Both consent checkboxes must be checked" },
        { status: 400 }
      );
    }

    // Check for document links
    if (!documents || !documents.rcUrl || !documents.insuranceUrl) {
      return NextResponse.json(
        { success: false, message: "RC and Insurance document links are required" },
        { status: 400 }
      );
    }

    // Get company
    const company = await Transporter.findById(auth.user.id);
    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    // Check for duplicate registration number within company
    const duplicate = company.vehicles.find(
      (v: any) => v.registrationNumber.toLowerCase() === registrationNumber.toLowerCase()
    );
    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "Vehicle with this registration number already exists" },
        { status: 409 }
      );
    }

    // Generate vehicle ID
    const vehicleId = generateVehicleId(company.vehicles);

    // Create vehicle object with Google Drive links
    const newVehicle = {
      vehicleId,
      registrationNumber: registrationNumber.toUpperCase(),
      vehicleType,
      capacity,
      modelYear: parseInt(modelYear),
      driverName: driverName || "",
      driverPhone: driverPhone || "",
      availability: availability || "Available",
      route: route || "",
      permit: permit || "",
      documents: {
        rcUrl: documents.rcUrl,
        insuranceUrl: documents.insuranceUrl,
        pucUrl: documents.pucUrl || "",
        fitnessUrl: documents.fitnessUrl || "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add vehicle to company
    company.vehicles.push(newVehicle);
    company.vehiclesCount = company.vehicles.length;
    await company.save();

    // Send vehicle added email
    try {
      await sendEmail({
        to: company.email,
        subject: "Vehicle Added Successfully - CargoMatters",
        html: emailTemplates.vehicleAdded({
          companyName: company.companyName,
          vehicleId,
          registrationNumber: registrationNumber.toUpperCase(),
          vehicleType,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send vehicle added email:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle added successfully",
        data: newVehicle,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Add vehicle error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add vehicle", error: error.message },
      { status: 500 }
    );
  }
}
