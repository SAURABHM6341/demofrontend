import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transporter from "@/models/Transporter";
import { sendEmail, emailTemplates } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication or secret token check for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "change-this-in-production";
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find companies with:
    // 1. Zero vehicles
    // 2. Created at least 2 days ago
    // 3. Haven't been reminded yet (remindedAt is null)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const companiesNeedingReminder = await Transporter.find({
      vehiclesCount: 0,
      createdAt: { $lte: twoDaysAgo },
      remindedAt: null,
    });

    console.log(`Found ${companiesNeedingReminder.length} companies needing reminders`);

    const results = {
      total: companiesNeedingReminder.length,
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send reminder emails
    for (const company of companiesNeedingReminder) {
      try {
        await sendEmail({
          to: company.email,
          subject: "Complete Your Registration - Add Vehicles to CargoMatters",
          html: emailTemplates.reminderToAddVehicles({
            companyName: company.companyName,
            contactPerson: company.contactPerson,
            transporterId: company.transporterId,
          }),
        });

        // Mark as reminded
        company.remindedAt = new Date();
        await company.save();

        results.sent++;
        console.log(`Reminder sent to ${company.email}`);
      } catch (emailError: any) {
        results.failed++;
        results.errors.push(`Failed to send to ${company.email}: ${emailError.message}`);
        console.error(`Failed to send reminder to ${company.email}:`, emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Reminder job completed",
        data: results,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Reminder job error:", error);
    return NextResponse.json(
      { success: false, message: "Reminder job failed", error: error.message },
      { status: 500 }
    );
  }
}
