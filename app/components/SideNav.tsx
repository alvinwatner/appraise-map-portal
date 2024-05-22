import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FiMap, FiDatabase, FiHome } from "react-icons/fi";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideNavProps {
  isOpen: boolean;
  setIsOpen: (isWide: boolean) => void;
}

const NavLink = ({
  href,
  icon,
  label,
  isOpen,
  isActive,
}: {
  href: string;
  icon: JSX.Element;
  label: string;
  isOpen: boolean;
  isActive: boolean;
}) => {
  const linkStyle = isOpen ? "flex px-6 py-2 items-center" : "block p-3";
  const activeStyle = isActive ? "bg-blue-400 rounded-xl font-semibold" : "";
  const minimizeStyle = !isOpen ? "flex justify-center" : "";

  return (
    <Link href={href} className={`${linkStyle} ${activeStyle} ${minimizeStyle}`}>
      {isOpen ? (
        <span className={icon.props.className + " mr-2"}>{icon}</span>
      ) : (
        icon
      )}
      {isOpen && <span>{label}</span>}
    </Link>
  );
};

export default function SideNav({ isOpen, setIsOpen }: SideNavProps) {
  const pathname = usePathname();
  const toggleNav = () => setIsOpen(!isOpen);

  return (
    <div
      className={`bg-c-blue text-white ${
        isOpen ? "w-64" : "w-24"
      } h-full transition-all duration-100`}
    >
      <div className={`${isOpen ? "bg-white" : "bg-c-blue"} `}>
        <button onClick={toggleNav} className="text-white text-2xl p-3 mb-2">
          <GiHamburgerMenu color={isOpen ? "black" : "white"} />
        </button>
        <Image
          alt=""
          src="/company_logo.png"
          width={500}
          height={500}
          className={`${isOpen ? "w-full mb-6" : "w-0 mb-2"} h-20`}
        />
        {isOpen && (
          <div className="text-black text-center font-semibold h-20">
            GRAHA PARAMITA KONSULTAN
          </div>
        )}
        {!isOpen && <div className="h-20"></div>}
      </div>

      <ul className="space-y-4 p-2 pt-5">
        <li title="Dashboard">
          <NavLink
            href="/dashboard"
            icon={<FiHome size={18} />}
            label="Dashboard"
            isOpen={isOpen}
            isActive={pathname === "/dashboard"}
          />
        </li>
        <li title="Data">
          <NavLink
            href="/dashboard/data-management"
            icon={<FiDatabase size={18} />}
            label="Data"
            isOpen={isOpen}
            isActive={pathname === "/dashboard/data-management"}
          />
        </li>
        <li title="Maps">
          <NavLink
            href="/dashboard/maps"
            icon={<FiMap size={18} />}
            label="Map"
            isOpen={isOpen}
            isActive={pathname === "/dashboard/maps"}
          />
        </li>
      </ul>
    </div>
  );
}
