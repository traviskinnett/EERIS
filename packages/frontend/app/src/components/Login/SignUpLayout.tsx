import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";

export const SignUpLayout = () => {
  const [form] = useForm();
  const onFinish = (values: any) => console.log(values);
  return (
    <div className="flex flex-col items-center">
      <Form
        form={form}
        className="flex flex-col w-80"
        initialValues={{ remember: false }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className="text-[#1677ff]">Email</div>
        <Form.Item
          className="!mb-2"
          name="email"
          rules={[{ required: true, message: "Please enter a valid email!" }]}
        >
          <Input placeholder="Email"></Input>
        </Form.Item>
        <div className="text-[#1677ff]">Password</div>
        <Form.Item
          className="!mb-2"
          name="Password"
          rules={[{ required: true, message: "Please enter password!" }]}
        >
          <Input placeholder="Password"></Input>
        </Form.Item>
        <div className="text-[#1677ff]">Confirm password</div>
        <Form.Item
          name="Password"
          rules={[{ required: true, message: "Please confirm password!" }]}
        >
          <Input placeholder="Confirm password"></Input>
        </Form.Item>
      </Form>

      <Button
        className="w-32 !bg-[#2752b1]  !text-white"
        onClick={() => form.submit()}
      >
        Sign up
      </Button>
    </div>
  );
};
