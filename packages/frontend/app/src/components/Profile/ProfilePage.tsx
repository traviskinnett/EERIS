import { useAuth0 } from "@auth0/auth0-react";
import { Card, Typography, Spin } from "antd";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

export const ProfilePage = () => {
  const { user } = useAuth0();
  const [role, setRole] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.sub) return;

      try {
        const res = await fetch(`http://localhost:3000/api/user/${user.sub}`);
        const data = await res.json();
        setRole(data.role);
        setDepartment(data.department);
      } catch (err) {
        console.error("Failed to load profile info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-50">
      <Card title="Profile" style={{ width: 400 }}>
        <Title level={4}>{user?.name || "No Name"}</Title>
        <Text>Email: {user?.email || "N/A"}</Text>
        <br />
        <Text>UUID: {user?.sub}</Text>
        <br />
        <Text>Role: {role || "N/A"}</Text>
        <br />
        <Text>Department: {department || "N/A"}</Text>
      </Card>
    </div>
  );
};
