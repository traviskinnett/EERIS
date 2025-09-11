import { useAuth0 } from "@auth0/auth0-react";
import { Button, message, Popconfirm, Spin } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Expense } from "../../../../../core/models/expense";
import { EditExpenseModal } from "./EditExpenseModal";
import { ViewExpenseModal } from "./ViewExpenseModal";
import { useLocation } from "react-router-dom";

interface RecentExpensesTableProps {
  datasource: Expense[];
  isDashboard?: boolean;
  showEditModal?: () => void;
  fetchExpenses: () => Promise<void>;
}

export const RecentExpensesTable = ({
  datasource,
  fetchExpenses,
}: RecentExpensesTableProps) => {
  const { user, isAuthenticated } = useAuth0();
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense>();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;

      await axios
        .get(`/api/user/${user.sub}`)
        .then((response) => setRole(response.data.role))
        .catch((err) => message.error("Failed to load role info:", err))
        .finally(() => setLoading(false));
    };

    fetchUserRole();
  }, [user, isAuthenticated]);

  const updateExpenseStatus = async (
    expenseId: number,
    newStatus: "Approved" | "Denied" | "Pending"
  ) => {
    try {
      await axios
        .put("/api/expense/status", {
          expenseId,
          status: newStatus,
        })
        .then(async (result) => {
          if (result.status === 200) {
            message.success(`Expense ${newStatus.toLowerCase()} successfully!`);
            await fetchExpenses();
          } else {
            message.error(`Failed: ${result.statusText}`);
          }
        });
    } catch (err) {
      console.error("Error updating expense status:", err);
      message.error("Failed to update status");
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    if (!user?.sub) {
      message.error("User not found.");
      return;
    }
    await axios
      .post("/api/expense/delete", {
        uuid: user.sub,
        expenseId: expenseId,
      })
      .then(async (result) => {
        if (result.status === 200) {
          message.success("Expense deleted successfully!");
          await fetchExpenses();
        } else {
          message.error("Failed to delete expense.");
        }
      });
  };

  const columns: ColumnsType<Expense> = [
    {
      title: "Employee",
      dataIndex: "ownerName",
      key: "ownerName",
      hidden: role === "Employee",
    },
    {
      title: "Store Name",
      dataIndex: "storeName",
      key: "storeName",
      sorter: (a, b) => a.storeName.localeCompare(b.storeName),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      // sorter: (a, b) => a.category.localeCompare(b.category),
      onFilter: (value, record) => record.category.startsWith(value as string),
      filters: [
        {
          text: "Food",
          value: "Food",
        },
        {
          text: "Health",
          value: "Health",
        },
        {
          text: "Gas",
          value: "Gas",
        },
        {
          text: "Travel",
          value: "Travel",
        },
        {
          text: "Entertainment",
          value: "Entertainment",
        },
        {
          text: "Utilities",
          value: "Utilities",
        },
        {
          text: "Groceries",
          value: "Groceries",
        },
        {
          text: "Office Supplies",
          value: "Office Supplies",
        },
        {
          text: "Education",
          value: "Education",
        },
      ],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Date",
      dataIndex: "datetime",
      key: "date",
      defaultSortOrder: "descend",
      sorter: (a, b) =>
        new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      render: (value) => dayjs(value).format("MMMM D, YYYY"),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "total",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (value) => `$${value}`,
    },
    {
      title: "Actions",
      width:
        role === "Manager" && location.pathname !== "/overview" ? 340 : 180,
      render: (_text, record) => (
        <div className="flex flex-wrap gap-2">
          {(role === "Manager" || record.status === "Pending") && (
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedExpense(record);
                setIsEditModalOpen(true);
              }}
            >
              Edit
            </Button>
          )}

          {(role === "Manager" || record.status === "Pending") && (
            <Popconfirm
              title="Are you sure you want to delete this expense?"
              description="This action cannot be undone."
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDeleteExpense(record.id);
              }}
              okText="Yes, delete it"
              cancelText="No"
            >
              <Button
                onClick={(e) => e.stopPropagation()}
                type="primary"
                danger
              >
                Delete
              </Button>
            </Popconfirm>
          )}

          {role === "Manager" &&
            record.status === "Pending" &&
            location.pathname !== "/overview" && (
              <>
                <Button
                  style={{ backgroundColor: "#429b49", color: "white" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateExpenseStatus(record.id, "Approved");
                  }}
                >
                  Approve
                </Button>
                <Button
                  style={{ backgroundColor: "#dc3545", color: "white" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateExpenseStatus(record.id, "Denied");
                  }}
                >
                  Deny
                </Button>
              </>
            )}

          {role === "Manager" &&
            location.pathname !== "/overview" &&
            (record.status === "Approved" || record.status === "Denied") && (
              <Button
                className="w-[155px]"
                style={{ backgroundColor: "#f0ad4e", color: "white" }}
                onClick={(e) => {
                  e.stopPropagation();
                  updateExpenseStatus(record.id, "Pending");
                }}
              >
                Change Status
              </Button>
            )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  const onRowClick = (record: Expense) => {
    setSelectedExpense(record);
    setIsViewModalOpen(true);
  };

  return (
    <div>
      <Table
        pagination={{ defaultPageSize: 5 }}
        dataSource={datasource}
        columns={columns}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => onRowClick(record),
          style: { cursor: "pointer" },
        })}
      />
      <ViewExpenseModal
        selectedExpense={selectedExpense!}
        isModalOpen={isViewModalOpen}
        setIsModalOpen={setIsViewModalOpen}
        fetchExpenses={fetchExpenses}
      />
      <EditExpenseModal
        selectedExpense={selectedExpense!}
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        fetchExpenses={fetchExpenses}
      />
    </div>
  );
};
