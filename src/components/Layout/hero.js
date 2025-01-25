"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Footer from "./footer";
import { Feather, ArrowRight, BookOpen, Users } from "lucide-react";
import { Spotlight } from "../ui/spotlight";

export default function Hero() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[80vh] flex items-center justify-center">
        {/* Add the Spotlight component here */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
        
        <div className="absolute inset-0 z-0 bg-black text-white" />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-white">
              Share Your Story with the World
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A modern platform for writers, thinkers, and creators to publish their ideas and connect with readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog/create">
                <Button size="lg" className="gap-2">
                  Start Writing <Feather className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" className="gap-2">
                  Explore Posts <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Our Platform</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Feather className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Easy to Write</h3>
              <p className="text-muted-foreground">
                Intuitive editor with markdown support and real-time preview to help you craft beautiful posts.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Engaged Community</h3>
              <p className="text-muted-foreground">
                Connect with like-minded writers and readers who share your interests and passions.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Rich Content</h3>
              <p className="text-muted-foreground">
                Support for images, code blocks, embeds, and more to make your posts stand out.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-black text-white relative">
        <Spotlight className="-top-60 left-0 md:left-60 md:-top-20 z-0" fill="white" />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Writing?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of writers who have already found their voice on our platform.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Create Your Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
}