import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 bg-background border-t border-border/60">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-gold transition-transform duration-300 group-hover:scale-105">
              <Heart className="w-4 h-4 text-accent-foreground fill-current" />
            </div>
            <span className="font-serif text-lg font-semibold text-foreground tracking-tight">
              BlessPay
            </span>
          </a>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BlessPay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;