import { ArrowRight, BookOpen, Feather, Users, Github, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary/50 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              <Feather className="w-6 h-6" />
              <span className="font-semibold text-lg">BlogApp</span>
            </div>
            <p className="text-sm text-muted-foreground">Empowering writers and readers with engaging content.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="aboutus"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="blog"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Community
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="https://www.github.com/prajwolkarki/" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="https://x.com/prajwollll1" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="https://www.linkedin.com/in/prajwolkarki/" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-muted-foreground/20">
          <p className="text-center text-sm text-muted-foreground">© {currentYear} BlogApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

