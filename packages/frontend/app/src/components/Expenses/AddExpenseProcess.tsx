import { InboxOutlined } from "@ant-design/icons";
import { Form, message, Upload } from "antd";
import { RcFile } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";

interface AddExpenseProcessProps {
  onImageEncoded: (base64: string, file: RcFile) => void;
}

export const AddExpenseProcess = ({
  onImageEncoded,
}: AddExpenseProcessProps) => {
  const [form] = Form.useForm();

  const supportedTypes = ["image/png", "image/jpeg", "image/jpg"];

  const toBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });

  return (
    <Form clearOnDestroy form={form} className="flex justify-center">
      <Form.Item name="image">
        <Dragger
          className="w-80"
          beforeUpload={async (file) => {
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes

            if (file.size > maxSize) {
              void message.error("Image must be at most 5MB.");
              return Upload.LIST_IGNORE;
            }

            if (!supportedTypes.includes(file.type)) {
              void message.error("File must be a JPEG, PNG, JPG image.");
              return Upload.LIST_IGNORE;
            }

            const base64 = await toBase64(file);
            onImageEncoded(base64, file);

            return false; // prevents default upload behavior but keeps file in list
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag an image into this area to upload
          </p>
          <p className="ant-upload-hint">Supported file types: jpg and png</p>
        </Dragger>
      </Form.Item>
    </Form>
  );
};
