import React from 'react';
import { User, Heart, Shield, Mail, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-24 py-12 border-t border-primary/20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center neon-glow">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold neon-text mb-4">
            Ojo — Everyone has a story. See it unfold.
          </h3>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover and visualize the life stories of remarkable people through our AI-powered 
            biographical timeline system. Explore achievements, milestones, and the journey that shaped history.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Product Links */}
          <div className="text-center">
            <h4 className="font-semibold mb-4 text-primary">Product</h4>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                How it Works
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                API Access
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Data Sources
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="text-center">
            <h4 className="font-semibold mb-4 text-primary">Company</h4>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Careers
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Blog
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Press Kit
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="text-center">
            <h4 className="font-semibold mb-4 text-primary">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Shield className="w-4 h-4" />
                Privacy Policy
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Data Policy
              </a>
              <a href="#" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-8">
          <a
            href="#"
            className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:neon-glow transition-all duration-300"
          >
            <Twitter className="w-5 h-5 text-primary" />
          </a>
          <a
            href="#"
            className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:neon-glow transition-all duration-300"
          >
            <Github className="w-5 h-5 text-primary" />
          </a>
          <a
            href="#"
            className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:neon-glow transition-all duration-300"
          >
            <Mail className="w-5 h-5 text-primary" />
          </a>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary/20 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 Ojo. Built with AI and passion for human stories.
            </p>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>for storytellers everywhere</span>
            </div>
          </div>
        </div>

        {/* AI Attribution */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-xs text-primary">Powered by Neural Networks</span>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-primary/3 rounded-full blur-2xl"></div>
      </div>
    </footer>
  );
};

export default Footer;