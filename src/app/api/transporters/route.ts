import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Transporter from "@/models/Transporter";
import { uploadFileFromBuffer } from "@/lib/cloudinary";
import { acknowledgementTemplate, sendEmail } from "@/lib/mailer";

async function handleFileUpload(field: any, subfolder: string) {
  if (!field) return null;
  try {
    const buffer = Buffer.from(await field.arrayBuffer());
    const baseFolder = process.env.CLOUDINARY_FOLDER || "cargo";
    const fullPath = `${baseFolder}/${subfolder}`;
    const result = await uploadFileFromBuffer(buffer, fullPath);
    return result.secure_url;
  } catch (err) {
    console.error("upload error", err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const form = await req.formData();
    // required fields validation
    const companyName = form.get("companyName")?.toString() || "";
    const ownerName = form.get("contactPerson")?.toString() || "";
    const businessType = form.get("ownerIdentity")?.toString() || "";
    const gstNumber = form.get("gstNumber")?.toString() || "";
    const panNumber = form.get("panNumber")?.toString() || "";
    const address = form.get("address")?.toString() || "";
    const operatingStatesRaw = form.get("interstateStates")?.toString() || form.get("operatingStates")?.toString() || "";
    const operatingStates = operatingStatesRaw ? operatingStatesRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];

    if (!companyName || !ownerName || !businessType || !gstNumber || !panNumber || !address || operatingStates.length === 0) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // upload documents
    const panFile = form.get("pan");
    const gstFile = form.get("gst");
    const rcFile = form.get("vehicleRc");
    const aadhaarFile = form.get("aadhaar");

    const panUrl = await handleFileUpload(panFile, "transporters/pan");
    const gstUrl = await handleFileUpload(gstFile, "transporters/gst");
    const rcUrl = await handleFileUpload(rcFile, "transporters/rc");
    const aadhaarUrl = aadhaarFile ? await handleFileUpload(aadhaarFile, "transporters/aadhaar") : undefined;

    const contact = {
      mobile: form.get("mobile")?.toString() || "",
      altMobile: form.get("alternateMobile")?.toString() || "",
      whatsapp: form.get("whatsappNumber")?.toString() || "",
      email: form.get("email")?.toString() || "",
      website: form.get("website")?.toString() || "",
    };

    const fleet = {
      totalVehicles: parseInt(form.get("totalVehicles")?.toString() || "0"),
      vehicleTypes: (form.getAll("vehicleTypes[]") || []).map((v) => v.toString()),
      capacities: (form.getAll("capacities[]") || []).map((v) => v.toString()),
      availability: form.get("availability")?.toString() || "",
      coverage: (form.getAll("coverage[]") || []).map((v) => v.toString()),
    };

    const docObj: any = {
      panCard: panUrl,
      gstCertificate: gstUrl,
      rcProof: rcUrl,
      aadhaarCard: aadhaarUrl,
    };

    const newTransporter = await Transporter.create({
      companyName,
      ownerName,
      businessType,
      gstNumber,
      panNumber,
      aadhaarNumber: form.get("aadhaarNumber")?.toString() || "",
      address,
      operatingStates,
      contact,
      fleet,
      documents: docObj,
      status: "Pending",
    });

    // send acknowledgement email
    try {
      const tpl = acknowledgementTemplate(ownerName || companyName);
      await sendEmail({ to: contact.email || "", subject: tpl.subject, html: tpl.html });
    } catch (e) {
      console.error("mail error", e);
    }

    return NextResponse.json({ success: true, id: newTransporter._id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const status = url.searchParams.get("status");
    const q = url.searchParams.get("q");
    const vehicleType = url.searchParams.get("vehicleType");
    const capacity = url.searchParams.get("capacity");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const filter: any = {};
    if (status) filter.status = status;
    if (vehicleType) filter["fleet.vehicleTypes"] = vehicleType;
    if (capacity) filter["fleet.capacities"] = capacity;
    
    // Date range filter
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filter.createdAt = { $gte: start };
      
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }
    
    if (q) {
      filter.$or = [
        { companyName: new RegExp(q, "i") },
        { ownerName: new RegExp(q, "i") },
        { "contact.mobile": new RegExp(q, "i") },
        { gstNumber: new RegExp(q, "i") },
      ];
    }

    const total = await Transporter.countDocuments(filter);
    const items = await Transporter.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    return NextResponse.json({ success: true, items, total, page, limit });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
