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
    const type = searchParams.get("type") || "companies";

    if (type === "companies") {
      const companies = await Transporter.find()
        .select("-passwordHash -notes -vehicles")
        .sort({ createdAt: -1 })
        .lean();

      // Convert to CSV
      const headers = [
        "Transporter ID",
        "Company Name",
        "Contact Person",
        "Email",
        "Primary Phone",
        "GST Number",
        "PAN Number",
        "Address",
        "Operating States",
        "Vehicles Count",
        "Created At",
      ];

      const rows = companies.map((c: any) => [
        c.transporterId || "",
        c.companyName || "",
        c.contactPerson || "",
        c.email || "",
        c.primaryPhone || "",
        c.gstNumber || "",
        c.panNumber || "",
        c.address || "",
        (c.operatingStates || []).join("; "),
        c.vehiclesCount || 0,
        new Date(c.createdAt).toISOString(),
      ]);

      const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="companies_${Date.now()}.csv"`,
        },
      });
    } else if (type === "vehicles") {
      const companies = await Transporter.find()
        .select("transporterId companyName vehicles")
        .lean();

      // Flatten vehicles
      const vehicles: any[] = [];
      companies.forEach((company: any) => {
        (company.vehicles || []).forEach((vehicle: any) => {
          vehicles.push({
            transporterId: company.transporterId,
            companyName: company.companyName,
            ...vehicle,
          });
        });
      });

      // Convert to CSV
      const headers = [
        "Transporter ID",
        "Company Name",
        "Vehicle ID",
        "Registration Number",
        "Vehicle Type",
        "Capacity",
        "Model Year",
        "Driver Name",
        "Driver Phone",
        "Created At",
      ];

      const rows = vehicles.map((v: any) => [
        v.transporterId || "",
        v.companyName || "",
        v.vehicleId || "",
        v.registrationNumber || "",
        v.vehicleType || "",
        v.capacity || "",
        v.modelYear || "",
        v.driverName || "",
        v.driverPhone || "",
        new Date(v.createdAt).toISOString(),
      ]);

      const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="vehicles_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid export type" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, message: "Export failed", error: error.message },
      { status: 500 }
    );
  }
}
