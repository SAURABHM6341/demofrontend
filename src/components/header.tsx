"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "About Us",
    items: [
      { name: "Brand Story", href: "/aboutUs#brand-story" },
      { name: "Mission & Values", href: "/aboutUs#mission&values" },
      { name: "Core Values", href: "/aboutUs#core-values" },
    ],
  },
  {
    title: "Services",
    items: [
      {
        name: "Warehousing and Distribution",
        href: "/services#warehousing-distribution",
      },
      {
        name: "Full Truck Load Transportation",
        href: "/services#ftl-transportation",
      },
      { name: "Fulfillment Centres", href: "/services#fulfillment-centres" },
      { name: "Supply Chain", href: "/services#supply-chain" },
      { name: "E-commerce", href: "/services#e-commerce" },
      {
        name: "International Cross Border",
        href: "/services#international-cross-border",
      },
      { name: "Data Intelligence", href: "/services#data-intelligence" },
      { name: "Cold Chain Logistics", href: "/services#cold-chain-logistics" },
      {
        name: "Contract Logistics & Integrated 3PL / 4PL",
        href: "/services#contract-logistics",
      },
      {
        name: "Sustainability & Green Logistics",
        href: "/services#green-logistics",
      },
      {
        name: "Logistics Consulting & Supply Chain Design",
        href: "/services#logistics-consulting",
      },
    ],
  },
  {
    title: "Industries",
    items: [
      { name: "E-commerce & Retail", href: "/industries#e-commerce-retail" },
      { name: "Aviation", href: "/industries#aviation" },
      {
        name: "Furniture & Home Decor",
        href: "/industries#furniture-home-decor",
      },
      { name: "Oil & Gas / Energy", href: "/industries#oil-gas-energy" },
      { name: "Manufacturing", href: "/industries#manufacturing" },
      { name: "Automotive", href: "/industries#automotive" },
      { name: "Pharmaceuticals", href: "/industries#pharmaceuticals" },
      {
        name: "Cold Chain (Food & Healthcare)",
        href: "/industries#cold-chain-food-healthcare",
      },
      { name: "Apparel & Lifestyle", href: "/industries#apparel-lifestyle" },
      { name: "Chemicals", href: "/industries#chemicals" },
      { name: "Construction", href: "/industries#construction" },
      { name: "Electronics", href: "/industries#electronics" },
      { name: "Agriculture", href: "/industries#agriculture" },
      {
        name: "Startups",
        href: "/industries#startups",
      },
      {
        name: "D2C Brands",
        href: "/industries#d2c-brands",
      },
      { name: "3PL", href: "/industries#3pl" },
      { name: "4PL", href: "/industries#4pl" },
      { name: "5PL", href: "/industries#5pl" },
    ],
  },
  {
    title: "Partner",
    items: [
      { name: "Become Our Partner", href: "/partner#become-our-partner" },
      { name: "Who Can Partner With Us", href: "/partner#who-can-partner" },
      { name: "Why Partner With Us", href: "/partner#why-partner-with-us" },
      { name: "Become a Partner Now", href: "/partner#become-a-partner-now" },
    ],
  },
  {
    title: "Careers",
    items: [
      { name: "Careers at Cargo Matters", href: "/careers" },
      { name: "Current Openings", href: "/careers#current-openings" },
    ],
  },
  {
    title: "Contact Us",
    items: [
      { name: "Contact Details", href: "/contactUs#details" },
      { name: "Business Inquiries", href: "/contactUs#inquiries" },
    ],
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Set<string>>(
    new Set()
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"admin" | "company" | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const adminToken = localStorage.getItem("adminToken");
      const companyToken = localStorage.getItem("companyToken");
      
      if (adminToken) {
        setIsLoggedIn(true);
        setUserType("admin");
      } else if (companyToken) {
        setIsLoggedIn(true);
        setUserType("company");
      } else {
        setIsLoggedIn(false);
        setUserType(null);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const toggleMobileSubmenu = (title: string) => {
    const newExpanded = new Set(expandedMobileMenus);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedMobileMenus(newExpanded);
  };

  return (
    <header className="bg-primary border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 pt-2">
            <Image
              src="/images/cargo-matters-logo.png"
              alt="Cargo Matters"
              width={210}
              height={70}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 relative z-[100]">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="relative group z-[100]"
                onMouseEnter={() => setActiveDropdown(item.title)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Button
                  variant="ghost"
                  className="flex items-center text-background hover:text-primary transition-all duration-200 ease-in-out group"
                >
                  <span className="text-base">{item.title}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                      activeDropdown === item.title ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                <div
                  className={`absolute top-full left-0 w-60 bg-background border border-border rounded-md shadow-lg transition-all duration-300 ease-in-out transform origin-top z-[1000] ${
                    activeDropdown === item.title
                      ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem!.name}
                        href={subItem!.href}
                        className="block px-4 py-1 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors duration-150 ease-in-out"
                      >
                        {subItem!.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden xl:flex items-center space-x-4">
            <Button
              asChild
              className="bg-background text-black transition-all duration-200 ease-in-out hover:scale-105 hover:bg-background"
            >
              <Link href="/support">Support</Link>
            </Button>

            {isLoggedIn ? (
              <Button
                asChild
                className="bg-black text-white hover:bg-white hover:text-red-600 border border-black transition-colors duration-150"
              >
                <Link href={userType === "admin" ? "/admin/dashboard" : "/company/dashboard"}>
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                className="bg-black text-white hover:bg-white hover:text-red-600 border border-black transition-colors duration-150"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border animate-in slide-in-from-top-2 duration-300 ease-out max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <div key={item.title} className="space-y-1">
                  <button
                    onClick={() => toggleMobileSubmenu(item.title)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-background hover:bg-muted rounded-md transition-colors duration-150 ease-in-out"
                  >
                    <span>{item.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ease-in-out ${
                        expandedMobileMenus.has(item.title) ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-y-auto transition-all duration-300 ease-in-out ${
                      expandedMobileMenus.has(item.title)
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-4 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-3 py-2 text-sm text-background hover:text-primary hover:bg-muted rounded-md transition-colors duration-150 ease-in-out"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full bg-background text-black"
                  asChild
                >
                  <Link href="/support">Support</Link>
                </Button>
                {isLoggedIn ? (
                  <Button
                    variant="outline"
                    className="w-full bg-black text-white border-black hover:bg-white hover:text-red-600"
                    asChild
                  >
                    <Link href="/admin/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full bg-black text-white border-black hover:bg-white hover:text-red-600"
                    asChild
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
