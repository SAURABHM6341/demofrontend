"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Edit, Trash2, FileText, LogOut } from "lucide-react";

interface Company {
  id: string;
  transporterId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  primaryPhone: string;
  altPhone?: string;
  gstNumber?: string;
  panNumber?: string;
  address?: string;
  operatingStates?: string[];
  website?: string;
  documents?: {
    gstCertificateUrl?: string;
    panCardUrl?: string;
    aadhaarCardUrl?: string;
    registrationProofUrl?: string;
  };
  vehiclesCount: number;
}

interface Vehicle {
  _id: string;
  vehicleId: string;
  registrationNumber: string;
  vehicleType: string;
  capacity: string;
  modelYear: number;
  driverName?: string;
  driverPhone?: string;
  documents: {
    rcUrl: string;
    insuranceUrl: string;
    pucUrl?: string;
    fitnessUrl?: string;
  };
  createdAt: string;
}

export default function CompanyDashboardPage() {
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "vehicles">("overview");
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    fetchCompanyData();
    fetchVehicles();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const token = localStorage.getItem("companyToken");
      if (!token) {
        router.push("/company/login");
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      const result = await response.json();
      setCompany(result.data);
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("companyToken");
      router.push("/company/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("companyToken");
      if (!token) return;

      const response = await fetch("/api/company/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        setVehicles(result.data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("companyToken");
    localStorage.removeItem("companyData");
    toast.success("Logged out successfully");
    router.push("/company/login");
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const token = localStorage.getItem("companyToken");
      const response = await fetch(`/api/company/vehicles/${vehicleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Vehicle deleted successfully");
        fetchVehicles();
        fetchCompanyData();
      } else {
        toast.error(result.message || "Failed to delete vehicle");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Failed to delete vehicle");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Company Dashboard</h1>
            <p className="text-muted-foreground">
              {company.companyName} • ID: {company.transporterId}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            className={`pb-2 px-4 ${
              activeTab === "overview"
                ? "border-b-2 border-primary font-semibold"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`pb-2 px-4 ${
              activeTab === "profile"
                ? "border-b-2 border-primary font-semibold"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`pb-2 px-4 ${
              activeTab === "vehicles"
                ? "border-b-2 border-primary font-semibold"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("vehicles")}
          >
            Vehicles ({vehicles.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{vehicles.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Company Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-green-600">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => {
                    setActiveTab("vehicles");
                    setShowAddVehicle(true);
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vehicle
                </Button>
                <Button
                  onClick={() => {
                    setActiveTab("profile");
                    setShowEditProfile(true);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <ProfileTab
            company={company}
            showEdit={showEditProfile}
            onEditToggle={setShowEditProfile}
            onUpdate={fetchCompanyData}
          />
        )}

        {/* Vehicles Tab */}
        {activeTab === "vehicles" && (
          <VehiclesTab
            vehicles={vehicles}
            showAdd={showAddVehicle}
            onAddToggle={setShowAddVehicle}
            onRefresh={() => {
              fetchVehicles();
              fetchCompanyData();
            }}
            onDelete={handleDeleteVehicle}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

// Profile Tab Component
function ProfileTab({
  company,
  showEdit,
  onEditToggle,
  onUpdate,
}: {
  company: Company;
  showEdit: boolean;
  onEditToggle: (show: boolean) => void;
  onUpdate: () => void;
}) {
  const [formData, setFormData] = useState({
    companyName: company.companyName,
    contactPerson: company.contactPerson,
    primaryPhone: company.primaryPhone,
    altPhone: company.altPhone || "",
    gstNumber: company.gstNumber || "",
    panNumber: company.panNumber || "",
    address: company.address || "",
    operatingStates: (company.operatingStates || []).join(", "),
    website: company.website || "",
  });
  
  const [documents, setDocuments] = useState({
    gstCertificate: company.documents?.gstCertificateUrl || '',
    panCard: company.documents?.panCardUrl || '',
    aadhaarCard: company.documents?.aadhaarCardUrl || '',
    registrationProof: company.documents?.registrationProofUrl || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("companyToken");
      
      // Prepare data with Google Drive links
      const payload: any = {
        ...formData,
        operatingStates: formData.operatingStates.split(",").map((s: string) => s.trim()).filter(Boolean),
        documents: {
          gstCertificateUrl: documents.gstCertificate,
          panCardUrl: documents.panCard,
          aadhaarCardUrl: documents.aadhaarCard,
          registrationProofUrl: documents.registrationProof,
        }
      };

      const response = await fetch("/api/company", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Profile updated successfully");
        onEditToggle(false);
        onUpdate();
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (!showEdit) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Company Profile</CardTitle>
          <Button onClick={() => onEditToggle(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Company Name</Label>
              <p className="font-semibold">{company.companyName}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Contact Person</Label>
              <p className="font-semibold">{company.contactPerson}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-semibold">{company.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Primary Phone</Label>
              <p className="font-semibold">{company.primaryPhone}</p>
            </div>
            {company.altPhone && (
              <div>
                <Label className="text-muted-foreground">Alternate Phone</Label>
                <p className="font-semibold">{company.altPhone}</p>
              </div>
            )}
            {company.gstNumber && (
              <div>
                <Label className="text-muted-foreground">GST Number</Label>
                <p className="font-semibold">{company.gstNumber}</p>
              </div>
            )}
            {company.panNumber && (
              <div>
                <Label className="text-muted-foreground">PAN Number</Label>
                <p className="font-semibold">{company.panNumber}</p>
              </div>
            )}
            {company.website && (
              <div>
                <Label className="text-muted-foreground">Website</Label>
                <p className="font-semibold">{company.website}</p>
              </div>
            )}
          </div>
          {company.address && (
            <div>
              <Label className="text-muted-foreground">Address</Label>
              <p className="font-semibold">{company.address}</p>
            </div>
          )}
          {company.operatingStates && company.operatingStates.length > 0 && (
            <div>
              <Label className="text-muted-foreground">Operating States</Label>
              <p className="font-semibold">{company.operatingStates.join(", ")}</p>
            </div>
          )}
          {company.documents && (
            <div>
              <Label className="text-muted-foreground">Company Documents</Label>
              <div className="grid md:grid-cols-2 gap-2 mt-2">
                {company.documents.gstCertificateUrl && (
                  <a
                    href={company.documents.gstCertificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    GST Certificate
                  </a>
                )}
                {company.documents.panCardUrl && (
                  <a
                    href={company.documents.panCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    PAN Card
                  </a>
                )}
                {company.documents.aadhaarCardUrl && (
                  <a
                    href={company.documents.aadhaarCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    Aadhaar Card
                  </a>
                )}
                {company.documents.registrationProofUrl && (
                  <a
                    href={company.documents.registrationProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    Registration Proof
                  </a>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Company Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) =>
                  setFormData({ ...formData, contactPerson: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="primaryPhone">Primary Phone *</Label>
              <Input
                id="primaryPhone"
                value={formData.primaryPhone}
                onChange={(e) =>
                  setFormData({ ...formData, primaryPhone: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="altPhone">Alternate Phone</Label>
              <Input
                id="altPhone"
                value={formData.altPhone}
                onChange={(e) =>
                  setFormData({ ...formData, altPhone: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                value={formData.gstNumber}
                onChange={(e) =>
                  setFormData({ ...formData, gstNumber: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input
                id="panNumber"
                value={formData.panNumber}
                onChange={(e) =>
                  setFormData({ ...formData, panNumber: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="operatingStates">Operating States (comma separated)</Label>
              <Input
                id="operatingStates"
                value={formData.operatingStates}
                onChange={(e) =>
                  setFormData({ ...formData, operatingStates: e.target.value })
                }
                placeholder="Maharashtra, Gujarat, Delhi"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
            />
          </div>
          
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-semibold">Company Documents (Google Drive Links)</h3>
            <p className="text-sm text-muted-foreground">Paste Google Drive shareable links for your documents</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gstCertificate">GST Certificate Link</Label>
                <Input
                  id="gstCertificate"
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={documents.gstCertificate || ''}
                  onChange={(e) =>
                    setDocuments({ ...documents, gstCertificate: e.target.value })
                  }
                  className="mt-1"
                />
                {company.documents?.gstCertificateUrl && (
                  <a
                    href={company.documents.gstCertificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View current link
                  </a>
                )}
              </div>
              <div>
                <Label htmlFor="panCard">PAN Card Link</Label>
                <Input
                  id="panCard"
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={documents.panCard || ''}
                  onChange={(e) =>
                    setDocuments({ ...documents, panCard: e.target.value })
                  }
                  className="mt-1"
                />
                {company.documents?.panCardUrl && (
                  <a
                    href={company.documents.panCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View current link
                  </a>
                )}
              </div>
              <div>
                <Label htmlFor="aadhaarCard">Aadhaar Card Link</Label>
                <Input
                  id="aadhaarCard"
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={documents.aadhaarCard || ''}
                  onChange={(e) =>
                    setDocuments({ ...documents, aadhaarCard: e.target.value })
                  }
                  className="mt-1"
                />
                {company.documents?.aadhaarCardUrl && (
                  <a
                    href={company.documents.aadhaarCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View current link
                  </a>
                )}
              </div>
              <div>
                <Label htmlFor="registrationProof">Registration Proof Link</Label>
                <Input
                  id="registrationProof"
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={documents.registrationProof || ''}
                  onChange={(e) =>
                    setDocuments({ ...documents, registrationProof: e.target.value })
                  }
                  className="mt-1"
                />
                {company.documents?.registrationProofUrl && (
                  <a
                    href={company.documents.registrationProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View current link
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit">Save Changes</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onEditToggle(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Vehicles Tab Component - continued in next part
function VehiclesTab({
  vehicles,
  showAdd,
  onAddToggle,
  onRefresh,
  onDelete,
}: {
  vehicles: Vehicle[];
  showAdd: boolean;
  onAddToggle: (show: boolean) => void;
  onRefresh: () => void;
  onDelete: (id: string) => void;
}) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  if (showAdd) {
    return (
      <AddVehicleForm
        onCancel={() => onAddToggle(false)}
        onSuccess={() => {
          onAddToggle(false);
          onRefresh();
        }}
      />
    );
  }

  if (selectedVehicle) {
    return (
      <VehicleDetailsModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        onDelete={() => {
          onDelete(selectedVehicle._id);
          setSelectedVehicle(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Vehicles</h2>
        <Button onClick={() => onAddToggle(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              You haven't added any vehicles yet.
            </p>
            <Button onClick={() => onAddToggle(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Vehicle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{vehicle.registrationNumber}</span>
                  <span className="text-sm text-muted-foreground">
                    {vehicle.vehicleId}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    <span className="font-semibold">{vehicle.vehicleType}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Capacity:</span>{" "}
                    <span className="font-semibold">{vehicle.capacity}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Year:</span>{" "}
                    <span className="font-semibold">{vehicle.modelYear}</span>
                  </p>
                  {vehicle.driverName && (
                    <p>
                      <span className="text-muted-foreground">Driver:</span>{" "}
                      <span className="font-semibold">{vehicle.driverName}</span>
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(vehicle._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Add Vehicle Form - continued in next file
function AddVehicleForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: "",
    vehicleType: "",
    capacity: "",
    modelYear: "",
    driverName: "",
    driverPhone: "",
    availability: "Available",
    route: "",
    permit: "",
    consentToContact: false,
    confirmAccuracy: false,
  });
  const [files, setFiles] = useState({
    rcDocument: '',
    insuranceDocument: '',
    pucDocument: '',
    fitnessDocument: '',
  });

  const vehicleTypes = [
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
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consentToContact || !formData.confirmAccuracy) {
      toast.error("Please accept both required checkboxes");
      return;
    }

    if (!files.rcDocument || !files.insuranceDocument) {
      toast.error("RC and Insurance document links are required");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("companyToken");
      
      // Prepare payload with Google Drive links
      const payload = {
        ...formData,
        documents: {
          rcUrl: files.rcDocument,
          insuranceUrl: files.insuranceDocument,
          pucUrl: files.pucDocument,
          fitnessUrl: files.fitnessDocument,
        }
      };

      const response = await fetch("/api/company/vehicles", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Vehicle added successfully!");
        onSuccess();
      } else {
        toast.error(result.message || "Failed to add vehicle");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="registrationNumber">Registration Number *</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) =>
                  setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })
                }
                required
                placeholder="MH-01-AB-1234"
              />
            </div>
            <div>
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <select
                id="vehicleType"
                value={formData.vehicleType}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleType: e.target.value })
                }
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select type</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                required
                placeholder="10 Ton / 19ft"
              />
            </div>
            <div>
              <Label htmlFor="modelYear">Model Year *</Label>
              <Input
                id="modelYear"
                type="number"
                value={formData.modelYear}
                onChange={(e) =>
                  setFormData({ ...formData, modelYear: e.target.value })
                }
                required
                min="1980"
                max={new Date().getFullYear() + 1}
              />
            </div>
            <div>
              <Label htmlFor="driverName">Driver Name (Optional)</Label>
              <Input
                id="driverName"
                value={formData.driverName}
                onChange={(e) =>
                  setFormData({ ...formData, driverName: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="driverPhone">Driver Phone (Optional)</Label>
              <Input
                id="driverPhone"
                type="tel"
                value={formData.driverPhone}
                onChange={(e) =>
                  setFormData({ ...formData, driverPhone: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="availability">Availability Status *</Label>
              <select
                id="availability"
                value={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <Label htmlFor="route">Route/Operating Area (Optional)</Label>
              <Input
                id="route"
                value={formData.route}
                onChange={(e) =>
                  setFormData({ ...formData, route: e.target.value })
                }
                placeholder="e.g., Mumbai to Delhi"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="permit">Permit Details (Optional)</Label>
              <Input
                id="permit"
                value={formData.permit}
                onChange={(e) =>
                  setFormData({ ...formData, permit: e.target.value })
                }
                placeholder="e.g., All India Permit, State Permit"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Vehicle Documents (Google Drive Links)</h3>
            <p className="text-sm text-muted-foreground">Paste Google Drive shareable links for vehicle documents</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rcDocument">RC Document Link *</Label>
                <Input
                  id="rcDocument"
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={files.rcDocument || ''}
                  onChange={(e) =>
                    setFiles({ ...files, rcDocument: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="insuranceDocument">Insurance Link *</Label>
                <Input
                  id="insuranceDocument"
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={files.insuranceDocument || ''}
                  onChange={(e) =>
                    setFiles({ ...files, insuranceDocument: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pucDocument">PUC Link (Optional)</Label>
                <Input
                  id="pucDocument"
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={files.pucDocument || ''}
                  onChange={(e) =>
                    setFiles({ ...files, pucDocument: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="fitnessDocument">Fitness Certificate Link (Optional)</Label>
                <Input
                  id="fitnessDocument"
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={files.fitnessDocument || ''}
                  onChange={(e) =>
                    setFiles({ ...files, fitnessDocument: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-blue-50 p-4 rounded-md">
            <h3 className="font-semibold">Required Confirmations</h3>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={formData.consentToContact}
                onChange={(e) =>
                  setFormData({ ...formData, consentToContact: e.target.checked })
                }
                className="mt-1"
                required
              />
              <span className="text-sm">
                I consent to be contacted by CargoMatters regarding transport opportunities.
              </span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={formData.confirmAccuracy}
                onChange={(e) =>
                  setFormData({ ...formData, confirmAccuracy: e.target.checked })
                }
                className="mt-1"
                required
              />
              <span className="text-sm">
                I confirm that all uploaded details and documents are correct.
              </span>
            </label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding Vehicle..." : "Add Vehicle"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Vehicle Details Modal
function VehicleDetailsModal({
  vehicle,
  onClose,
  onDelete,
}: {
  vehicle: Vehicle;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vehicle Details</CardTitle>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Vehicle ID</Label>
            <p className="font-semibold">{vehicle.vehicleId}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Registration Number</Label>
            <p className="font-semibold">{vehicle.registrationNumber}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Vehicle Type</Label>
            <p className="font-semibold">{vehicle.vehicleType}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Capacity</Label>
            <p className="font-semibold">{vehicle.capacity}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Model Year</Label>
            <p className="font-semibold">{vehicle.modelYear}</p>
          </div>
          {vehicle.driverName && (
            <div>
              <Label className="text-muted-foreground">Driver Name</Label>
              <p className="font-semibold">{vehicle.driverName}</p>
            </div>
          )}
          {vehicle.driverPhone && (
            <div>
              <Label className="text-muted-foreground">Driver Phone</Label>
              <p className="font-semibold">{vehicle.driverPhone}</p>
            </div>
          )}
          <div>
            <Label className="text-muted-foreground">Added On</Label>
            <p className="font-semibold">
              {new Date(vehicle.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Documents</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <a
              href={vehicle.documents.rcUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-md hover:bg-gray-50"
            >
              <FileText className="w-5 h-5" />
              <span>RC Document</span>
            </a>
            <a
              href={vehicle.documents.insuranceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-md hover:bg-gray-50"
            >
              <FileText className="w-5 h-5" />
              <span>Insurance Document</span>
            </a>
            {vehicle.documents.pucUrl && (
              <a
                href={vehicle.documents.pucUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border rounded-md hover:bg-gray-50"
              >
                <FileText className="w-5 h-5" />
                <span>PUC Document</span>
              </a>
            )}
            {vehicle.documents.fitnessUrl && (
              <a
                href={vehicle.documents.fitnessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border rounded-md hover:bg-gray-50"
              >
                <FileText className="w-5 h-5" />
                <span>Fitness Certificate</span>
              </a>
            )}
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Are you sure you want to delete this vehicle?")) {
                onDelete();
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Vehicle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
