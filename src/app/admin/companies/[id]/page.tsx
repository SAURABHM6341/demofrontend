"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Save } from "lucide-react";
import { toast } from "sonner";

interface CompanyData {
  _id: string;
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
  vehicles: Array<{
    _id: string;
    vehicleId: string;
    registrationNumber: string;
    vehicleType: string;
    capacity: string;
    modelYear: number;
    driverName?: string;
    driverPhone?: string;
    availability?: string;
    route?: string;
    permit?: string;
    documents: {
      rcUrl: string;
      insuranceUrl: string;
      pucUrl?: string;
      fitnessUrl?: string;
    };
    createdAt: string;
  }>;
  notes: Array<{
    _id: string;
    adminId: string;
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  useEffect(() => {
    fetchCompanyDetails();
  }, [params.id]);

  const fetchCompanyDetails = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/admin/companies/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch company");

      const result = await response.json();
      setCompany(result.data);
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error("Failed to load company details");
      router.push("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      toast.error("Please enter a note");
      return;
    }

    setSavingNote(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/companies/${params.id}/notes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: noteText }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Note added successfully");
        setNoteText("");
        fetchCompanyDetails();
      } else {
        toast.error(result.message || "Failed to add note");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    } finally {
      setSavingNote(false);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button onClick={() => router.push("/admin/dashboard")} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">{company.companyName}</h1>
          <p className="text-muted-foreground">
            Transporter ID: {company.transporterId} • Registered{" "}
            {new Date(company.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
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
                      <p className="font-semibold">
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {company.website}
                        </a>
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Vehicles Count</Label>
                    <p className="font-semibold">{company.vehiclesCount}</p>
                  </div>
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
              </CardContent>
            </Card>

            {/* Company Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Company Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* GST Certificate */}
                  {company.documents?.gstCertificateUrl ? (
                    <a
                      href={company.documents.gstCertificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">GST Certificate</p>
                        <p className="text-xs text-muted-foreground">Click to view</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-semibold text-sm text-gray-600">GST Certificate</p>
                        <p className="text-xs text-red-500">Not Uploaded</p>
                      </div>
                    </div>
                  )}

                  {/* PAN Card */}
                  {company.documents?.panCardUrl ? (
                    <a
                      href={company.documents.panCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">PAN Card</p>
                        <p className="text-xs text-muted-foreground">Click to view</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-semibold text-sm text-gray-600">PAN Card</p>
                        <p className="text-xs text-red-500">Not Uploaded</p>
                      </div>
                    </div>
                  )}

                  {/* Aadhaar Card */}
                  {company.documents?.aadhaarCardUrl ? (
                    <a
                      href={company.documents.aadhaarCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">Aadhaar Card</p>
                        <p className="text-xs text-muted-foreground">Click to view</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-semibold text-sm text-gray-600">Aadhaar Card</p>
                        <p className="text-xs text-red-500">Not Uploaded</p>
                      </div>
                    </div>
                  )}

                  {/* Registration Proof */}
                  {company.documents?.registrationProofUrl ? (
                    <a
                      href={company.documents.registrationProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">Registration Proof</p>
                        <p className="text-xs text-muted-foreground">Click to view</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-semibold text-sm text-gray-600">Registration Proof</p>
                        <p className="text-xs text-red-500">Not Uploaded</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vehicles */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicles ({company.vehicles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {company.vehicles.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No vehicles added yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {company.vehicles.map((vehicle) => (
                      <div
                        key={vehicle._id}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedVehicle(vehicle)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg">
                              {vehicle.registrationNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {vehicle.vehicleId} • {vehicle.vehicleType}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Capacity:</span>{" "}
                            {vehicle.capacity}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Year:</span>{" "}
                            {vehicle.modelYear}
                          </div>
                          {vehicle.availability && (
                            <div>
                              <span className="text-muted-foreground">Status:</span>{" "}
                              <span className={`font-semibold ${
                                vehicle.availability === "Available" ? "text-green-600" :
                                vehicle.availability === "On Trip" ? "text-blue-600" :
                                "text-yellow-600"
                              }`}>
                                {vehicle.availability}
                              </span>
                            </div>
                          )}
                          {vehicle.driverName && (
                            <div>
                              <span className="text-muted-foreground">Driver:</span>{" "}
                              {vehicle.driverName}
                            </div>
                          )}
                          {vehicle.route && (
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Route:</span>{" "}
                              {vehicle.route}
                            </div>
                          )}
                          {vehicle.permit && (
                            <div className="col-span-3">
                              <span className="text-muted-foreground">Permit:</span>{" "}
                              {vehicle.permit}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notes Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Admin Note</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter internal note..."
                  rows={4}
                  className="mb-3"
                />
                <Button onClick={handleAddNote} disabled={savingNote} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {savingNote ? "Saving..." : "Save Note"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes History</CardTitle>
              </CardHeader>
              <CardContent>
                {company.notes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No notes yet</p>
                ) : (
                  <div className="space-y-3">
                    {company.notes.map((note) => (
                      <div key={note._id} className="border-l-2 border-primary pl-3 py-2">
                        <p className="text-sm">{note.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vehicle Detail Modal */}
        {selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Vehicle Details</CardTitle>
                <Button onClick={() => setSelectedVehicle(null)} variant="outline">
                  Close
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Vehicle ID</Label>
                    <p className="font-semibold">{selectedVehicle.vehicleId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Registration Number</Label>
                    <p className="font-semibold">{selectedVehicle.registrationNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Vehicle Type</Label>
                    <p className="font-semibold">{selectedVehicle.vehicleType}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Capacity</Label>
                    <p className="font-semibold">{selectedVehicle.capacity}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Model Year</Label>
                    <p className="font-semibold">{selectedVehicle.modelYear}</p>
                  </div>
                  {selectedVehicle.driverName && (
                    <>
                      <div>
                        <Label className="text-muted-foreground">Driver Name</Label>
                        <p className="font-semibold">{selectedVehicle.driverName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Driver Phone</Label>
                        <p className="font-semibold">{selectedVehicle.driverPhone}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Added On</Label>
                    <p className="font-semibold">
                      {new Date(selectedVehicle.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Documents</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <a
                      href={selectedVehicle.documents.rcUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-md hover:bg-gray-50"
                    >
                      <FileText className="w-5 h-5" />
                      <span>RC Document</span>
                    </a>
                    <a
                      href={selectedVehicle.documents.insuranceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border rounded-md hover:bg-gray-50"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Insurance Document</span>
                    </a>
                    {selectedVehicle.documents.pucUrl && (
                      <a
                        href={selectedVehicle.documents.pucUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 border rounded-md hover:bg-gray-50"
                      >
                        <FileText className="w-5 h-5" />
                        <span>PUC Document</span>
                      </a>
                    )}
                    {selectedVehicle.documents.fitnessUrl && (
                      <a
                        href={selectedVehicle.documents.fitnessUrl}
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
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
