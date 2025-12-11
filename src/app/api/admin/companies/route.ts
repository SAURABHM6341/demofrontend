import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transporter from "@/models/Transporter";
import { authenticateRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request, "admin");
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Search
    const search = searchParams.get("search") || "";
    
    // Filters
    const operatingStates = searchParams.get("operatingStates")?.split(",").filter(Boolean) || [];
    const vehicleType = searchParams.get("vehicleType") || "";
    const vehicleCountMin = searchParams.get("vehicleCountMin");
    const vehicleCountMax = searchParams.get("vehicleCountMax");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build query
    const query: any = {};

    // Text search
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { contactPerson: { $regex: search, $options: "i" } },
        { gstNumber: { $regex: search, $options: "i" } },
        { primaryPhone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Operating states filter
    if (operatingStates.length > 0) {
      query.operatingStates = { $in: operatingStates };
    }

    // Vehicle type filter
    if (vehicleType) {
      query["vehicles.vehicleType"] = vehicleType;
    }

    // Vehicle count filter
    if (vehicleCountMin !== null || vehicleCountMax !== null) {
      query.vehiclesCount = {};
      if (vehicleCountMin) query.vehiclesCount.$gte = parseInt(vehicleCountMin);
      if (vehicleCountMax) query.vehiclesCount.$lte = parseInt(vehicleCountMax);
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    // Get total count
    const total = await Transporter.countDocuments(query);

    // Get companies
    const companies = await Transporter.find(query)
      .select("-passwordHash -notes")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: {
          companies,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get companies error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get companies", error: error.message },
      { status: 500 }
    );
  }
}
