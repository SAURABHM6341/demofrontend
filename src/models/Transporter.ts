import mongoose, { Schema, model, models } from "mongoose";

// Vehicle subdocument schema
const VehicleSchema = new Schema(
  {
    vehicleId: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    vehicleType: {
      type: String,
      required: true,
      enum: [
        "Pickup",
        "Tata Ace",
        "LCV",
        "14ft",
        "17ft",
        "19ft",
        "Container",
        "Trailer",
        "Tanker",
        "Refrigerated",
        "Other",
      ],
    },
    capacity: { type: String, required: true },
    modelYear: { type: Number, required: true },
    driverName: { type: String },
    driverPhone: { type: String },
    availability: { type: String, enum: ["Available", "On Trip", "Maintenance"], default: "Available" },
    route: { type: String },
    permit: { type: String },
    documents: {
      rcUrl: { type: String, required: true },
      insuranceUrl: { type: String, required: true },
      pucUrl: { type: String },
      fitnessUrl: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Admin note subdocument schema
const AdminNoteSchema = new Schema(
  {
    adminId: { type: String },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const TransporterSchema = new Schema(
  {
    transporterId: { type: String, unique: true, required: true },
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    primaryPhone: { type: String, required: true },
    altPhone: { type: String },
    gstNumber: { type: String },
    panNumber: { type: String },
    address: { type: String },
    operatingStates: [{ type: String }],
    website: { type: String },
    documents: {
      gstCertificateUrl: { type: String, required: true },
      panCardUrl: { type: String, required: true },
      aadhaarCardUrl: { type: String, required: true },
      registrationProofUrl: { type: String, required: true },
    },
    vehiclesCount: { type: Number, default: 0 },
    vehicles: [VehicleSchema],
    notes: [AdminNoteSchema],
    remindedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes for search and filtering
TransporterSchema.index({ companyName: "text", contactPerson: "text" });
TransporterSchema.index({ gstNumber: 1 });
TransporterSchema.index({ primaryPhone: 1 });
TransporterSchema.index({ createdAt: -1 });
TransporterSchema.index({ "vehicles.registrationNumber": 1 });

// Update vehiclesCount before saving
TransporterSchema.pre("save", function () {
  this.vehiclesCount = this.vehicles?.length || 0;
});

const Transporter = models.Transporter || model("Transporter", TransporterSchema);
export default Transporter;
