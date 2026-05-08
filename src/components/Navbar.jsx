import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, Printer } from "lucide-react";

const WHATSAPP_NUMBER = "5541999999999"; // ← Troque pelo número real
const WHATSAPP_MSG    = "Olá! Gostaria de solicitar um orçamento de impressão 3D.";
const whatsappUrl     = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;

const navLinks = [
  { label: "Portfólio", href: "#portfolio" },
  { label: "Materiais", href: "#materiais" },
  { label: "Sobre Nós", href: "#sobre"     },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-navbar-bg backdrop-blur-md border-b border-accent/20 shadow-lg shadow-black/40" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-navbar-logo-bg rounded flex items-center justify-center group-hover:bg-accent-hover transition-colors">
              <Printer className="w-4 h-4 text-navbar-logo-text" />
            </div>
            <span className="font-black text-lg text-primary tracking-tight">
              PRINT<span className="text-accent">3D</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-navbar-link hover:text-navbar-link-hover transition-colors tracking-wide uppercase">
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="hidden md:flex btn-primary shadow-lg shadow-accent/20">
            <MessageCircle className="w-4 h-4" /> Solicitar Orçamento
          </a>

          {/* Mobile hamburger */}
          <button className="md:hidden text-secondary hover:text-primary p-2"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-page border-t border-border px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-secondary hover:text-accent font-medium py-2 transition-colors uppercase tracking-wide text-sm">
              {link.label}
            </a>
          ))}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="btn-primary justify-center mt-2">
            <MessageCircle className="w-4 h-4" /> Solicitar Orçamento
          </a>
        </div>
      </div>
    </header>
  );
}
