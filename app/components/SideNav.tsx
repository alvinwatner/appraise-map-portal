"use client";
// directory: /app/ui/dashboard/SideNav.tsx
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi"; // Importing the GiHamburgerMenu icon
import { FiMap, FiDatabase, FiHome } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideNavProps {
  isOpen: boolean;
  setIsOpen: (isWide: boolean) => void;
}

export default function SideNav({ isOpen, setIsOpen }: SideNavProps) {
  const pathname = usePathname();

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`bg-c-blue text-white ${
        isOpen ? "w-64" : "w-24"
      } h-full transition-all duration-100`}
    >
      <div className="">
        <div
          className={`${isOpen ? "w-full bg-white" : "w-0  bg-c-blue"}  pt-4 `}
        >
          <button onClick={toggleNav} className="text-white text-2xl p-2 mb-2">
            <GiHamburgerMenu color={`${isOpen ? "black" : "white"}`} />
          </button>
          {/* Placeholder for logo, visible in both wide and thin versions */}
          <Image
            alt=""
            src="/company_logo.png"
            width={500}
            height={500}
            className={` ${isOpen ? "w-full mb-6" : "w-0 mb-6"} h-20`}
          ></Image>
          {isOpen && (
            <div className={`p-5 text-black text-center font-semibold h-20 `}>
              GRAHA PARAMITA KONSULTAN
            </div>
          )}
          {!isOpen && <div className="h-20"></div>}
        </div>

        {/* <div
          className={`bg-gray-300 ${isOpen ? "w-full mb-6" : "w-0 mb-6"} h-20`}
        ></div> */}

        {/* Navigation links with icons, visible in both wide and thin versions */}
        <ul className="space-y-4 p-5">
          <li title="Dashboard">
            <a href="/dashboard" className="block p-3">
              {!isOpen && <FiHome size={18}> </FiHome>}
              {isOpen && pathname == "/dashboard" && (
                <div className="flex bg-blue-400 px-5 rounded-xl justify-center py-1 items-center font-semibold">
                  <FiHome size={18} className="mr-2">
                    {" "}
                  </FiHome>
                  <div className="">Dashboard</div>
                </div>
              )}
              {isOpen && pathname != "/dashboard" && (
                <div className="flex items-center font-semibold">
                  <FiHome size={18} className="mr-2" />

                  <div className="">Dashboard</div>
                </div>
              )}
            </a>
          </li>
          <li title="Data">
            <Link href="/dashboard/data-management" className="block p-3">
              {!isOpen && <FiDatabase size={18}> </FiDatabase>}
              {isOpen && pathname == "/dashboard/data-management" && (
                <div className="flex bg-blue-400 px-5 rounded-xl py-1 items-center font-semibold">
                  <FiDatabase size={18} className="mr-2">
                    {" "}
                  </FiDatabase>
                  <div className="">Data</div>
                </div>
              )}
              {isOpen && pathname != "/dashboard/data-management" && (
                <div className="flex items-center font-semibold">
                  <FiDatabase size={18} className="mr-2" />

                  <div className="">Data</div>
                </div>
              )}
            </Link>
          </li>
          <li title="Maps">
            <a href="/dashboard/maps" className="block p-3">
              {!isOpen && <FiMap size={18}> </FiMap>}

              {isOpen && pathname == "/dashboard/maps" && (
                <div className="flex bg-blue-400 px-5 rounded-xl py-1 items-center font-semibold">
                  <FiMap size={18} className="mr-2">
                    {" "}
                  </FiMap>
                  <div className="">Map</div>
                </div>
              )}

              {isOpen && pathname != "/dashboard/maps" && (
                <div className="flex items-center font-semibold">
                  <FiMap size={18} className="mr-2" />

                  <div className="">Map</div>
                </div>
              )}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
