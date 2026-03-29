const PRODUCT_LINKS = ["Features", "Pricing", "Changelog", "Roadmap"];
const RESOURCE_LINKS = ["Documentation", "API Reference", "Blog", "Status"];
const COMPANY_LINKS = ["About", "Careers", "Contact", "Legal"];

export function Footer() {
  return (
    <footer className="relative z-10 -mt-8 rounded-t-[4rem] bg-[#1A1A1A] px-6 pt-20 pb-8 text-white/60 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <span className="font-serif text-xl text-white">Flow</span>
            <p className="mt-3 max-w-[240px] text-sm leading-relaxed">
              Project management that moves at the speed of your team.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-4 text-xs font-medium tracking-[0.15em] uppercase text-white/40">
              Product
            </h4>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm transition-colors duration-200 hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-xs font-medium tracking-[0.15em] uppercase text-white/40">
              Resources
            </h4>
            <ul className="space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm transition-colors duration-200 hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs font-medium tracking-[0.15em] uppercase text-white/40">
              Company
            </h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm transition-colors duration-200 hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs">&copy; 2026 Flow. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
