import { BellTwoTone } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Divider,
  List,
  message,
  Popover,
  Spin,
  Typography,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Message } from "../../../../../core/models/message";
import logo from "../../assets/logo.svg";
import { ViewMessageModal } from "../Dashboard/ViewMessageModal";
import { AvatarMenuDropdown } from "./AvatarMenuDropdown";

const { Text } = Typography;

export const HeaderApp = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewMessageModalOpen, setIsViewMessageModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const fetchUnread = async () => {
    setLoading(true);
    try {
      await axios
        .post<Message[]>("/api/message/unread", { uuid: user?.sub })
        .then((response) => setUnreadMessages(response.data));
    } catch (err) {
      console.error("Failed to load unread messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnread();
  }, [selectedMessage]);

  useEffect(() => {
    const markMessageAsRead = async () => {
      if (!user?.sub || !selectedMessage || selectedMessage.id === null) return;

      try {
        await axios.post("/api/message/read", {
          uuid: user.sub,
          messageId: selectedMessage.id,
        });
      } catch (err) {
        console.error("Failed to mark message read:", err);
        message.error("Could not mark message as read");
      }
    };

    markMessageAsRead();
    setSelectedMessage(selectedMessage);
    fetchUnread(); // Refresh unread messages after marking as read
  }, [user?.sub, selectedMessage]);

  const handleAction = () => {
    setIsViewMessageModalOpen(false);
  };

  const content = (
    <div className="w-80">
      <div className="flex justify-between items-center mb-1">
        <div className="text-lg font-semibold">Notifications</div>
        <Button size="small" onClick={() => setUnreadMessages([])}>
          Clear All
        </Button>
      </div>
      <Divider className="!mt-2" />
      {loading ? (
        <div className="text-center py-4">
          <Spin />
        </div>
      ) : unreadMessages.length === 0 ? (
        <div className="mb-4 text-center">No unread messages.</div>
      ) : (
        // list of unread messages
        <List
          size="small"
          dataSource={unreadMessages}
          renderItem={(item) => (
            <List.Item
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setSelectedMessage(item);
                setIsViewMessageModalOpen(true);
                setIsPopoverOpen(false);
              }}
            >
              <List.Item.Meta
                title={<Text strong>{item.subject}</Text>}
                description={new Date(item.datetime).toLocaleString()}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <div className="flex justify-between items-center">
      <div
        className="cursor-pointer px-5 py-2"
        onClick={() => navigate("/dashboard")}
      >
        <img src={logo} alt="Logo" />
      </div>
      <div className="flex items-center space-x-2">
        <Popover
          content={content}
          open={isPopoverOpen}
          placement="bottom"
          trigger="click"
          onOpenChange={(open) => {
            setIsPopoverOpen(open);
            if (!open) {
              setSelectedMessage(null); // Reset selected message when popover is closed
            }
          }}
        >
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-100 transition-colors cursor-pointer">
            <BellTwoTone
              onClick={() => setIsPopoverOpen(true)}
              className="text-2xl"
            />
          </div>
        </Popover>
        <AvatarMenuDropdown />
      </div>{" "}
      <ViewMessageModal
        isModalOpen={isViewMessageModalOpen}
        message={selectedMessage} // Pass the first message for now, you can change this logic later
        handleAction={handleAction}
      />
    </div>
  );
};
