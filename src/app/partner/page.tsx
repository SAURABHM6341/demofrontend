"use client";

import type React from "react";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Truck,
  Package,
  Warehouse,
  FileText,
  ShoppingCart,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const benefits = [
  {
    text: "Transparent, on-time payments",
    icon: "/images/money-icon.png",
  },
  {
    text: "24/7 support & real-time tracking",
    icon: "/images/direction-icon.png",
  },
  {
    text: "Access to tech-enabled logistics tools",
    icon: "/images/computer-icon.png",
  },
  {
    text: "Flexible contract options",
    icon: "/images/contract-icon.png",
  },
  {
    text: "Long-term business relationships",
    icon: "/images/plant-icon.png",
  },
  {
    text: "Regional & international reach",
    icon: "/images/earth-icon.png",
  },
];

const serviceTypes = [
  "Transport & Fleet Services",
  "Freight Forwarding",
  "Warehousing",
  "Customs Brokerage",
  "E-commerce Logistics",
  "Last-Mile Delivery",
  "Cold Chain Logistics",
  "Express Delivery",
];

const partnerTypes = [
  {
    icon: Truck,
    title: "Transport & Fleet Owners",
    description: "Local / Long-haul",
    image: "/images/selected.jpeg",
  },
  {
    icon: Package,
    title: "Freight Forwarders",
    description: "International & Domestic",
    image: "/images/freight forwader.jpeg",
  },
  {
    icon: Warehouse,
    title: "Warehouse Operators",
    description: "Storage & Distribution",
    image: "/images/selected (1).jpeg",
  },
  {
    icon: FileText,
    title: "Customs Brokers",
    description: "Import & Export",
    image: "/images/custom broker 2.png",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Logistics Providers",
    description: "Fulfillment Services",
    image: "/images/selected (2).jpeg",
  },
  {
    icon: MapPin,
    title: "Last-Mile Delivery Agents",
    description: "Final Delivery Solutions",
    image: "/images/delivery.png",
  },
];

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    city: "",
    phone: "",
    email: "",
    remarks: "",
    services: [] as string[],
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isPartnerSectionVisible, setIsPartnerSectionVisible] = useState(false);
  const partnerSectionRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = (service: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      services: checked
        ? [...prev.services, service]
        : prev.services.filter((s) => s !== service),
    }));
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 320;

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }

    setTimeout(() => {
      updateArrowVisibility();
    }, 500);
  };

  const updateArrowVisibility = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    updateArrowVisibility();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateArrowVisibility);
      return () =>
        container.removeEventListener("scroll", updateArrowVisibility);
    }
  }, []);

  // Intersection Observer for Partner Section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPartnerSectionVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (partnerSectionRef.current) {
      observer.observe(partnerSectionRef.current);
    }

    return () => {
      if (partnerSectionRef.current) {
        observer.unobserve(partnerSectionRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => data.append(`${key}[]`, v));
        } else {
          data.append(key, value as string);
        }
      });
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        alert("✅ Partnership form submitted successfully!");
        setFormData({
          name: "",
          company: "",
          city: "",
          phone: "",
          email: "",
          remarks: "",
          services: [],
        });
      } else {
        alert("❌ Failed to send. Try again later.");
      }
    } catch (err) {
      console.error("Error submitting partner form:", err);
      alert("Unexpected error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Become Our Partner */}
      <section className="relative h-[600px] w-full overflow-hidden flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/selection 2 (2).png')`,
          }}
        />

        {/* Dark Overlay - Improves Text Readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content - Relative to overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-xl">
            Become Our Partner
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Comprehensive logistics solutions tailored to meet your business
            needs with reliability, speed, and exceptional service quality
            across every touchpoint of the supply chain.
          </p>
        </div>
      </section>

      {/* Partner Programme Section - Modern Layout with Illustration */}

      <section
        ref={partnerSectionRef}
        className="py-20 bg-white relative overflow-hidden"
      >
        {/* Heading with Red Accent */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold">
            <span className="text-gray-900">Partner</span>
            <br />
            <span className="text-red-600">Programme</span>
          </h2>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="items-center">
            {/* Left Side - Dark Card with Rounded Edge and Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={
                isPartnerSectionVisible
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -50 }
              }
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div
                className="bg-gray-800 text-white rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl"
                style={{
                  borderRadius: "40px 40px 40px 40px",
                }}
              >
                {/* Content */}
                <div className="space-y-6 relative z-10">
                  {/* Paragraph 1 - Slides from left */}
                  <motion.p
                    initial={{ opacity: 0, x: -50 }}
                    animate={
                      isPartnerSectionVisible
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -50 }
                    }
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-base md:text-lg text-gray-100 leading-relaxed"
                  >
                    We are building a strong, trusted network of logistics
                    partners across the globe. Whether you are a freight
                    forwarder, transporter, warehouse owner, or customs broker —
                    Cargo Matters is ready to collaborate and grow with you.
                  </motion.p>

                  {/* Paragraph 2 - Slides from left with delay */}
                  <motion.p
                    initial={{ opacity: 0, x: -50 }}
                    animate={
                      isPartnerSectionVisible
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -50 }
                    }
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-base md:text-lg text-gray-100 leading-relaxed"
                  >
                    Join us to benefit from high-volume business, tech-enabled
                    operations, and long-term partnerships built on trust.
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who Can Partner With Us Section - Horizontal Scrolling */}
      <section
        id="who-can-partner"
        className="py-20 bg-gradient-to-br from-primary/5 to-primary/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Who Can Partner With Us?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We welcome diverse logistics partners to join our growing network
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-end gap-2 mb-6">
            <button
              onClick={() => scroll("left")}
              className={`p-2 rounded-full border transition-all ${
                showLeftArrow
                  ? "border-primary text-primary hover:bg-primary/10"
                  : "border-gray-300 text-gray-300 cursor-not-allowed"
              }`}
              disabled={!showLeftArrow}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className={`p-2 rounded-full border transition-all ${
                showRightArrow
                  ? "border-primary text-primary hover:bg-primary/10"
                  : "border-gray-300 text-gray-300 cursor-not-allowed"
              }`}
              disabled={!showRightArrow}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Horizontal Scrolling Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth hide-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {partnerTypes.map((partner, index) => {
              const isTransport = partner.title === "Transport & Fleet Owners";
              
              return (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-80 group cursor-pointer"
                  onClick={isTransport ? () => window.location.href = '/partner/transport' : undefined}
                >
                  <div className="h-96 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    <div
                      className="relative w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: partner.image
                          ? `url('${partner.image}')`
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      {/* Overlay - appears on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Blur effect on image - appears on hover */}
                      <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-300" />

                      {/* Text Content - Bottom position by default, centered on hover */}
                      <div className="absolute inset-0 flex flex-col justify-end group-hover:justify-center items-start group-hover:items-center p-6 group-hover:p-8 transition-all duration-300">
                        <h3 className="text-black group-hover:text-white text-xl font-semibold mb-1 text-start group-hover:text-center transition-all duration-300">
                          {partner.title}
                        </h3>
                        <p className="text-black/70 group-hover:text-white/80 text-sm text-start group-hover:text-center transition-all duration-300">
                          {partner.description}
                        </p>

                        {/* CTA button for transport card */}
                        {isTransport && (
                          <div className="mt-4 w-full flex justify-center" onClick={(e) => e.stopPropagation()}>
                            <Link href="/partner/transport" className="inline-block">
                              <Button className="bg-black text-white hover:bg-white hover:text-red-600 border border-black">
                                Register Transport Company
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hide scrollbar styling */}
        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </section>

      {/* Why Partner With Us Section */}
      <section id="why-partner-with-us" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join a partnership built on trust, technology, and mutual growth
            </p>
          </div>

          {/* Grid with Black to Red Gradient Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="relative p-6 rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 transform hover:scale-105"
              >
                {/* Black Gradient Background (Default) */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black group-hover:from-red-600 group-hover:to-red-800 transition-all duration-300" />

                {/* Content - Relative to background */}
                <div className="relative z-10">
                  {/* Icon Container with Image */}
                  <div className="mb-4 h-16 w-16 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 group-hover:from-red-500 group-hover:to-red-700 flex items-center justify-center overflow-hidden transition-all duration-300">
                    <img
                      src={benefit.icon}
                      alt={benefit.text}
                      className="h-10 w-10 object-contain"
                    />
                  </div>

                  {/* Text Content */}
                  <p className="text-lg font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">
                    {benefit.text}
                  </p>
                </div>

                {/* Hover Shadow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white rounded-lg transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section - Join Now */}
      <section
        id="become-a-partner-now"
        className="py-20 bg-gradient-to-br from-primary/5 to-primary/10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Become a Partner Now
            </h2>
            <p className="text-xl text-muted-foreground mb-2">Ready to Join?</p>
            <p className="text-muted-foreground">
              Email us at:{" "}
              <a
                href="mailto:cargomattersindia@gmail.com"
                className="text-primary hover:underline"
              >
                cargomattersindia@gmail.com
              </a>
            </p>
          </div>

          <Card className="border-primary/20">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Company */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">
                      Company <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="company"
                      placeholder="Company name"
                      required
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* City and Phone */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="Your city"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {/* Type of Service - Checkboxes */}
                <div className="space-y-3">
                  <Label>
                    Type of Service <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    {serviceTypes.map((service) => (
                      <div
                        key={service}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          className="bg-gradient-to-br from-primary/5 to-primary/10"
                          id={service}
                          checked={formData.services.includes(service)}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(service, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={service}
                          className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Tell us more about your business and partnership interests..."
                    rows={4}
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full">
                  Submit Partnership Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
