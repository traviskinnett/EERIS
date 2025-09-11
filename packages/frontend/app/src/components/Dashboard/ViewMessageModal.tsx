// ViewMessageModal.tsx
import { Divider, Modal } from "antd";
import { Message } from "../../../../../core/models/message";

interface ViewMessageModalProps {
  isModalOpen: boolean;
  message: Message | null;
  handleAction?: () => void;
}

export const ViewMessageModal = ({
  isModalOpen,
  message,
  handleAction,
}: ViewMessageModalProps) => {
  if (!message) {
    return null; // or a spinner/placeholder
  }

  return (
    <Modal
      title="View Message"
      open={isModalOpen}
      onOk={handleAction}
      onCancel={handleAction}
    >
      <div className="space-y-2">
        <div>
          <span className="font-bold">Subject:</span> {message.subject}
        </div>
        <div>
          <span className="font-bold">Sender:</span> {message.senderName}
        </div>
        <div>
          <span className="font-bold">Date:</span>
          {new Date(message.datetime).toLocaleString()}
        </div>

        <Divider style={{ borderColor: "lightblue" }} />
        <p>{message.content}</p>
      </div>
    </Modal>
  );
};
