"use client"; // Mark this as a Client Component

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { logoutUserAction } from "@/actions/logout";
import { Menu, X } from "lucide-react";

export default function AuthenticatedHeader() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(
            `/api/autocomplete?query=${encodeURIComponent(searchQuery)}`
          );
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleLogout = async () => {
    try {
      const response = await logoutUserAction();
      if (response.success) {
        router.push("/login");
      } else {
        alert(response.error || "Logout failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred during logout. Please try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/blog?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b border-border md:px-6">
      {/* Logo Section */}
      <div className="flex items-center space-x-4">
        <Link href="/">
          <span className="text-xl font-bold text-foreground md:text-2xl">ब्लग संसार</span>
        </Link>
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 shadow-lg z-50 md:hidden">
          <form onSubmit={handleSearch} className="p-4">
            <Input
              type="text"
              placeholder="Search"
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="flex flex-col items-start space-y-2 px-4 pb-4">
            <Link
              href="/blog/create"
              className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
            >
              Write
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-200"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop Search & Actions */}
      <div className="hidden md:flex flex-1 items-center justify-between space-x-6">
        {/* Search Section */}
        <div className="relative flex-1">
          <form onSubmit={handleSearch} className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              🔍
            </span>
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 w-full max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full max-w-md bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    router.push(`/blog?search=${encodeURIComponent(suggestion)}`);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Link href="/blog/create" passHref>
            <Button variant="outline" className="rounded-full border-none">
              Write
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="/images/user.jpg" alt="User" />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
