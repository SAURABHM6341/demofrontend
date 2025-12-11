"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, LogIn, Truck, Package, FileText, Shield } from "lucide-react";

export default function TransportFormPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Transport & Fleet Owner Portal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join CargoMatters as a transport partner. Register your company and manage your fleet with ease.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Truck className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Manage Your Fleet</h3>
                <p className="text-sm text-muted-foreground">
                  Add and manage vehicles with document uploads</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Package className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Get Business Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with clients
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Secure & Verified</h3>
                <p className="text-sm text-muted-foreground">
                  Your documents are securely stored and verified by our team
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login/Signup Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* New User - Sign Up */}
          <Card className="border-2 border-primary">
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-3">
                <UserPlus className="w-16 h-16 text-primary" />
              </div>
              <CardTitle className="text-2xl">New User?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-center">
                <p className="text-muted-foreground">
                  Create a new account to start managing your transport business
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Register your transport company with basic details</span>
                </li>
                <li className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Add vehicles one by one with all required documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Get instant access to your personalized dashboard</span>
                </li>
              </ul>
              <Link href="/company/register" className="block">
                <Button className="w-full" size="lg">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create New Account
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Existing User - Login */}
          <Card className="border-2">
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-3">
                <LogIn className="w-16 h-16 text-primary" />
              </div>
              <CardTitle className="text-2xl">Already Registered?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-center">
                <p className="text-muted-foreground">
                  Login to access your dashboard and manage your fleet
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>View and update your company profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <Truck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Manage your vehicles and update documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Track your business opportunities and requests</span>
                </li>
              </ul>
              <Link href="/company/login" className="block">
                <Button className="w-full" size="lg" variant="outline">
                  <LogIn className="w-5 h-5 mr-2" />
                  Login to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-12 bg-primary/5">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Sign Up</h3>
                <p className="text-sm text-muted-foreground">
                  Create your account with company details and get a unique ID
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Add Vehicles</h3>
                <p className="text-sm text-muted-foreground">
                  Upload RC, Insurance, and other documents for each vehicle
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Start Getting Business</h3>
                <p className="text-sm text-muted-foreground">
                  Receive notifications and manage your transport operations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
