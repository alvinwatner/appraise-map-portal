import { useEffect, useState, useRef } from "react";
import { RxAvatar } from "react-icons/rx";
import { IoIosNotifications } from "react-icons/io";
import { TiArrowSortedDown } from "react-icons/ti";
import { useRouter } from "next/navigation";
import {
  countUnreadNotifications,
  users,
} from "../services/dataManagement.service";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Header: React.FC<{ onNotifClick: () => void }> = ({ onNotifClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const router = useRouter();
  const [roleId, setRoleId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const getCountUnreadNotif = async () => {
      const result = await countUnreadNotifications();
      setUnreadNotifCount(result);
    };

    getCountUnreadNotif();
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const supabase = createClientComponentClient();
        const { data: session, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        // Fetch user data and extract RoleId
        const dataUser = await users(session.session?.user.id);
        const userRoleId = dataUser?.data?.RoleId ?? null;

        // Update state with RoleId
        setRoleId(userRoleId);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProfileClick = () => {
    router.push("/profile");
    setShowDropdown(false);
  };

  const handleRolesClick = () => {
    router.push("/dashboard/settings");
    setShowDropdown(false);
  };

  const handleLogout = async () => {
    try {
      const supabase = createClientComponentClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
    setShowDropdown(false);
  };

  return (
    <header className="bg-c-light-blue p-2 flex justify-end items-center">
      <button
        onClick={() => {
          onNotifClick();
          setUnreadNotifCount(0);
        }}
      >
        <div className="relative">
          <IoIosNotifications size={30} className="mr-4" />
          {unreadNotifCount > 0 && (
            <div className="absolute w-4 h-4 text-white bg-red-500 -top-1 right-3 rounded-full text-[10px]">
              {unreadNotifCount}
            </div>
          )}
        </div>
      </button>

      <div onClick={handleClick} className="flex items-center cursor-pointer">
        <RxAvatar size={30} />
        <TiArrowSortedDown size={10} className="mr-4" />
      </div>
      {showDropdown && (
        <div ref={dropdownRef}>
          <div
            onClick={handleProfileClick}
            className="z-[60] absolute right-0 top-0 mt-9 w-48 bg-white border border-gray-300 rounded-md shadow-lg p-4 cursor-pointer"
          >
            Profile
          </div>
          {roleId === 1 && (
            <div
              onClick={handleRolesClick}
              className="z-[60] absolute right-0 top-14 mt-9 w-48 bg-white border border-gray-300 rounded-b-md  p-4 cursor-pointer"
            >
              Settings
            </div>
          )}
          <div
            onClick={handleLogout}
            className={`z-[60] absolute right-0 ${
              roleId === 1 ? "top-28" : "top-14 "
            }  mt-9 w-48 bg-white border border-gray-300 rounded-md shadow-lg p-4 cursor-pointer`}
          >
            Logout
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
