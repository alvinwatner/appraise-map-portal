"use client";
// directory: /app/dashboard/layout.tsx
import React, { useState } from 'react';

import Header from "../components/Header";
import SideNav from "../components/SideNav";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);
  
    return (
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        {/* SideNav with toggling state passed down */}
        <SideNav isOpen={isOpen} setIsOpen={setIsOpen} />
  
        {/* Main content area including header, dynamically adjusting based on SideNav width */}
        <div className={`flex-grow flex flex-col w-full`}>
          {/* Header receives isWide to adjust its styling if needed */}
          <Header/>
          <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
            {children}
          </div>
        </div>
      </div>
    );
  }