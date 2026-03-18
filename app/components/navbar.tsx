import Link from "next/link";
import { CarFront } from "lucide-react";
import { AuthMenu } from "@/app/components/auth-menu";

const links = [
  { href: "/", label: "Home" },
  { href: "/vehicles", label: "Vehicle Listings" },
  { href: "/sell", label: "Sell Vehicle" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <CarFront className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold tracking-tight">AURA Vehicles</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <AuthMenu />
      </div>
    </header>
  );
}
