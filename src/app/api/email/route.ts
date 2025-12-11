import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

const FILE_FIELDS = ["resume", "attachment"];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const textFields: Record<string, string> = {};
    const attachmentsData: Attachment[] = [];

        for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const bytes = await value.arrayBuffer();
        const buffer = Buffer.from(bytes);
        attachmentsData.push({
          filename: value.name,
          content: buffer,
        });
      } else if (typeof value === "string") {
        textFields[key] = value;
      }
    }

        // Build dynamic email body
    const bodyText = Object.entries(textFields)
      .map(([key, val]) => `${key}: ${val}`)
      .join("\n");



    // Convert file to buffer if present

    // Configure transporter (using Gmail example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // app password (not regular password)
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Cargo Matters Website" <${process.env.EMAIL_USER}>`,
      to: "cargomattersindia@gmail.com", // where you want to receive applications
      subject: "New Form Submission",
      text: bodyText,
      attachments: attachmentsData,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    let message = "Unknown error";
    if (error instanceof Error) { message = error.message; }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
