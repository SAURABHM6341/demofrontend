import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Transporter from "@/models/Transporter";
import { approvalTemplate, rejectionTemplate, sendEmail } from "@/lib/mailer";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await req.json();
    const { status, reason } = body;
    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }
    const transporter = await Transporter.findById(id);
    if (!transporter) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    transporter.status = status;
    if (status === "Rejected") {
      transporter.rejectedAt = new Date();
    } else {
      transporter.rejectedAt = undefined as any;
    }
    await transporter.save();

    // send emails accordingly
    try {
      if (status === "Approved") {
        const tpl = approvalTemplate(transporter.ownerName || transporter.companyName);
        await sendEmail({ to: transporter.contact?.email || "", subject: tpl.subject, html: tpl.html });
      }
      if (status === "Rejected") {
        const tpl = rejectionTemplate(transporter.ownerName || transporter.companyName, reason || "");
        await sendEmail({ to: transporter.contact?.email || "", subject: tpl.subject, html: tpl.html });
      }
    } catch (e) {
      console.error("email send failed", e);
    }

    return NextResponse.json({ success: true, item: transporter });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
