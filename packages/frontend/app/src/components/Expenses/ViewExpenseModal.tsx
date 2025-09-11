import { useAuth0 } from "@auth0/auth0-react";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Expense } from "../../../../../core/models/expense";

interface EditExpenseModalProps {
  isModalOpen: boolean;
  selectedExpense: Expense;
  setIsModalOpen: (isOpen: boolean) => void;
  fetchExpenses?: () => Promise<void>;
}

export const ViewExpenseModal = ({
  isModalOpen,
  setIsModalOpen,
  fetchExpenses,
  selectedExpense,
}: EditExpenseModalProps) => {
  const [submissionForm] = Form.useForm();

  const { user } = useAuth0();

  const handleSubmit = async (formValues: Expense) => {
    try {
      const request = {
        ...formValues,
        owner: user?.sub,
        id: selectedExpense.id,
      };
      await axios
        .post("/api/expense/update", {
          expense: request,
        })
        .then(async (result) => {
          if (result.status === 200) {
            message.success("Expense successfully updated");
            setIsModalOpen(false);
            await fetchExpenses!();
          }
        });
    } catch {
      message.error("Failed to create expense");
    }
  };

  useEffect(() => {
    if (selectedExpense) {
      submissionForm.setFieldsValue({
        ...selectedExpense,
        datetime: dayjs(selectedExpense.datetime),
      });
    }
  }, [selectedExpense]);

  return (
    <Modal
      title={<div className="text-xl">View Expense</div>}
      open={isModalOpen}
      width={640}
      footer={null}
      onCancel={() => {
        setIsModalOpen(false);
      }}
    >
      <div className="mt-4">
        <Form
          disabled
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
            rules={[{ required: true, message: "Please enter the store name" }]}
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
            {(fields) => (
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
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </div>
    </Modal>
  );
};
