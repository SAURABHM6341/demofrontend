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

    // Get total companies count
    const totalCompanies = await Transporter.countDocuments();

    // Get companies with zero vehicles
    const companiesWithNoVehicles = await Transporter.countDocuments({ vehiclesCount: 0 });

    // Get total vehicles count
    const result = await Transporter.aggregate([
      {
        $group: {
          _id: null,
          totalVehicles: { $sum: "$vehiclesCount" },
        },
      },
    ]);
    const totalVehicles = result.length > 0 ? result[0].totalVehicles : 0;

    // Get monthly registrations (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRegistrations = await Transporter.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Get vehicle type distribution
    const vehicleTypeDistribution = await Transporter.aggregate([
      { $unwind: "$vehicles" },
      {
        $group: {
          _id: "$vehicles.vehicleType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get visitors count (sum of all company visitors)
    const visitorsResult = await Transporter.aggregate([
      {
        $group: {
          _id: null,
          totalVisitors: { $sum: "$visitors" },
        },
      },
    ]);
    const totalVisitors = visitorsResult.length > 0 ? visitorsResult[0].totalVisitors : 0;

    // Step completion stats
    // Step 1: Profile completed (has basic info)
    const step1Completed = await Transporter.countDocuments({
      companyName: { $exists: true, $ne: "" },
      email: { $exists: true, $ne: "" },
      primaryPhone: { $exists: true, $ne: "" },
    });

    // Step 2: Documents uploaded (has at least one document)
    const step2Completed = await Transporter.countDocuments({
      $or: [
        { "documents.gstCertificateUrl": { $exists: true, $ne: "" } },
        { "documents.panCardUrl": { $exists: true, $ne: "" } },
        { "documents.aadhaarCardUrl": { $exists: true, $ne: "" } },
        { "documents.registrationProofUrl": { $exists: true, $ne: "" } },
      ],
    });

    // Step 3: Vehicles added (has at least one vehicle)
    const step3Completed = await Transporter.countDocuments({
      vehiclesCount: { $gt: 0 },
    });

    // Recent registrations (last 5)
    const recentRegistrations = await Transporter.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("transporterId companyName contactPerson vehiclesCount createdAt");

    return NextResponse.json(
      {
        success: true,
        data: {
          totalCompanies,
          companiesWithNoVehicles,
          totalVehicles,
          totalVisitors,
          step1Completed,
          step2Completed,
          step3Completed,
          monthlyRegistrations: monthlyRegistrations.map((m) => ({
            year: m._id.year,
            month: m._id.month,
            count: m.count,
          })),
          vehicleTypeDistribution: vehicleTypeDistribution.map((v) => ({
            type: v._id,
            count: v.count,
          })),
          recentRegistrations,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get stats", error: error.message },
      { status: 500 }
    );
  }
}
