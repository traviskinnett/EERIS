import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Card,
  Col,
  Pagination,
  Row,
  Table,
  Typography,
  Popover,
  message,
} from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { UpOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { TipsDisplay } from "./Data";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import { Expense } from "../../../../../core/models/expense";
import { Message } from "../../../../../core/models/message";
import { AddExpenseModal } from "../Expenses/AddExpenseModal";
import { ViewMessageModal } from "./ViewMessageModal";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import dayjs from "dayjs";
import { ComposeMessageModal } from "./ComposeMessageModal";

const gridStyle: React.CSSProperties = {
  width: "25%",
  textAlign: "center",
  cursor: "pointer",
};

const { Title } = Typography;

export const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState("");
  const [fade, setFade] = useState(false); // Controls full dashboard fade-in
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [data, setData] = useState<Expense[]>([]);
  const [page, setPage] = useState(1);
  const displayArticles = TipsDisplay.slice((page - 1) * 4, page * 4);
  const { user, isLoading } = useAuth0();
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message>();
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null
  );

  const categories = [
    // to get each category for the doughnut chart
    "Food",
    "Health",
    "Gas",
    "Travel",
    "Entertainment",
    "Utilities",
    "Groceries",
    "Office Supplies",
    "Education",
  ];

  type CategoryTotal = {
    category: (typeof categories)[number];
    amount: number;
  };

  function useCategoryTotals() {
    const { user, isLoading: authLoading } = useAuth0();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    // fetch raw expenses as soon as we know the user
    useEffect(() => {
      if (authLoading || !user?.sub) return;

      setLoading(true);
      axios
        .post<Expense[]>("/api/expense/list", { uuid: user.sub })
        .then((res) => setExpenses(res.data))
        .catch((err) => console.error("Fetch error:", err))
        .finally(() => setLoading(false));
    }, [authLoading, user?.sub]);

    // compute totals from that fetched array
    const categoryTotals = useMemo<CategoryTotal[]>(() => {
      const tally: Record<string, number> = {};
      categories.forEach((c) => (tally[c] = 0));

      const currentMonthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.datetime);
        const currentDate = new Date();
        return (
          expenseDate.getFullYear() === currentDate.getFullYear() &&
          expenseDate.getMonth() === currentDate.getMonth()
        );
      });

      currentMonthExpenses.forEach(({ category, totalAmount }) => {
        if (category in tally) tally[category] += totalAmount;
      });

      return categories.map((c) => ({ category: c, amount: tally[c] }));
    }, [expenses]);

    return { categoryTotals, loading };
  }

  const { categoryTotals } = useCategoryTotals();

  const navigate = useNavigate();

  const handleAction = () => {
    setIsModalOpen(false);
  };

  const handleAddReceiptClick = () => {
    setIsAddModalOpen(true);
  };

  const showComposeModal = () => setIsComposeOpen(true);

  const columnsMessage = [
    {
      title: "Sender",
      dataIndex: "senderName",
      key: "name",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Date",
      dataIndex: "datetime",
      key: "date",
      //@ts-ignore
      sorter: (a, b) =>
        new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      render: (value: Date) => dayjs(value).format("MMMM D, YYYY"),
      defaultSortOrder: "descend",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Unread",
          value: "Unread",
        },
        {
          text: "Read",
          value: "Read",
        },
      ],
      onFilter: (value: any, record: { status: any }) =>
        record.status === value,
    },
  ];

  const ExpenseColumns = [
    {
      title: "Store Name",
      dataIndex: "storeName",
      key: "storeName",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Date",
      dataIndex: "datetime",
      key: "date",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "total",
    },
  ];

  useEffect(() => {
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

    fetchData();
  }, [user?.sub]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.post("/api/message/list", {
          uuid: user?.sub,
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        message.error("Failed to fetch messages.");
      }
    };
    fetchMessages();
  }, [user?.sub]);

  useEffect(() => {
    if (!user?.sub || selectedMessageId === null) return;

    axios
      .post("/api/message/read", {
        uuid: user.sub,
        messageId: selectedMessageId,
      })
      .catch((err) => {
        console.error("Failed to mark message read:", err);
        message.error("Could not mark message as read");
      });
  }, [user?.sub, selectedMessageId]);

  useEffect(() => {
    if (isLoading || !user?.name) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    const hour = new Date().getHours();
    const greeting =
      hour < 12
        ? `Good Morning, ${user.name}!`
        : hour < 18
        ? `Good Afternoon, ${user.name}!`
        : `Good Evening, ${user.name}!`;

    let index = 0;
    setDisplayedText("");
    setFade(true); // hide everything during animation

    intervalRef.current = setInterval(() => {
      index++;
      setDisplayedText(greeting.slice(0, index));

      if (index >= greeting.length) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
      }
    }, 40);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading, user?.name]);

  const handleGeneratePdf = async () => {
    alert("Generating PDF...");

    const graph = document.getElementById("graph-pdf");
    if (!graph) {
      alert("Graph not found!");
      return;
    }

    try {
      const canvas = await html2canvas(graph, {
        scale: 2,
        useCORS: true,
        ignoreElements: (element) => {
          const style = getComputedStyle(element);
          return (
            style.color.includes("oklch") ||
            style.backgroundColor.includes("oklch")
          );
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth() - 30;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.setFontSize(16);
      pdf.text("User Expense Report", pdfWidth / 2 + 15, 15, {
        align: "center",
      });

      pdf.addImage(imgData, "PNG", 13, 23, pdfWidth + 3, pdfHeight);

      const startY = pdfHeight + 30;

      autoTable(pdf, {
        startY,
        head: [ExpenseColumns.map((col) => col.title)],
        // TODO: Replace expenseData with actual data here
        // body: expenseData.map((item) => [
        body: data.map((item) => [
          item.storeName,
          item.category,
          item.status,
          dayjs(item.datetime).format("YYYY-MM-DD"), // Format the Date object
          item.totalAmount,
        ]),
        theme: "striped",
      });

      const pdfBlob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);

      // Download the PDF
      const pdfName = `${user?.name}_Expense_Report.pdf`;
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = pdfName;
      a.click();

      // // Open in a new tab
      // window.open(blobUrl, "_blank");

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert("Failed to generate PDF, error: " + error);
    }
  };

  const handleGenerateCsv = () => {
    alert("Generating CSV...");

    // TODO: Replace expenseData with actual data here
    // const csvData = expenseData.map((item) => ({
    const csvData = data.map((item) => ({
      StoreName: item.storeName,
      Category: item.category,
      Status: item.status,
      Date: item.datetime,
      Total: item.totalAmount,
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((item) => Object.values(item).join(",")),
    ].join("\n");

    const csvBlob = new Blob([csvContent], { type: "text/csv;" });
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvName = `${user?.name}_Expense_Report.csv`;

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = csvName;
    a.click();

    URL.revokeObjectURL(csvUrl);
  };

  const onRowClick = (record: Message) => {
    setSelectedMessage(record);
    record.status = "Read"; // Update status to "Read"
    setSelectedMessageId(record.id);
    setIsModalOpen(true);
  };

  // PopOver content for Generate Report
  const content = (
    <div className="flex flex-col space-y-2">
      <Button onClick={handleGeneratePdf}>Export as PDF</Button>
      <Button onClick={handleGenerateCsv}>Export as CSV</Button>
    </div>
  );

  return (
    <div>
      <div className="px-4">
        <div className="flex items-center">
          <HiOutlineSparkles className="text-[2rem] text-[#ffa600]" />
          <Title level={2} className="ml-2 mt-2">
            {displayedText}
          </Title>
        </div>
        <div
          className={`${
            fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          } transition-all duration-1000 `}
        >
          <Card
            title="Quick Access"
            size="small"
            styles={{ header: { backgroundColor: "#2852AD", color: "white" } }}
          >
            <Card.Grid
              className="h-fit"
              style={gridStyle}
              onClick={handleAddReceiptClick}
            >
              Add Receipt
            </Card.Grid>

            <Card.Grid style={gridStyle} onClick={() => navigate("/overview")}>
              Recent Transactions
            </Card.Grid>

            <Card.Grid style={gridStyle} className="p-0!">
              <Popover
                content={content}
                trigger="click"
                placement="bottom"
                className="w-full h-full flex items-center justify-center"
              >
                Generate Report
              </Popover>
            </Card.Grid>

            <Card.Grid
              style={gridStyle}
              onClick={() => {
                const element = document.getElementById("budget-tips");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Budget Tips
            </Card.Grid>
          </Card>
        </div>
        <Row
          id="graph-pdf"
          gutter={10}
          className={`mt-4 ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          } transition-all duration-1500`}
        >
          <Col span={12}>
            <Card
              title="Monthly Expenses"
              size="small"
              style={{ width: "100%", height: "20rem" }}
              styles={{
                header: { backgroundColor: "#2852AD", color: "white" },
              }}
            >
              <div className="h-60 mt-2 mr-12">
                <DoughnutChart
                  // data={monthlyData}
                  data={categoryTotals
                    .filter(({ amount }) => amount > 0)
                    .map(({ category, amount }) => ({ category, amount }))}
                />
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="Trends"
              size="small"
              style={{ width: "100%", height: "20rem" }}
              styles={{
                header: { backgroundColor: "#2852AD", color: "white" },
              }}
            >
              <div className="h-56 w-[98%] mx-auto">
                <BarChart
                  data={(() => {
                    const totals = data
                      .filter((item) =>
                        dayjs(item.datetime).isAfter(
                          dayjs().subtract(5, "month").startOf("month")
                        )
                      )
                      .reduce((acc, item) => {
                        const key = dayjs(item.datetime).format("YYYY-MM");
                        acc[key] = (acc[key] || 0) + item.totalAmount;
                        return acc;
                      }, {} as Record<string, number>);

                    const last6Months = Array.from({ length: 6 }, (_, i) =>
                      dayjs()
                        .subtract(5 - i, "month")
                        .format("YYYY-MM")
                    );

                    return last6Months.map((key) => ({
                      month: dayjs(key).format("MMMM"),
                      amount: parseFloat((totals[key] || 0).toFixed(2)),
                    }));
                  })()}
                />
              </div>
            </Card>
          </Col>
        </Row>

        <Col
          span={24}
          className={`mt-4 ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          } transition-all duration-2500`}
        >
          <Card
            title="Messages"
            size="small"
            styles={{ header: { backgroundColor: "#2852AD", color: "white" } }}
          >
            <div className="flex justify-end mb-2 w-full">
              <Button onClick={showComposeModal} type="primary">
                Compose Message
              </Button>
            </div>
            <Table
              dataSource={messages}
              //@ts-ignore
              columns={columnsMessage}
              pagination={{ defaultPageSize: 5 }}
              rowKey="id"
              onRow={(record) => ({
                onClick: () => onRowClick(record),
                style: { cursor: "pointer" },
              })}
            />
          </Card>
        </Col>
        <Col
          span={24}
          className={`mt-4 ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
          } transition-all duration-3000`}
        >
          <Card
            id="budget-tips"
            title="Budget Tips"
            size="small"
            styles={{ header: { backgroundColor: "#2852AD", color: "white" } }}
          >
            <Row gutter={16} className="pl-2 pr-2">
              {displayArticles.map((article, index) => (
                <Col span={6} key={index}>
                  <Card
                    hoverable
                    onClick={() => window.open(article.link, "_blank")}
                    className="w-full text-left hover:scale-101"
                    cover={
                      <div className="relative h-30 overflow-hidden">
                        <img
                          src={article.image}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>
                    }
                    styles={{ body: { height: "5rem" } }}
                  >
                    <div className="mt-[-0.5rem]">{article.title}</div>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="flex justify-center mt-3">
              <Pagination
                current={page}
                onChange={(page) => setPage(page)}
                total={TipsDisplay.length}
                pageSize={4}
              />
            </div>
          </Card>
        </Col>
      </div>
      <Button
        shape="circle"
        icon={<UpOutlined />}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 50,
          height: 50,
          fontSize: 16,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      />
      <AddExpenseModal
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        fetchExpenses={useCategoryTotals} // FIX THIS
      />
      <ViewMessageModal
        isModalOpen={isModalOpen}
        handleAction={handleAction}
        message={selectedMessage!} // Pass the first message for now, you can change this logic later
      />
      <ComposeMessageModal
        isModalOpen={isComposeOpen}
        setIsModalOpen={setIsComposeOpen}
      />
    </div>
  );
};
