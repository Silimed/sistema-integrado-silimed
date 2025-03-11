"use client";
import { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  Select,
  Row,
  Col,
  Typography,
  Card,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import MainLayout from "@/components/MainLayout";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { Search } = Input;

interface Ticket {
  key: string;
  id: string;
  title: string;
  requester: string;
  department: string;
  priority: "Alta" | "Média" | "Baixa";
  status: "Aberto" | "Em Atendimento" | "Resolvido" | "Fechado";
  category: string;
  createdAt: string;
  updatedAt: string;
}

const TicketsPage = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const router = useRouter();

  // Dados mockados de tickets
  const tickets: Ticket[] = [
    {
      key: "1",
      id: "TK-001",
      title: "Computador não liga",
      requester: "João Silva",
      department: "Vendas",
      priority: "Alta",
      status: "Em Atendimento",
      category: "Hardware",
      createdAt: "2024-03-07 09:00",
      updatedAt: "2024-03-07 09:30",
    },
    {
      key: "2",
      id: "TK-002",
      title: "Erro ao acessar e-mail",
      requester: "Maria Santos",
      department: "RH",
      priority: "Média",
      status: "Aberto",
      category: "Software",
      createdAt: "2024-03-07 10:15",
      updatedAt: "2024-03-07 10:15",
    },
    {
      key: "3",
      id: "TK-003",
      title: "Impressora com papel preso",
      requester: "Pedro Oliveira",
      department: "Financeiro",
      priority: "Baixa",
      status: "Resolvido",
      category: "Hardware",
      createdAt: "2024-03-07 11:00",
      updatedAt: "2024-03-07 14:30",
    },
    {
      key: "4",
      id: "TK-004",
      title: "Solicitação de novo software",
      requester: "Ana Costa",
      department: "Marketing",
      priority: "Média",
      status: "Fechado",
      category: "Software",
      createdAt: "2024-03-06 15:00",
      updatedAt: "2024-03-07 09:00",
    },
    {
      key: "5",
      id: "TK-005",
      title: "Problema com VPN",
      requester: "Carlos Mendes",
      department: "TI",
      priority: "Alta",
      status: "Em Atendimento",
      category: "Rede",
      createdAt: "2024-03-07 08:00",
      updatedAt: "2024-03-07 08:45",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aberto":
        return <ExclamationCircleOutlined style={{ color: "#f5222d" }} />;
      case "Em Atendimento":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "Resolvido":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "Fechado":
        return <StopOutlined style={{ color: "#d9d9d9" }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberto":
        return "error";
      case "Em Atendimento":
        return "warning";
      case "Resolvido":
        return "success";
      case "Fechado":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "red";
      case "Média":
        return "orange";
      case "Baixa":
        return "green";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: string) => (
        <Button type="link" onClick={() => router.push(`/tickets/${id}`)}>
          {id}
        </Button>
      ),
    },
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Solicitante",
      dataIndex: "requester",
      key: "requester",
    },
    {
      title: "Departamento",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Prioridade",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Categoria",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Criado em",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: unknown, record: Ticket) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => router.push(`/tickets/${record.id}`)}
          >
            Ver Detalhes
          </Button>
          <Button size="small">Atualizar</Button>
        </Space>
      ),
    },
  ];

  // Filtragem de tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.requester.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesPriority =
      !priorityFilter || ticket.priority === priorityFilter;
    const matchesCategory =
      !categoryFilter || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <MainLayout>
      <>
        <Title level={2}>Tickets</Title>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Search
                  placeholder="Buscar tickets..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Filtrar por status"
                  allowClear
                  onChange={setStatusFilter}
                >
                  <Select.Option value="Aberto">Aberto</Select.Option>
                  <Select.Option value="Em Atendimento">
                    Em Atendimento
                  </Select.Option>
                  <Select.Option value="Resolvido">Resolvido</Select.Option>
                  <Select.Option value="Fechado">Fechado</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Filtrar por prioridade"
                  allowClear
                  onChange={setPriorityFilter}
                >
                  <Select.Option value="Alta">Alta</Select.Option>
                  <Select.Option value="Média">Média</Select.Option>
                  <Select.Option value="Baixa">Baixa</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Filtrar por categoria"
                  allowClear
                  onChange={setCategoryFilter}
                >
                  <Select.Option value="Hardware">Hardware</Select.Option>
                  <Select.Option value="Software">Software</Select.Option>
                  <Select.Option value="Rede">Rede</Select.Option>
                </Select>
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={filteredTickets}
              pagination={{
                total: filteredTickets.length,
                pageSize: 10,
                showTotal: (total) => `Total de ${total} tickets`,
              }}
              scroll={{ x: true }}
            />
          </Space>
        </Card>
      </>
    </MainLayout>
  );
};

export default TicketsPage;
