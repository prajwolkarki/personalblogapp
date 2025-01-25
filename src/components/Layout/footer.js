import { ArrowRight, BookOpen, Feather, Users } from "lucide-react";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="bg-secondary/50 py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Feather className="w-6 h-6" />
          <span className="font-semibold text-lg">BlogApp</span>
        </div>
        <div className="flex gap-6">
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
        </div>
      </div>
    </div>
  </footer>
  )
}

export default Footer