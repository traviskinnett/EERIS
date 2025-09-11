import { useAuth0 } from "@auth0/auth0-react";
import { Form, Input, Modal, message, Select } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

interface ComposeMessageModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  fetchMessages?: () => Promise<void>;
}

interface MessageForm {
  receiver: string;
  subject: string;
  content: string;
}

export const ComposeMessageModal = ({
  isModalOpen,
  setIsModalOpen,
  fetchMessages,
}: ComposeMessageModalProps) => {
  const { user } = useAuth0();
  const [form] = Form.useForm<MessageForm>();
  const [sending, setSending] = useState(false);

  // For recipients dropdown
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [recipientOptions, setRecipientOptions] = useState<
    { label: string; value: string }[]
  >([]);

  // Fetch list of employees/managers based on current user's role
  useEffect(() => {
    if (!user?.sub) return;
    setLoadingUsers(true);
    axios
      .post<{ uuid: string; name: string }[]>("/api/user/list", {
        uuid: user.sub,
      })
      .then((res) => {
        setRecipientOptions(
          res.data.map((u) => ({ label: u.name, value: u.uuid }))
        );
      })
      .catch((err) => {
        console.error("Failed to load recipients", err);
        message.error("Could not load recipient list");
      })
      .finally(() => setLoadingUsers(false));
  }, [user?.sub]);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = () => form.submit();

  const onFinish = async (values: MessageForm) => {
    if (!user?.sub) {
      message.error("User not authenticated.");
      return;
    }
    setSending(true);
    try {
      // find the name label for the selected receiver
      const receiverOption = recipientOptions.find(
        (opt) => opt.value === values.receiver
      );
      await axios.post("/api/message/send", {
        message: {
          // your form fields
          receiverId: values.receiver,
          subject: values.subject,
          content: values.content,
          senderId: user.sub,
          senderName: user.name, // from Auth0 user
          receiverName: receiverOption?.label ?? "", // from your dropdown
          datetime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        },
      });
      message.success("Message sent!");
      setIsModalOpen(false);
      form.resetFields();
      if (fetchMessages) await fetchMessages();
    } catch (err) {
      console.error(err);
      message.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      title="Compose Message"
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={sending}
      loading={loadingUsers}
      okText="Send"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ subject: "", content: "" }}
      >
        <Form.Item
          name="receiver"
          label="To"
          rules={[{ required: true, message: "Please select a recipient" }]}
        >
          <Select options={recipientOptions} placeholder="Select a recipient" />
        </Form.Item>

        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: "Please include a subject" }]}
        >
          <Input placeholder="Type your subject here" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Please enter message content" }]}
        >
          <Input.TextArea rows={4} placeholder="Type your message here" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
