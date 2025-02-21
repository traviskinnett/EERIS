import { Button, Checkbox, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { Link } from "react-router-dom";

interface LoginLayoutProps {
  setSessionExists: (bool: boolean) => void;
}

export const LoginLayout = ({ setSessionExists }: LoginLayoutProps) => {
  const [form] = useForm();

  const onFinish = (values: any) => console.log(values);
  return (
    <div className="flex flex-col items-center">
      <Form
        form={form}
        className="flex flex-col w-80"
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className="text-[#1677ff]">Email</div>
        <Form.Item
          className="!mb-2"
          name="email"
          rules={[{ required: true, message: "Please enter username!" }]}
        >
          <Input placeholder="Email"></Input>
        </Form.Item>
        <div className="text-[#1677ff]">Password</div>
        <Form.Item
          className="!mb-1"
          name="Password"
          rules={[{ required: true, message: "Please enter password!" }]}
        >
          <Input.Password placeholder="Password"></Input.Password>
        </Form.Item>
        <div className="flex justify-between">
          <Form.Item className="w-80 !mb-3" name="remember">
            <Checkbox style={{ color: "#1677ff" }}>Remember me</Checkbox>
          </Form.Item>
          <Link to={"/signup"} className="whitespace-nowrap pt-1">
            Forgot password?
          </Link>
        </div>
      </Form>

      <Button
        className="w-32 !bg-[#2752b1] !text-white"
        onClick={() => {
          setSessionExists(true);
          form.submit();
        }}
      >
        Login
      </Button>
    </div>
  );
};
