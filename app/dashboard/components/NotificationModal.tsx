import {
  fetchNotification,
  markAllNotificationsAsRead,
} from "@/app/services/dataManagement.service";
import { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Notification } from "../../types/types";
import { getTimeAgo } from "../../utils/helper";
import Loading from "@/app/components/Loading";

export const NotificationModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchNotification();
      setNotifications(result);
      setIsLoaded(true);
    };
    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-semibold mb-4">Notifications</h2>
          <button
            className=""
            onClick={() => {
              markAllNotificationsAsRead();
              onClose();
            }}
          >
            <IoMdCloseCircleOutline size={30} />
          </button>
        </div>
        {!isLoaded && (
          <div className="h-96  justify-center items-center">
            <Loading size="w-16 h-16" strokeWidth="border-4 border-t-4" />
          </div>
        )}
        {isLoaded && (
          <div className="h-full max-h-full overflow-y-scroll">
            {notifications?.map((notif, index) => (
              <div
                className="flex flex-col justify-start mt-2 relative px-6"
                key={notif.id}
              >
                <h3 className="text-base font-semibold mb-1">{notif.title}</h3>
                <div className="flex justify-between">
                  <p className="text-sm mb-3">{notif.description}</p>
                  <p className="text-xs mb-3">{getTimeAgo(notif.createdAt)}</p>
                </div>

                {!notif.isRead && notif.isRead != null && (
                  <div className="absolute top-4 left-0 h-2 w-2 bg-red-500 rounded-full"></div>
                )}
                <div className="h-[1px] w-full bg-black"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
