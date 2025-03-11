"use client";
import { useState } from "react";
import {
  Card,
  Input,
  Select,
  Row,
  Col,
  Tag,
  Button,
  Space,
  Typography,
} from "antd";
import {
  LaptopOutlined,
  DatabaseOutlined,
  CloudOutlined,
  ToolOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import MainLayout from "@/components/MainLayout";

// Interface que define a estrutura de uma aplicação
interface Application {
  name: string;
  icon: React.ReactNode;
  description: string;
  status: "active" | "inactive" | "pending";
  type: string;
  url?: string;
}

const { Title } = Typography;

const ApplicationsPage = () => {
  // Estados para controle de busca e filtros
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Lista de aplicações disponíveis
  const applications: Application[] = [
    {
      name: "SiliDesk",
      icon: <LaptopOutlined />,
      description: "Sistema do SiliDesk",
      status: "active",
      type: "RH",
      url: "http://localhost:3001/silidesk",
    },
    {
      name: "Salesforce",
      icon: <CloudOutlined />,
      description: "CRM e gestão de vendas",
      status: "active",
      type: "CRM",
      url: "https://salesforce.example.com",
    },
    {
      name: "Oracle Database",
      icon: <DatabaseOutlined />,
      description: "Banco de dados corporativo",
      status: "active",
      type: "Database",
      url: "https://oracle.example.com",
    },
    {
      name: "Jira",
      icon: <ToolOutlined />,
      description: "Gestão de projetos e tarefas",
      status: "active",
      type: "Project Management",
      url: "https://jira.example.com",
    },
    {
      name: "Microsoft 365",
      icon: <FileTextOutlined />,
      description: "Suite de produtividade",
      status: "active",
      type: "Productivity",
      url: "https://office.example.com",
    },
    {
      name: "ADP Folha",
      icon: <DollarOutlined />,
      description: "Sistema de folha de pagamento",
      status: "active",
      type: "HR",
      url: "https://adp.example.com",
    },
    {
      name: "Confluence",
      icon: <TeamOutlined />,
      description: "Base de conhecimento colaborativa",
      status: "active",
      type: "Knowledge Base",
      url: "https://confluence.example.com",
    },
    {
      name: "Power BI",
      icon: <BarChartOutlined />,
      description: "Análise de dados e relatórios",
      status: "active",
      type: "Analytics",
      url: "https://powerbi.example.com",
    },
  ];

  // Função para determinar a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Filtragem de aplicações com base na busca e filtros
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchText.toLowerCase()) ||
      app.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = !typeFilter || app.type === typeFilter;
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <MainLayout>
      <>
        <Title level={2}>Aplicações</Title>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Input
                placeholder="Buscar por nome ou descrição"
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
                {Array.from(new Set(applications.map((app) => app.type))).map(
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
                <Select.Option value="active">Ativo</Select.Option>
                <Select.Option value="inactive">Inativo</Select.Option>
                <Select.Option value="pending">Pendente</Select.Option>
              </Select>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {filteredApplications.map((app, index) => (
              <Col
                key={index}
                xs={24}
                sm={12}
                md={8}
                lg={6}
                style={{ display: "flex" }}
              >
                <Card
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "16px" }}>
                    {app.icon}
                  </div>
                  <Title level={4} style={{ margin: "0 0 8px 0" }}>
                    {app.name}
                  </Title>
                  <p style={{ flex: 1 }}>{app.description}</p>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <Tag color={getStatusColor(app.status)}>
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </Tag>
                      <Tag>{app.type}</Tag>
                    </div>
                    {app.url && (
                      <Button
                        type="primary"
                        href={app.url}
                        target="_blank"
                        block
                      >
                        Acessar
                      </Button>
                    )}
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

export default ApplicationsPage;
