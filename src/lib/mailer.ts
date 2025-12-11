import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

let transporter: nodemailer.Transporter | null = null;

if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
} else {
  // fallback - log emails to console
  transporter = nodemailer.createTransport({
    jsonTransport: true,
  });
}

export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html?: string; text?: string }) {
  const info = await transporter!.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@cargomatters.com",
    to,
    subject,
    html,
    text,
  });
  // If using jsonTransport, info.message will contain the JSON
  console.log("Email sent:", info?.messageId || info);
  return info;
}

export function acknowledgementTemplate(name: string) {
  return {
    subject: "CargoMatters: Registration Received",
    html: `<p>Hi ${name},</p><p>Thanks for registering as a transport partner. We have received your submission and will review it shortly.</p><p>Regards,<br/>CargoMatters Team</p>`,
  };
}

export function approvalTemplate(name: string) {
  return {
    subject: "CargoMatters: Registration Approved",
    html: `<p>Hi ${name},</p><p>Your registration has been approved. Welcome aboard!</p><p>Regards,<br/>CargoMatters Team</p>`,
  };
}

export function rejectionTemplate(name: string, reason = "Not specified") {
  return {
    subject: "CargoMatters: Registration Rejected",
    html: `<p>Hi ${name},</p><p>We're sorry to inform you that your registration was rejected. Reason: ${reason}</p><p>Regards,<br/>CargoMatters Team</p>`,
  };
}

// New email templates for company registration system
export const emailTemplates = {
  registrationAcknowledgement: ({
    companyName,
    contactPerson,
    transporterId,
  }: {
    companyName: string;
    contactPerson: string;
    transporterId: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to CargoMatters!</h1>
        </div>
        <div class="content">
          <h2>Registration Successful</h2>
          <p>Dear ${contactPerson},</p>
          <p>Thank you for registering <strong>${companyName}</strong> with CargoMatters. Your registration has been successfully completed.</p>
          <p><strong>Your Transporter ID:</strong> ${transporterId}</p>
          <p>You can now login to your dashboard and start adding your vehicles to begin receiving transport opportunities.</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/company/login" class="button">Login to Dashboard</a>
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,<br>The CargoMatters Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} CargoMatters. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  vehicleAdded: ({
    companyName,
    vehicleId,
    registrationNumber,
    vehicleType,
  }: {
    companyName: string;
    vehicleId: string;
    registrationNumber: string;
    vehicleType: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .vehicle-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vehicle Added Successfully!</h1>
        </div>
        <div class="content">
          <p>Dear ${companyName},</p>
          <p>Your vehicle has been successfully added to your fleet on CargoMatters.</p>
          <div class="vehicle-info">
            <h3>Vehicle Details:</h3>
            <p><strong>Vehicle ID:</strong> ${vehicleId}</p>
            <p><strong>Registration Number:</strong> ${registrationNumber}</p>
            <p><strong>Vehicle Type:</strong> ${vehicleType}</p>
          </div>
          <p>Your vehicle is now visible to potential clients looking for transport services. We'll notify you when there are relevant opportunities.</p>
          <p>Best regards,<br>The CargoMatters Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} CargoMatters. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  reminderToAddVehicles: ({
    companyName,
    contactPerson,
    transporterId,
  }: {
    companyName: string;
    contactPerson: string;
    transporterId: string;
  }) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Complete Your Registration</h1>
        </div>
        <div class="content">
          <p>Dear ${contactPerson},</p>
          <p>We noticed that you registered <strong>${companyName}</strong> with CargoMatters (ID: ${transporterId}), but haven't added any vehicles yet.</p>
          <p>To start receiving transport opportunities and connect with potential clients, please add your vehicles to your profile.</p>
          <p>Adding vehicles is quick and easy:</p>
          <ul>
            <li>Login to your dashboard</li>
            <li>Click "Add Vehicle"</li>
            <li>Fill in vehicle details and upload required documents</li>
            <li>Start receiving opportunities!</li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/company/login" class="button">Add Vehicles Now</a>
          <p>If you need any assistance, our support team is here to help.</p>
          <p>Best regards,<br>The CargoMatters Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} CargoMatters. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
};

export default transporter;
