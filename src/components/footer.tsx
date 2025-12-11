import Link from "next/link";
import Image from "next/image";

const footerData = [
  {
    title: "Services",
    data: [
      { name: "E-commerce", href: "/services#e-commerce" },
      {
        name: "Green Logistics",
        href: "/services#green-logistics",
      },
      {
        name: "Supply Chain",
        href: "/services#supply-chain",
      },
    ],
  },
  {
    title: "Company",
    data: [
      { name: "About Us", href: "/aboutUs" },
      { name: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Support",
    data: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contactUs" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-black text-secondary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Cargo Matters</h3>
            <p className="text-sm opacity-80">
              Leading logistics company providing comprehensive shipping
              solutions worldwide that truly matters.
            </p>
            <h3 className="font-bold flex item-center text-lg gap-3 pt-5">
              Follow Us :{" "}
              <a
                href="https://www.linkedin.com/company/cargo-matters/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5  bg-gray hover:bg-white hover:text-black rounded-full transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <div className="relative h-5 w-5">
                  <Image
                    src="/images/linkedin-logo.png"
                    alt="LinkedIn Logo"
                    className="object-contain"
                    fill
                  />
                </div>
              </a>
            </h3>
          </div>

          <div className=" col-span-3 grid grid-cols-3 justify-between gap-10 w-full">
            {footerData.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="grid space-y-2 text-sm opacity-80">
                  {section.data.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link href={item.href}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
                {section.title === "Services" && (
                  <div className="">
                    <Link
                      href="/services"
                      className="mb-2 inline-block text-white font-semibold text-sm hover:underline"
                    >
                      View More →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 opacity-50">
          <h3 className="text-center">Privacy Note :</h3>
          <p className="text-center opacity-80">
            We respect your privacy. Your information will only be used to
            respond to your inquiry and will not be shared.
          </p>
        </div>
        <div className="border-t  border-white/20 mt-4 pt-4 text-center text-sm opacity-80">
          <p>
            &copy; {new Date().getFullYear()} Cargo Matters. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
