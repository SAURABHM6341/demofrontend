import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Transporter from "@/models/Transporter";
import { Parser } from "json2csv";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || undefined;
    const filter: any = {};
    if (status) filter.status = status;
    const items = await Transporter.find(filter).lean().limit(10000);
    const fields = ["_id", "companyName", "ownerName", "gstNumber", "panNumber", "contact.email", "contact.mobile", "status", "createdAt"];
    const parser = new Parser({ fields });
    const csv = parser.parse(items as any[]);
    return new NextResponse(csv, {
      status: 200,
      headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="transporters_${Date.now()}.csv"` },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
