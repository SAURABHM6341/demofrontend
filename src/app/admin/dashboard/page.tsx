"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Search, Download, Eye, Building2, Truck, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Stats {
  totalCompanies: number;
  companiesWithNoVehicles: number;
  totalVehicles: number;
  totalVisitors: number;
  step1Completed: number;
  step2Completed: number;
  step3Completed: number;
  monthlyRegistrations: Array<{ year: number; month: number; count: number }>;
  vehicleTypeDistribution: Array<{ type: string; count: number }>;
  recentRegistrations: Array<any>;
}

interface Company {
  _id: string;
  transporterId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  primaryPhone: string;
  gstNumber?: string;
  vehiclesCount: number;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<"stats" | "companies">("stats");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      // Test if token is valid before fetching data
      verifyToken(token);
    }
  }, [router]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        // Token is invalid, clear it and redirect to login
        localStorage.removeItem("adminToken");
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      // Token is valid, fetch data
      fetchStats();
      fetchCompanies();
    } catch (error) {
      console.error("Token verification error:", error);
      localStorage.removeItem("adminToken");
      router.push("/login");
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch stats");
      }

      const result = await response.json();
      setStats(result.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load statistics");
    }
  };

  const fetchCompanies = async (page = 1, search = "") => {
    try {
      const token = localStorage.getItem("adminToken");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (search) params.append("search", search);

      const response = await fetch(`/api/admin/companies?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch companies");
      }

      const result = await response.json();
      setCompanies(result.data.companies);
      setTotalPages(result.data.pagination.totalPages);
      setCurrentPage(result.data.pagination.page);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchCompanies(1, searchQuery);
  };

  const handleExport = async (type: "companies" | "vehicles") => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/export?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}_${Date.now()}.csv`;
      a.click();
      toast.success(`${type} exported successfully`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const viewCompanyDetails = (companyId: string) => {
    router.push(`/admin/companies/${companyId}`);
  };

  if (loading || !isAuthenticated || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Transport Company Management System</p>
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
              activeTab === "stats"
                ? "border-b-2 border-primary font-semibold"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            Statistics
          </button>
          <button
            className={`pb-2 px-4 ${
              activeTab === "companies"
                ? "border-b-2 border-primary font-semibold"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("companies")}
          >
            Companies ({stats.totalCompanies})
          </button>
        </div>

        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered transport companies</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                  <Truck className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVehicles}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active fleet vehicles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">No Vehicles</CardTitle>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.companiesWithNoVehicles}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Companies without vehicles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVisitors}</div>
                  <p className="text-xs text-muted-foreground mt-1">Page visits</p>
                </CardContent>
              </Card>
            </div>

            {/* Step Completion Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Registration Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Step 1: Profile Created</p>
                      <p className="text-sm text-muted-foreground">Basic company information added</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{stats.step1Completed}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Step 2: Documents Uploaded</p>
                      <p className="text-sm text-muted-foreground">GST/PAN/Aadhaar documents added</p>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{stats.step2Completed}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Step 3: Vehicles Added</p>
                      <p className="text-sm text-muted-foreground">At least one vehicle registered</p>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{stats.step3Completed}</div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Completion Rate</p>
                      <p className="text-lg font-bold">
                        {stats.totalCompanies > 0 
                          ? Math.round((stats.step3Completed / stats.totalCompanies) * 100) 
                          : 0}%
                      </p>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                      <div
                        className="h-full bg-green-600 rounded-full"
                        style={{
                          width: `${stats.totalCompanies > 0 
                            ? (stats.step3Completed / stats.totalCompanies) * 100 
                            : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.vehicleTypeDistribution.map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${(item.count / stats.totalVehicles) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Registrations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentRegistrations.map((company) => (
                    <div
                      key={company._id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{company.companyName}</p>
                        <p className="text-sm text-muted-foreground">
                          {company.contactPerson} • {company.transporterId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{company.vehiclesCount} vehicles</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(company.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Export Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button onClick={() => handleExport("companies")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Companies CSV
                </Button>
                <Button onClick={() => handleExport("vehicles")} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Vehicles CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Companies Tab */}
        {activeTab === "companies" && (
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by company, contact, GST, phone, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Companies List */}
            <Card>
              <CardHeader>
                <CardTitle>Registered Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">ID</th>
                        <th className="text-left p-3">Company</th>
                        <th className="text-left p-3">Contact</th>
                        <th className="text-left p-3">GST</th>
                        <th className="text-left p-3">Phone</th>
                        <th className="text-left p-3">Vehicles</th>
                        <th className="text-left p-3">Registered</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map((company) => (
                        <tr key={company._id} className="border-b hover:bg-gray-50">
                          <td className="p-3 text-sm">{company.transporterId}</td>
                          <td className="p-3">
                            <p className="font-semibold">{company.companyName}</p>
                            <p className="text-sm text-muted-foreground">{company.email}</p>
                          </td>
                          <td className="p-3">{company.contactPerson}</td>
                          <td className="p-3 text-sm">{company.gstNumber || "-"}</td>
                          <td className="p-3 text-sm">{company.primaryPhone}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                company.vehiclesCount === 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {company.vehiclesCount}
                            </span>
                          </td>
                          <td className="p-3 text-sm">
                            {new Date(company.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewCompanyDetails(company._id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => fetchCompanies(currentPage - 1, searchQuery)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => fetchCompanies(currentPage + 1, searchQuery)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
