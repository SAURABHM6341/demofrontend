"use client";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import ClientsMarquee from "@/components/ClientsMarquee";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Footer from "@/components/footer";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import  Image  from "next/image";

const features = [
  {
    // icon: Truck,
    title: "Fast Delivery",
    description:
      "Express delivery options with same-day and next-day shipping available nationwide.",
    image: "/images/fastdelivery.jpg",
  },
  {
    // icon: Globe,
    title: "Global Reach",
    description:
      "International shipping to over 200 countries with reliable tracking and customs support.",
    image: "/images/global-reach.png",
  },
  {
    // icon: Shield,
    title: "Secure Handling",
    description:
      "Advanced security measures and insurance options to protect your valuable shipments.",
    image: "/images/secure.png",
  },
  {
    // icon: Clock,
    title: "24/7 Support",
    description:
      "Round-the-clock customer support and real-time tracking updates for peace of mind.",
    image: "/images/version-6.jpg",
  },
];

const stats = [
  { number: "2000+", label: "Trucks on roads" },
  { number: "120", label: "Countries Served" },
  { number: "5000+", label: "Tons of freight volume" },
  { number: "200+", label: "Customers and Clients" },
];
const services = [
  {
    id: "full-truck-load-transportation",
    title: "Full Truck Load Transportation",
    image: "/images/truck.jpg",
  },
  {
    id: "e-commerce",
    title: "E-commerce",
    image: "/images/e-com.jpg",
  },
  {
    id: "international-cross-border",
    title: "International Cross Border",
    image: "/images/international.jpg",
  },
  {
    id: "data-intelligence",
    title: "Data Intelligence",
    image: "/images/data.jpg",
  },
  {
    id: "warehousing-distribution",
    title: "Warehousing and Distribution",
    image: "/images/warehouse.jpg",
  }
]

function ServicesSection() {

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });
  const cardVariants = {
    left: { hidden: { x: -200, opacity: 0 }, visible: { x: 0, opacity: 1 } },
    center: { hidden: { y: 200, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    right: { hidden: { x: 200, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  };
  return (

    <section ref={sectionRef} className="py-20 m-2 rounded-3xl bg-[#d6d8f1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-5">
            Our Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-1 relative overflow-visible">
            {services.map((service, index) => {
              const heights = ["h-[300px]", "h-[320px]", "h-[340px]", "h-[320px]", "h-[300px]"];
              const shifts = ["translate-y-6", "translate-y-4", "translate-y-2", "translate-y-4", "translate-y-6"];
              const direction = index < 2 ? "left" : index === 2 ? "center" : "right";
              return (
                <Link href={`/services#${service.id}`} key={index} className="block">
                  <motion.div
                    variants={cardVariants[direction]}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    transition={{ duration: .9, delay: index * 0.5 }}
                  >
                    <Card
                      key={index}
                      className={`
                    relative rounded-2xl overflow-hidden shadow-lg group border-0 bg-transparent 
                    flex flex-col justify-end
                    transition-transform duration-300
                    h-[260px] w-full mt-10
                    ${heights[index]}
                    ${shifts[index]}
                    hover:scale-[1.2]
                    hover:z-20
                    hover:shadow-2xl
                  `}
                      style={{
                        backgroundImage: `url(${service.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"></div>
                      <div className="absolute bottom-4 px-5 text-black">
                        <CardHeader >
                          <CardTitle className=" px-6 py-2 text-white text-lg font-semibold 
                           bg-black/10 backdrop-blur-md 
                           rounded-xl text-center w-fit shadow-md">{service.title}</CardTitle>
                        </CardHeader>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <div className="mt-20">
            <Button size="lg" asChild className="rounded-2xl px-8 py-6 text-base font-medium">
              <Link href="/services">View all services</Link>
            </Button>
          </div>
        </div>
      </div>

    </section >
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-primary/10 py-20 lg:py-32"
       style={{ backgroundImage: "url(/images/hero.png)" }}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Your Cargo <span className="text-primary">Matters</span> to Us
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional logistics solutions with real-time tracking, global
              reach, and unmatched reliability for businesses of all sizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="rounded-xl hover:bg-white hover:text-red-600" size="lg" asChild>
                <Link href="/contactUs#contact-form">Get in Touch</Link>
              </Button>
              <Button className="rounded-xl hover:bg-red-500 hover:text-white" size="lg" variant="outline" asChild>
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>

          {/* Tracking Form */}
          {/*           <div className="mt-16">
            <TrackingForm />
          </div> */}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center flex-col">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div
                  className="text-muted-foreground font-medium
                text-lg"
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      < ServicesSection />
      {/* Features Section */}
      <section className="py-20 pb-60 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose Cargo Matters?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive logistics solutions with cutting-edge
              technology and exceptional service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="relative border-0 group h-80 rounded-xl  shadow-2xl cursor-pointer transform transition duration-500 hover:scale-100"
                style={{
                  backgroundImage: `url(${feature.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <CardHeader>
                  <div className="absolute inset-0 z-10 flex flex-col justify-end pb-10 text-center 
                      transition-all duration-500 ">
                    <h3 className="text-white text-lg font-semibold drop-shadow-lg">
                      {feature.title}
                    </h3>
                  </div>
                  <div className="absolute left-0 w-full h-40 rounded-xl shadow-2xl bg-white p-6 top-80 translate-y-0       
                   opacity-0 z-10 group-hover:translate-y-10 group-hover:opacity-100 transition-all duration-500 ease-out">
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-sm opacity-90">{feature.description}</p>

                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      {/* <section className="py-20"> ... </section> */}

      {/* Clients Logo Marquee */}
      <ClientsMarquee />

      {/* CTA Section */}
     < section className="py-0 px-0  bg-primary rounded-3xl m-2 text-primary-foreground" >
        <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-0">
            <div className="m-0 md:w-1/2 flex justify-center md:justify-start">
              <Image
                src="/images/call.png"                  
                alt="Freight Image"
                className=" shadow-2xl md:w-96 w-full h-full object-cover rounded-l-3xl"
                width={100}
                height={100}
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center text-center px-10 ">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Move your Freight?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto ">
                Join thousands of businesses who trust Cargo Matters for their
                logistics needs. Get started today with a free quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <Button size="lg" variant="secondary" asChild>
              <Link href="/get-quote">Request Freight Rates</Link>
            </Button> */}
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full text-red-600 px-8 py-6 text-base font-medium border-1 hover:bg-primary hover:text-white">
                  <a
                    href="https://wa.me/+919718559924?text=<YourMessage>"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact Sales
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Footer */}
      <Footer />
    </div>
  );
}
