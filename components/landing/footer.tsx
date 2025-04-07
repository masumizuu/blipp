import Link from "next/link"
import { MessageSquare, Github, Twitter, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card text-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">  
              <img src="/blipp.svg" alt="blipp" width={32} height={32} />
              <span className="text-xl font-bold">blipp</span>
            </div>
            <p className="text-foreground/80 mb-4">Modern messaging platform for seamless communication.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-foreground/60 hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-foreground/60 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-foreground/60 hover:text-primary transition-colors">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-foreground/60 hover:text-primary transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-foreground/60 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-foreground/60 hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-foreground/60 hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-foreground/60 hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-foreground/60 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-foreground/60 hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-foreground/60 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-foreground/60 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/60 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} ChatApp. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-foreground/60 hover:text-primary text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-foreground/60 hover:text-primary text-sm transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-foreground/60 hover:text-primary text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

