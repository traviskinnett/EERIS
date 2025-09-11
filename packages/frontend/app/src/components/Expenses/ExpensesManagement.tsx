import {
  CheckCircleFilled,
  DollarOutlined,
  ExclamationOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Button, Card, Divider, Segmented } from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";
import { Expense } from "../../../../../core/models/expense";
import { AddExpenseModal } from "./AddExpenseModal";
import { RecentExpensesTable } from "./RecentExpensesTable";

export const ExpensesManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const { user } = useAuth0();
  const [data, setData] = useState<Expense[]>([]);
  const [fade, setFade] = useState(false); // Controls full dashboard fade-in
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    "Pending"
  );

  const fetchData = async () => {
    try {
      const response = await axios.post("/api/expense/list", {
        uuid: user?.sub,
      });
      setData(response.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  };

  useEffect(() => {
    setFade(true);
    fetchData();
  }, [user?.sub, data.length]);

  const totalExpenseStat = useMemo(() => {
    let amount: number = 0;
    data.map((expense) => (amount += expense.totalAmount));
    return amount;
  }, [data]);

  const approvalsPendingStat = useMemo(() => {
    let amount: number = 0;
    data.map((expense) => {
      if (expense.status === "Pending") {
        amount += 1;
      }
    });
    return amount;
  }, [data]);

  const deniedExpensesStat = useMemo(() => {
    let amount: number = 0;
    data.map((expense) => {
      if (expense.status === "Denied") {
        amount += 1;
      }
    });
    return amount;
  }, [data]);

  const approvedExpensesStat = useMemo(() => {
    let amount: number = 0;
    data.map((expense) => {
      if (expense.status === "Approved") {
        amount += 1;
      }
    });
    return amount;
  }, [data]);

  return (
    <div
      className="p-4"
      style={{
        opacity: fade ? 1 : 0,
        transform: fade ? "translateY(0px)" : "translateY(-2px)",
        transition: "all 0.5s",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-2xl">Expense Management</div>
      </div>
      <div
        className="grid grid-cols-4 gap-2"
        style={{
          opacity: fade ? 1 : 0,
          transform: fade ? "translateY(0px)" : "translateY(-10px)",
          transition: "all 0.5s",
        }}
      >
        <Card
          hoverable
          className="hover:scale-101 cursor-default! border-0! overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-[#5481f9]">
                <CountUp
                  start={0}
                  end={totalExpenseStat}
                  separator=","
                  duration={1}
                  decimals={2}
                  useEasing={true}
                  prefix="$"
                />
              </div>
              <div className="text-gray-600">Total Expenses</div>
            </div>
            <Avatar
              icon={<DollarOutlined />}
              size={64}
              style={{ backgroundColor: "#5481f9" }}
            />
          </div>
          {/* Colored bottom section */}
          <div className="absolute bottom-0 left-0 w-[100%] h-2.5 bg-[#5481f9]" />
        </Card>

        <Card
          hoverable
          className="hover:scale-101 cursor-default! border-0! overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-[#f0ad4e]">
                <CountUp
                  start={0}
                  end={approvalsPendingStat}
                  useEasing={true}
                  duration={1}
                />
              </div>
              <div className="text-gray-600">Pending Approval</div>
            </div>
            <Avatar
              icon={<HourglassOutlined />}
              size={64}
              style={{ backgroundColor: "#f0ad4e" }}
            />
          </div>
          {/* Colored bottom section */}
          <div className="absolute bottom-0 left-0 w-[100%] h-2.5 bg-[#f0ad4e]" />
        </Card>
        <Card
          hoverable
          className="hover:scale-101 cursor-default! border-0! overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-[#429b49]">
                <CountUp
                  start={0}
                  end={approvedExpensesStat}
                  separator=","
                  duration={1}
                  useEasing={true}
                />
              </div>
              <div className="text-gray-600">Approved Expenses</div>
            </div>
            <Avatar
              icon={<CheckCircleFilled />}
              size={64}
              style={{ backgroundColor: "#429b49" }}
            />
          </div>
          {/* Colored bottom section */}
          <div className="absolute bottom-0 left-0 w-[100%] h-2.5 bg-[#429b49]" />
        </Card>
        <Card
          hoverable
          className="hover:scale-101 cursor-default! border-0! overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-[#dc3545]">
                <CountUp
                  start={0}
                  end={deniedExpensesStat}
                  separator=","
                  duration={1}
                  useEasing={true}
                />
              </div>
              <div className="text-gray-600">Denied Expenses</div>
            </div>
            <Avatar
              icon={<ExclamationOutlined />}
              size={64}
              style={{ backgroundColor: "#dc3545" }}
            />
          </div>
          {/* Colored bottom section */}
          <div className="absolute bottom-0 left-0 w-[100%] h-2.5 bg-[#dc3545]" />
        </Card>
      </div>
      <Divider />

      <div
        className={`${
          fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2.5"
        } transition-all duration-1000 `}
      >
        <div className="flex justify-between mb-2 w-full">
          <div className="text-2xl">Incoming Transactions</div>
          <Button
            type="primary"
            onClick={() => {
              setIsAddModalOpen(true);
            }}
          >
            Add Expense
          </Button>
        </div>
      </div>
      <div
        className={`${
          fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2.5"
        } transition-all duration-1000 `}
      >
        <Segmented
          defaultValue="Pending" // Set default value to "All"
          style={{
            marginBottom: "0.5rem",
          }}
          onChange={(value) => {
            setStatusFilter(value === "All" ? undefined : value); // Set undefined for "All"
          }}
          options={["All", "Pending", "Denied", "Approved"]}
          size="large"
          block
        />
        <RecentExpensesTable
          datasource={data.filter((expense) => {
            const matchesStatus =
              statusFilter === "All" ||
              statusFilter === undefined ||
              expense.status === statusFilter;
            return matchesStatus;
          })}
          fetchExpenses={fetchData}
        />
      </div>
      <AddExpenseModal
        fetchExpenses={fetchData}
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
      />
    </div>
  );
};
