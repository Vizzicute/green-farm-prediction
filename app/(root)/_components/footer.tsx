"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    // Add your newsletter subscription logic here
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail("");
    }, 1000);
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Predictions", href: "/dashboard" },
      { name: "Blogs", href: "/blogs" },
      { name: "Pricing", href: "/" },
      { name: "FAQ", href: "/info" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/info" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/" },
    ],
    predictions: [
      { name: "Football", href: "/basketball" },
      { name: "Basketball", href: "/basketball-over" },
      { name: "HTFT", href: "/htft" },
      { name: "Over/Under", href: "/overs" },
    ],
    resources: [
      { name: "Testimonials", href: "/" },
      { name: "Help Center", href: "/info" },
      { name: "Community", href: "/" },
      { name: "Status", href: "/" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="w-full border-t border-border bg-card/50 backdrop-blur-sm dark:bg-background/50">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Green Farm Predictions"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-bold">Green Farm</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Providing accurate sports predictions and analysis to help you
              make informed decisions.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Predictions</h3>
            <ul className="space-y-2">
              {footerLinks.predictions.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Subscribe</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest predictions and tips delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 text-sm"
              />
              <Button
                type="submit"
                disabled={isSubscribing}
                className="w-full h-9 text-sm"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Address</p>
              <p className="text-xs text-muted-foreground">Lagos, Nigeria</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Email</p>
              <Link
                href="mailto:support@greenfarmpredictions.com"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                support@greenfarmpredictions.com
              </Link>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Phone</p>
              <Link
                href="tel:+234800000000"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                +234 (800) 000-0000
              </Link>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {currentYear} Green Farm Predictions. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            {/* <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Terms & Conditions
            </Link> */}
            <Link
              href="/info"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Cookie Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
