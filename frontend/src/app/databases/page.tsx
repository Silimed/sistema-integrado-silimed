"use client";
import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Input,
  Select,
  Button,
  Tooltip,
  Progress,
} from "antd";
import {
  DatabaseOutlined,
  CloudServerOutlined,
  HddOutlined,
  BarChartOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import MainLayout from "@/components/MainLayout";

const { Title, Text } = Typography;
const { Search } = Input;

interface Database {
  name: string;
  type: string;
  version: string;
  status: "Online" | "Offline" | "Manutenção";
  size: string;
  usage: number;
  host: string;
  port: string;
  lastBackup: string;
  icon: React.ReactNode;
}

const DatabasesPage = () => {
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Dados mockados de bancos de dados
  const databases: Database[] = [
    {
      name: "PostgreSQL Principal",
      type: "PostgreSQL",
      version: "15.2",
      status: "Online",
      size: "1.2 TB",
      usage: 75,
      host: "db-prod-01.example.com",
      port: "5432",
      lastBackup: "2024-03-07 03:00",
      icon: <DatabaseOutlined />,
    },
    {
      name: "MySQL Aplicações",
      type: "MySQL",
      version: "8.0",
      status: "Online",
      size: "800 GB",
      usage: 60,
      host: "db-prod-02.example.com",
      port: "3306",
      lastBackup: "2024-03-07 03:30",
      icon: <DatabaseOutlined />,
    },
    {
      name: "MongoDB Analytics",
      type: "MongoDB",
      version: "6.0",
      status: "Online",
      size: "2.5 TB",
      usage: 85,
      host: "db-analytics.example.com",
      port: "27017",
      lastBackup: "2024-03-07 04:00",
      icon: <CloudServerOutlined />,
    },
    {
      name: "Redis Cache",
      type: "Redis",
      version: "7.2",
      status: "Online",
      size: "32 GB",
      usage: 45,
      host: "cache-01.example.com",
      port: "6379",
      lastBackup: "2024-03-07 04:30",
      icon: <HddOutlined />,
    },
    {
      name: "ClickHouse Analytics",
      type: "ClickHouse",
      version: "23.8",
      status: "Manutenção",
      size: "5 TB",
      usage: 90,
      host: "analytics-db.example.com",
      port: "8123",
      lastBackup: "2024-03-07 02:00",
      icon: <BarChartOutlined />,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Online":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "Offline":
        return <WarningOutlined style={{ color: "#f5222d" }} />;
      case "Manutenção":
        return <SyncOutlined style={{ color: "#faad14" }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "success";
      case "Offline":
        return "error";
      case "Manutenção":
        return "warning";
      default:
        return "default";
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return "#f5222d";
    if (usage >= 70) return "#faad14";
    return "#52c41a";
  };

  // Filtragem de bancos de dados
  const filteredDatabases = databases.filter((db) => {
    const matchesSearch =
      db.name.toLowerCase().includes(searchText.toLowerCase()) ||
      db.type.toLowerCase().includes(searchText.toLowerCase()) ||
      db.host.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = !typeFilter || db.type === typeFilter;
    const matchesStatus = !statusFilter || db.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <MainLayout>
      <>
        <Title level={2}>Bancos de Dados</Title>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Search
                placeholder="Buscar bancos de dados..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Filtrar por tipo"
                allowClear
                onChange={setTypeFilter}
              >
                {Array.from(new Set(databases.map((db) => db.type))).map(
                  (type) => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  )
                )}
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Filtrar por status"
                allowClear
                onChange={setStatusFilter}
              >
                <Select.Option value="Online">Online</Select.Option>
                <Select.Option value="Offline">Offline</Select.Option>
                <Select.Option value="Manutenção">Manutenção</Select.Option>
              </Select>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {filteredDatabases.map((db, index) => (
              <Col key={index} xs={24} sm={12} lg={8}>
                <Card>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Space align="center">
                      <div style={{ fontSize: "24px" }}>{db.icon}</div>
                      <div>
                        <Title level={4} style={{ margin: 0 }}>
                          {db.name}
                        </Title>
                        <Text type="secondary">
                          {db.type} {db.version}
                        </Text>
                      </div>
                    </Space>

                    <Space>
                      <Tag
                        icon={getStatusIcon(db.status)}
                        color={getStatusColor(db.status)}
                      >
                        {db.status}
                      </Tag>
                      <Tag>{db.size}</Tag>
                    </Space>

                    <Tooltip title={`Uso do espaço: ${db.usage}%`}>
                      <Progress
                        percent={db.usage}
                        strokeColor={getUsageColor(db.usage)}
                        size="small"
                      />
                    </Tooltip>

                    <Space direction="vertical" size={0}>
                      <Text>
                        <strong>Host:</strong> {db.host}
                      </Text>
                      <Text>
                        <strong>Porta:</strong> {db.port}
                      </Text>
                      <Text>
                        <strong>Último backup:</strong> {db.lastBackup}
                      </Text>
                    </Space>

                    <Space style={{ marginTop: 8 }}>
                      <Button type="primary" size="small">
                        Gerenciar
                      </Button>
                      <Button size="small">Ver Métricas</Button>
                    </Space>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Space>
      </>
    </MainLayout>
  );
};

export default DatabasesPage;
