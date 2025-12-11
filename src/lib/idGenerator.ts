import Transporter from "@/models/Transporter";

/**
 * Generate transporterId in format T-CARGO-0001
 */
export async function generateTransporterId(): Promise<string> {
  const lastTransporter = await Transporter.findOne()
    .sort({ transporterId: -1 })
    .select("transporterId")
    .lean();

  if (!lastTransporter || !lastTransporter.transporterId) {
    return "T-CARGO-0001";
  }

  const lastId = lastTransporter.transporterId;
  const match = lastId.match(/T-CARGO-(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10) + 1;
    return `T-CARGO-${num.toString().padStart(4, "0")}`;
  }

  return "T-CARGO-0001";
}

/**
 * Generate vehicleId in format VH-0001 (per company)
 */
export function generateVehicleId(existingVehicles: any[]): string {
  if (!existingVehicles || existingVehicles.length === 0) {
    return "VH-0001";
  }

  const lastVehicle = existingVehicles[existingVehicles.length - 1];
  const match = lastVehicle.vehicleId?.match(/VH-(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10) + 1;
    return `VH-${num.toString().padStart(4, "0")}`;
  }

  return `VH-${(existingVehicles.length + 1).toString().padStart(4, "0")}`;
}
