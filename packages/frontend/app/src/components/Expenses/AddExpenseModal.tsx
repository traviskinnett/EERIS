import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Spin,
  Steps,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Expense } from "../../../../../core/models/expense";
import { AddExpenseProcess } from "./AddExpenseProcess";
import dayjs from "dayjs";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

interface AddExpenseModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  fetchExpenses?: () => Promise<void>;
}

export const AddExpenseModal = ({
  isModalOpen,
  setIsModalOpen,
  fetchExpenses,
}: AddExpenseModalProps) => {
  const [submissionForm] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Expense | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const { user } = useAuth0();

  const steps = [
    { title: "Insert Receipt" },
    { title: "Analyze" },
    { title: "Review" },
  ];

  const handleNext = () => {
    if (currentStep === 0 && !isManualEntry) {
      if (!base64Image) {
        message.error("Please upload a receipt image.");
        return;
      }
      sendToAI(base64Image);
    }
    setCurrentStep((prev) => prev + (isManualEntry ? 2 : 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => (isManualEntry ? 0 : prev - 1));
  };

  const handleSubmit = async (formValues: Expense) => {
    try {
      console.log("Submitting form values:", formValues);
      await axios
        .post("/api/expense/create", {
          expense: { ...formValues, ownerId: user?.sub },
        })
        .then(async (result) => {
          if (result.status === 200) {
            if (fetchExpenses) await fetchExpenses();
            message.success("Expense successfully created");
            setIsModalOpen(false);
            fetchExpenses;
          }
        });
    } catch {
      message.error("Failed to create expense");
    }
  };

  const sendToAI = async (image: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/image/analyze", { image });
      const analyzedExpense: Expense = JSON.parse(
        response.data.choices[0].message.content
      );
      setResult({ ...(analyzedExpense || "") });
      message.success("Successfully analyzed image");
    } catch {
      message.error("An error occurred while analyzing the image.");
    } finally {
      setIsLoading(false);
      console.log(result);
    }
  };

  useEffect(() => {
    if (result) {
      submissionForm.setFieldsValue({
        ...result,
        datetime: dayjs(result.datetime),
      });
    }
  }, [result]);

  return (
    <Modal
      title={
        <div className="text-xl">
          Add Expense<span className="ml-6"></span>
          <Checkbox
            checked={isManualEntry}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setIsManualEntry(e.target.checked);
              setCurrentStep(isChecked ? 2 : 0); // Skip to step 3 if manual entry is enabled
            }}
          >
            Manual Entry
          </Checkbox>
        </div>
      }
      open={isModalOpen}
      width={640}
      onCancel={() => {
        setIsModalOpen(false);
        setCurrentStep(0);
        setIsManualEntry(false);
        setBase64Image(null);
        setResult(null);
        setIsLoading(false);
        submissionForm.resetFields();
      }}
      afterClose={() => {
        setCurrentStep(0);
        setIsManualEntry(false);
        setBase64Image(null);
        setResult(null);
        setIsLoading(false);
        submissionForm.resetFields();
      }}
      footer={
        <div className="flex space-x-3 justify-end">
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          {!isManualEntry && currentStep > 0 && (
            <Button onClick={handlePrevious}>Previous</Button>
          )}
          {!isManualEntry && currentStep < steps.length - 1 && (
            <Button
              type="primary"
              disabled={currentStep === 1 && isLoading}
              onClick={handleNext}
            >
              Next
            </Button>
          )}
          {(isManualEntry || currentStep === steps.length - 1) && (
            <Button type="primary" onClick={() => submissionForm.submit()}>
              Submit
            </Button>
          )}
        </div>
      }
    >
      <Steps
        current={currentStep}
        items={steps.map((step) => ({ key: step.title, title: step.title }))}
      />

      <div className="mt-4">
        {currentStep === 0 && (
          <AddExpenseProcess onImageEncoded={setBase64Image} />
        )}
        {currentStep === 1 && (
          <div className="flex flex-col justify-center items-center h-40">
            <Spin spinning={isLoading} size="large" />
            <div className="mt-4">
              {isLoading
                ? "Sending receipt for analysis. Please wait..."
                : "Receipt analyzed. You can proceed to the next step."}
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <Form
            form={submissionForm}
            onFinish={(values) => {
              handleSubmit(values);
            }}
            name="expenseInfo"
            className="w-130"
            layout="horizontal"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <Form.Item
              label="Store Name"
              name="storeName"
              rules={[
                { required: true, message: "Please enter the store name" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Store Address"
              name="storeAddress"
              rules={[
                { required: true, message: "Please enter the store address" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Store Phone"
              name="storePhone"
              rules={[
                { required: true, message: "Please enter the store phone" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Store Website" name="storeWebsite">
              <Input />
            </Form.Item>
            <Form.Item
              label="Payment Method"
              name="paymentMethod"
              rules={[
                {
                  required: true,
                  message: "Please enter the payment method",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date/Time"
              name="datetime"
              rules={[
                { required: true, message: "Please enter the date and time" },
              ]}
            >
              <DatePicker format="MMMM D, YYYY" className="w-full" />
            </Form.Item>
            <Form.Item
              label="Total Amount"
              name="totalAmount"
              rules={[
                { required: true, message: "Please enter the total amount" },
              ]}
            >
              <InputNumber prefix="$" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Expense Category"
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select a category"
                options={[
                  { value: "Food", label: "Food" },
                  { value: "Health", label: "Health" },
                  { value: "Gas", label: "Gas" },
                  { value: "Travel", label: "Travel" },
                  { value: "Entertainment", label: "Entertainment" },
                  { value: "Utilities", label: "Utilities" },
                  { value: "Groceries", label: "Groceries" },
                  { value: "Office Supplies", label: "Office Supplies" },
                  { value: "Education", label: "Education" },
                ]}
              />
            </Form.Item>
            <Form.List
              name="items"
              initialValue={[{ name: "", quantity: 1, unitPrice: 0 }]}
              rules={[
                {
                  validator: async (_, items) => {
                    if (!items || items.length < 1) {
                      return Promise.reject(
                        new Error("At least one line item is required.")
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  <div className="grid grid-cols-[200px_100px_100px_25px]    gap-4 mb-2 text-sm">
                    <div>Item Name</div>
                    <div>Quantity</div>
                    <div>Unit Price</div>
                  </div>

                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      className="grid grid-cols-[200px_100px_100px_25px] gap-4 items-center mb-2"
                    >
                      <div>
                        <Form.Item
                          {...restField}
                          name={[name, "name"]}
                          rules={[
                            { required: true, message: "Item name required." },
                          ]}
                          noStyle
                        >
                          <Input placeholder="e.g. Eggs" className="w-full" />
                        </Form.Item>
                      </div>

                      <div>
                        <Form.Item
                          {...restField}
                          name={[name, "quantity"]}
                          initialValue={1}
                          rules={[
                            { required: true, message: "Quantity required." },
                          ]}
                          noStyle
                        >
                          <InputNumber min={1} className="w-full" />
                        </Form.Item>
                      </div>

                      <div>
                        <Form.Item
                          {...restField}
                          name={[name, "unitPrice"]}
                          rules={[
                            { required: true, message: "Unit price required." },
                          ]}
                          noStyle
                        >
                          <InputNumber
                            prefix="$"
                            min={0}
                            className="!w-full"
                            formatter={(val) =>
                              `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            //@ts-ignore
                            parser={(val) => val!.replace(/\$\s?|(,*)/g, "")}
                          />
                        </Form.Item>
                      </div>

                      <div className="flex justify-center items-center">
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          className="text-xl !text-red-400 cursor-pointer hover:!text-red-500"
                        />
                      </div>
                    </div>
                  ))}

                  <Form.Item className="w-67">
                    {/* what the fuck is this width */}
                    <Button
                      type="primary"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Item
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        )}
      </div>
    </Modal>
  );
};
