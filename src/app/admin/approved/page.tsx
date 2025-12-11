"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Transporter {
  _id: string;
  companyName: string;
  ownerName: string;
  gstNumber: string;
  panNumber: string;
  contact: {
    mobile: string;
    email: string;
  };
  address: string;
  operatingStates: string[];
  fleet: {
    totalVehicles: number;
    vehicleTypes: string[];
    availability: string;
  };
  documents: {
    panCard: string;
    gstCertificate: string;
    rcProof: string;
    aadhaarCard?: string;
  };
  status: string;
  notes: string;
  createdAt: string;
}

export default function ApprovedPage() {
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedItem, setSelectedItem] = useState<Transporter | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  const limit = 20;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchTransporters();
  }, [page, dateFilter, customStartDate, customEndDate, router]);

  const fetchTransporters = async () => {
    setLoading(true);
    try {
      let url = `/api/transporters?status=Approved&page=${page}&limit=${limit}&q=${search}`;
      
      if (dateFilter === "today") {
        const today = new Date().toISOString().split("T")[0];
        url += `&startDate=${today}`;
      } else if (dateFilter === "week") {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        url += `&startDate=${weekAgo}`;
      } else if (dateFilter === "month") {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        url += `&startDate=${monthAgo}`;
      } else if (dateFilter === "custom" && customStartDate) {
        url += `&startDate=${customStartDate}`;
        if (customEndDate) {
          url += `&endDate=${customEndDate}`;
        }
      }
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTransporters(data.items);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    setPage(1);
    fetchTransporters();
  };

  const handleViewDetails = (item: Transporter) => {
    setSelectedItem(item);
    setNotes(item.notes || "");
    setShowModal(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/transporters/${selectedItem._id}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Notes saved!");
        setSelectedItem({ ...selectedItem, notes });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving notes");
    }
    setActionLoading(false);
  };

  const handleExport = async () => {
    window.open(`/api/transporters/export?status=Approved`, "_blank");
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Approved Companies</h1>
            <p className="text-muted-foreground">Total: {total}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
              Dashboard
            </Button>
            <Button onClick={handleExport} variant="outline">
              Export CSV
            </Button>
          </div>
        </div>

        {/* Date Filter */}
        <div className="mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <Label>Date Range</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={dateFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateFilter("all")}
              >
                All Time
              </Button>
              <Button
                variant={dateFilter === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateFilter("today")}
              >
                Today
              </Button>
              <Button
                variant={dateFilter === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateFilter("week")}
              >
                Past Week
              </Button>
              <Button
                variant={dateFilter === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateFilter("month")}
              >
                Past Month
              </Button>
              <Button
                variant={dateFilter === "custom" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateFilter("custom")}
              >
                Custom Range
              </Button>
            </div>
          </div>
          
          {dateFilter === "custom" && (
            <>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="mt-2"
                />
              </div>
            </>
          )}
        </div>

        {/* Search */}
        <div className="mb-6 flex gap-2">
          <Input
            placeholder="Search by company, owner, mobile, GST..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="max-w-md"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicles</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transporters.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{t.companyName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{t.ownerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{t.gstNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{t.contact.mobile}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{t.fleet.totalVehicles || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button size="sm" onClick={() => handleViewDetails(t)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Details Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Transporter Details</h2>
                <button onClick={() => setShowModal(false)} className="text-2xl">&times;</button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Company Information</h3>
                  <p><strong>Company:</strong> {selectedItem.companyName}</p>
                  <p><strong>Owner:</strong> {selectedItem.ownerName}</p>
                  <p><strong>GST:</strong> {selectedItem.gstNumber}</p>
                  <p><strong>PAN:</strong> {selectedItem.panNumber}</p>
                  <p><strong>Address:</strong> {selectedItem.address}</p>
                  <p><strong>Operating States:</strong> {selectedItem.operatingStates.join(", ")}</p>
                  <p className="mt-2 text-green-600 font-semibold">✅ Status: Approved</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <p><strong>Mobile:</strong> {selectedItem.contact.mobile}</p>
                  <p><strong>Email:</strong> {selectedItem.contact.email}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Fleet Details</h3>
                  <p><strong>Total Vehicles:</strong> {selectedItem.fleet.totalVehicles}</p>
                  <p><strong>Vehicle Types:</strong> {selectedItem.fleet.vehicleTypes.join(", ")}</p>
                  <p><strong>Availability:</strong> {selectedItem.fleet.availability}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Documents</h3>
                  {selectedItem.documents.panCard && <a href={selectedItem.documents.panCard} target="_blank" className="block text-blue-600 hover:underline">PAN Card</a>}
                  {selectedItem.documents.gstCertificate && <a href={selectedItem.documents.gstCertificate} target="_blank" className="block text-blue-600 hover:underline">GST Certificate</a>}
                  {selectedItem.documents.rcProof && <a href={selectedItem.documents.rcProof} target="_blank" className="block text-blue-600 hover:underline">RC Proof</a>}
                  {selectedItem.documents.aadhaarCard && <a href={selectedItem.documents.aadhaarCard} target="_blank" className="block text-blue-600 hover:underline">Aadhaar Card</a>}
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="notes">Admin Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
                <Button onClick={handleSaveNotes} disabled={actionLoading} className="mt-2">
                  Save Notes
                </Button>
              </div>

              <div className="mt-6 flex gap-4">
                <Button onClick={() => setShowModal(false)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
