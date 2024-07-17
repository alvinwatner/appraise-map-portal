import { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { IoIosNotifications } from "react-icons/io";
import { TiArrowSortedDown } from "react-icons/ti";
import { useRouter } from "next/navigation";
import {
  countUnreadNotifications,
  users,
} from "../services/dataManagement.service";
import { supabase } from "@/app/lib/supabaseClient";

const Header: React.FC<{ onNotifClick: () => void }> = ({ onNotifClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const router = useRouter();
  const [roleId, setRoleId] = useState<number | null>(null);

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

  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProfileClick = () => {
    router.push("profile");
  };

  const handleRolesClick = () => {
    router.push("roles");
  };

  return (
    <header className="bg-c-light-blue p-2 flex justify-between items-center">
      <div className="flex-grow">
        {/* Placeholder for other header content, if any */}
      </div>
      <div className="flex relative">
        <button
          className=""
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
          <>
            <div
              onClick={handleProfileClick}
              className="z-10 absolute right-0 top-0 mt-9 w-48 bg-white border border-gray-300 rounded-md shadow-lg p-4 cursor-pointer"
            >
              Profile
            </div>
            {roleId === 1 && (
              <div
                onClick={handleRolesClick}
                className="z-10 absolute right-0 top-12 mt-9 w-48 bg-white border border-gray-300 rounded-b-md  p-4 cursor-pointer"
              >
                Settings
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
