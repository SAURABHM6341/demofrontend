"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login to /api/admin/login...");
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", res.status);
      const result = await res.json();
      console.log("Login result:", result);

      if (result.success && result.token) {
        // Clear all previous tokens (logout from other devices)
        localStorage.clear();
        
        // Store token in localStorage
        localStorage.setItem("adminToken", result.token);
        // Trigger storage event for header update
        window.dispatchEvent(new Event("storage"));
        toast.success("Login successful!");
        // Redirect to admin dashboard
        router.push("/admin/dashboard");
      } else {
        setError(result.message || "Invalid credentials");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(`Login failed: ${err.message || "Please try again"}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-4 text-center">Admin Login</h1>
        <p className="text-muted-foreground mb-6 text-center">
          Sign in to access the admin dashboard
        </p>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cargomatter.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-2"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white hover:bg-white hover:text-red-600"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Default credentials: admin@cargomatter.com / admin@123
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
