import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transporter from "@/models/Transporter";
import { authenticateRequest } from "@/lib/auth";
import { uploadFileFromBuffer } from "@/lib/cloudinary";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request, "company");
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: 401 }
      );
    }

    await dbConnect();

    const vehicleId = params.id;
    const formData = await request.formData();

    // Extract fields
    const registrationNumber = formData.get("registrationNumber") as string;
    const vehicleType = formData.get("vehicleType") as string;
    const capacity = formData.get("capacity") as string;
    const modelYear = formData.get("modelYear") ? parseInt(formData.get("modelYear") as string) : undefined;
    const driverName = formData.get("driverName") as string;
    const driverPhone = formData.get("driverPhone") as string;

    const company = await Transporter.findById(auth.user.id);
    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    const vehicleIndex = company.vehicles.findIndex((v: any) => v._id.toString() === vehicleId);
    if (vehicleIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 }
      );
    }

    const vehicle = company.vehicles[vehicleIndex];

    // Update fields
    if (registrationNumber) vehicle.registrationNumber = registrationNumber.toUpperCase();
    if (vehicleType) vehicle.vehicleType = vehicleType;
    if (capacity) vehicle.capacity = capacity;
    if (modelYear) vehicle.modelYear = modelYear;
    if (driverName !== undefined) vehicle.driverName = driverName;
    if (driverPhone !== undefined) vehicle.driverPhone = driverPhone;

    // Handle document uploads if provided
    const rcFile = formData.get("rcDocument") as File | null;
    const insuranceFile = formData.get("insuranceDocument") as File | null;
    const pucFile = formData.get("pucDocument") as File | null;
    const fitnessFile = formData.get("fitnessDocument") as File | null;

    if (rcFile && rcFile.size > 0) {
      vehicle.documents.rcUrl = (await uploadFileFromBuffer(Buffer.from(await rcFile.arrayBuffer()), `vehicles/${company.transporterId}/rc`)).secure_url;
    }
    if (insuranceFile && insuranceFile.size > 0) {
      vehicle.documents.insuranceUrl = (await uploadFileFromBuffer(Buffer.from(await insuranceFile.arrayBuffer()), `vehicles/${company.transporterId}/insurance`)).secure_url;
    }
    if (pucFile && pucFile.size > 0) {
      vehicle.documents.pucUrl = (await uploadFileFromBuffer(Buffer.from(await pucFile.arrayBuffer()), `vehicles/${company.transporterId}/puc`)).secure_url;
    }
    if (fitnessFile && fitnessFile.size > 0) {
      vehicle.documents.fitnessUrl = (await uploadFileFromBuffer(Buffer.from(await fitnessFile.arrayBuffer()), `vehicles/${company.transporterId}/fitness`)).secure_url;
    }

    vehicle.updatedAt = new Date();
    company.vehicles[vehicleIndex] = vehicle;
    await company.save();

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle updated successfully",
        data: vehicle,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update vehicle error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update vehicle", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request, "company");
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: 401 }
      );
    }

    await dbConnect();

    const vehicleId = params.id;

    const company = await Transporter.findById(auth.user.id);
    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company not found" },
        { status: 404 }
      );
    }

    const vehicleIndex = company.vehicles.findIndex((v: any) => v._id.toString() === vehicleId);
    if (vehicleIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Vehicle not found" },
        { status: 404 }
      );
    }

    company.vehicles.splice(vehicleIndex, 1);
    company.vehiclesCount = company.vehicles.length;
    await company.save();

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete vehicle error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete vehicle", error: error.message },
      { status: 500 }
    );
  }
}
