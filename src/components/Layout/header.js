"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Paths where the header is hidden
  const hiddenPaths = ["/login", "/register"];

  // Optimize scroll handler with useCallback to prevent unnecessary re-renders
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    if (hiddenPaths.includes(pathname)) return;

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, pathname]);

  // Hide header for specific paths
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md"
          : "bg-white dark:bg-gray-800"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="font-extrabold text-2xl font-mono">ब्लग संसार</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/aboutus"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            About Us
          </Link>
          <Button asChild className="bg-black text-white rounded-full px-4 py-2">
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-800 px-4 py-2">
          <Link
            href="/"
            className="block py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="block py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/login"
            className="block py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign In
          </Link>
          <Button
            asChild
            className="bg-black text-white rounded-full px-4 py-2 mt-2"
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
