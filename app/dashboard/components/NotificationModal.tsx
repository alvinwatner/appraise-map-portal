import {
  fetchNotification,
  markAllNotificationsAsRead,
} from "@/app/services/dataManagement.service";
import { useEffect, useState } from "react";
import { X, Bell, Info } from "lucide-react";
import { Notification } from "../../types/types";
import { getTimeAgo } from "../../utils/helper";
import Loading from "@/app/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const handleClose = () => {
    markAllNotificationsAsRead();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 shadow-xl border-border/50 animate-in fade-in-0 zoom-in-95 duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-50">
              <Bell className="h-5 w-5 text-teal-600" />
            </div>
            <CardTitle className="text-xl font-semibold">
              Notifications
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {!isLoaded ? (
            <div className="h-96 flex justify-center items-center">
              <Loading size="w-12 h-12" strokeWidth="border-4 border-t-4" />
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              {notifications && notifications.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="relative px-6 py-4 hover:bg-muted/50 transition-colors duration-150"
                    >
                      {/* Unread indicator */}
                      {!notif.isRead && notif.isRead != null && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 bg-teal-500 rounded-full" />
                      )}

                      <div className="flex flex-col gap-1">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-sm font-semibold text-foreground">
                            {notif.title}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {getTimeAgo(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {notif.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] gap-3 text-muted-foreground">
                  <div className="p-3 rounded-full bg-muted">
                    <Info className="h-6 w-6" />
                  </div>
                  <p className="text-sm">No notifications available</p>
                </div>
              )}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
