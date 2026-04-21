import React from 'react';
import { useInvoices } from '../../context/InvoiceContext';

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M10.845.914a9.112 9.112 0 00-7.524 9.01 9.112 9.112 0 009.111 9.111 9.112 9.112 0 007.524-3.97 6.817 6.817 0 01-2.357.417A6.834 6.834 0 0110.765 8.65c0-3.1 2.07-5.72 4.922-6.536a9.076 9.076 0 00-4.842-1.2z"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M10 0a1 1 0 011 1v2a1 1 0 11-2 0V1a1 1 0 011-1zm0 15a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM1 9a1 1 0 000 2h2a1 1 0 100-2H1zm15 0a1 1 0 100 2h2a1 1 0 100-2h-2zM3.222 3.222a1 1 0 011.414 0l1.414 1.414a1 1 0 01-1.414 1.414L3.222 4.636a1 1 0 010-1.414zm11.728 11.728a1 1 0 011.414 0 1 1 0 010 1.414l-1.414 1.414a1 1 0 01-1.414-1.414l1.414-1.414zM3.222 16.778a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 1.414l-1.414 1.414a1 1 0 01-1.414 0zm11.728-11.728a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 1.414L16.364 5.05a1 1 0 01-1.414 0zM10 6a4 4 0 100 8 4 4 0 000-8z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Sidebar() {
  const { theme, toggleTheme } = useInvoices();

  return (
    /*
     * Not fixed — lives in the normal flex flow alongside <main>.
     * Mobile (flex-col parent): horizontal top bar, h-[72px], full width.
     * Desktop (md:flex-row parent): vertical left column, w-[103px], full height.
     */
    <nav
      className="
        shrink-0 bg-[#373B53]
        flex flex-row items-center justify-between
        h-[72px] w-full rounded-br-[20px]
        md:flex-col md:justify-start md:h-auto md:w-[103px] md:rounded-r-[20px] md:rounded-br-none
      "
    >
      {/* Logo */}
      <div
        className="
          relative overflow-hidden shrink-0
          flex items-center justify-center bg-[#7C5DFA]
          w-[72px] h-[72px] rounded-br-[20px]
          md:w-[103px] md:h-[103px] md:rounded-br-none
        "
      >
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#9277FF] rounded-tl-[20px]" />
        <svg className="relative z-10" width="28" height="26" viewBox="0 0 28 26" fill="none">
          <path
            fillRule="evenodd" clipRule="evenodd"
            d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 6.447 20.513 0z"
            fill="white"
          />
        </svg>
      </div>

      {/* Controls — pushed to the end on desktop */}
      <div className="flex flex-row items-center md:flex-col md:mt-auto md:w-full">
        <button
          onClick={toggleTheme}
          className="
            flex items-center justify-center
            w-[72px] h-[72px] md:w-[103px] md:h-[72px]
            text-[#7E88C3] hover:text-white transition-colors duration-200
          "
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* Divider: vertical on mobile, horizontal on desktop */}
        <div className="w-px h-[72px] bg-[#494E6E] md:h-px md:w-full" />

        <div className="flex items-center justify-center w-[72px] h-[72px] md:w-[103px] md:h-[80px]">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=invoice&backgroundColor=b6e3f4"
            alt="User avatar"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </div>
    </nav>
  );
}
