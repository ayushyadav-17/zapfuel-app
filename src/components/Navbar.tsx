import React, { useState } from 'react';
import { Menu, ShoppingBag, X, Zap } from 'lucide-react';
import { ScreenRoute } from '../types';

interface NavbarProps {
  activeScreen: ScreenRoute;
  onNavigate: (screen: ScreenRoute) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  cartCount,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: ScreenRoute; label: string }[] = [
    { id: 'drop', label: 'The Drop' },
    { id: 'catalog', label: 'Shakes & Bars' },
    { id: 'builder', label: 'Build a Box' },
    { id: 'lab', label: 'Macros Lab' },
  ];

  const handleLinkClick = (id: ScreenRoute) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#131318]/95 backdrop-blur-md border-b-2 border-[#2a292f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('drop')}
          className="flex items-center gap-2 font-display font-extrabold text-xl sm:text-2xl tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#CCFF00] rounded"
        >
          <Zap className="w-5 h-5 text-[#CCFF00] fill-[#CCFF00]" aria-hidden="true" />
          <span>ZAPFUEL</span>
        </button>

        {/* Zone 2: 4 Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navLinks.map((link) => {
            const isActive =
              activeScreen === link.id || (activeScreen === 'pdp' && link.id === 'catalog');
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.id)}
                className={`font-label text-xs uppercase tracking-[0.08em] whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#CCFF00] border-[#CCFF00]'
                    : 'text-[#e4e1e9]/80 border-transparent hover:text-white hover:border-[#FF007F]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="neo-btn neo-btn-turbo px-4 py-2 rounded font-label text-xs sm:text-sm uppercase tracking-[0.06em] flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Bag</span>
            <span className="tabular-nums bg-[#111116] text-[#CCFF00] px-1.5 py-0.5 rounded text-xs font-bold leading-none">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden p-2 rounded border-2 border-[#2E29FF] bg-[#16161d] text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <nav
          className="md:hidden border-t-2 border-[#2a292f] bg-[#16161d] px-4 py-3 flex flex-col gap-2"
          aria-label="Mobile Navigation"
        >
          {navLinks.map((link) => {
            const isActive =
              activeScreen === link.id || (activeScreen === 'pdp' && link.id === 'catalog');
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.id)}
                className={`text-left px-3 py-2.5 rounded font-label text-sm uppercase tracking-[0.08em] border-2 transition-colors ${
                  isActive
                    ? 'bg-[#CCFF00] text-[#111116] border-[#111116] font-bold'
                    : 'bg-[#1b1b20] text-white border-[#2a292f] hover:border-[#2E29FF]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
