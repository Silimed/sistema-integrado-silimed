import React, { useEffect, useState } from "react";
import {
  Ticket,
  TicketStatus,
  TicketPriority,
} from "../../interfaces/ticket.interface";
import { TicketService } from "../../services/ticket.service";
import Link from "next/link";
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  Card,
  Typography,
  Spin,
  Alert,
  Badge,
  Tooltip,
  Row,
  Col,
  Divider,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

const priorityColors = {
  [TicketPriority.LOW]: "blue",
  [TicketPriority.MEDIUM]: "gold",
  [TicketPriority.HIGH]: "orange",
  [TicketPriority.URGENT]: "red",
};

const statusColors = {
  [TicketStatus.OPEN]: "green",
  [TicketStatus.IN_PROGRESS]: "blue",
  [TicketStatus.RESOLVED]: "purple",
  [TicketStatus.CLOSED]: "default",
};

export const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string[]>([]);
  const [uniqueSectors, setUniqueSectors] = useState<string[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await TicketService.getAllTickets();
        setTickets(data);

        // Extrair setores únicos para o filtro
        const sectors = Array.from(
          new Set(data.map((ticket) => ticket.sector))
        );
        setUniqueSectors(sectors);
      } catch (err: unknown) {
        console.error("Erro ao carregar tickets:", err);
        setError("Erro ao carregar os tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText("");
    setStatusFilter([]);
    setPriorityFilter([]);
    setSectorFilter([]);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      searchText === "" ||
      ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(ticket.status);

    const matchesPriority =
      priorityFilter.length === 0 || priorityFilter.includes(ticket.priority);

    const matchesSector =
      sectorFilter.length === 0 || sectorFilter.includes(ticket.sector);

    return matchesSearch && matchesStatus && matchesPriority && matchesSector;
  });

  const columns: ColumnsType<Ticket> = [
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Ticket) => (
        <Link href={`/tickets/${record.id}`}>
          <Typography.Text
            strong
            className="cursor-pointer hover:text-blue-600"
          >
            {text}
          </Typography.Text>
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: TicketStatus) => (
        <Tag color={statusColors[status]}>
          {status === TicketStatus.OPEN && "Aberto"}
          {status === TicketStatus.IN_PROGRESS && "Em Progresso"}
          {status === TicketStatus.RESOLVED && "Resolvido"}
          {status === TicketStatus.CLOSED && "Fechado"}
        </Tag>
      ),
      filters: Object.values(TicketStatus).map((status) => ({
        text:
          status === TicketStatus.OPEN
            ? "Aberto"
            : status === TicketStatus.IN_PROGRESS
            ? "Em Progresso"
            : status === TicketStatus.RESOLVED
            ? "Resolvido"
            : "Fechado",
        value: status,
      })),
      onFilter: (value, record) => record.status === value.toString(),
    },
    {
      title: "Prioridade",
      dataIndex: "priority",
      key: "priority",
      render: (priority: TicketPriority) => (
        <Tag color={priorityColors[priority]}>
          {priority === TicketPriority.LOW && "Baixa"}
          {priority === TicketPriority.MEDIUM && "Média"}
          {priority === TicketPriority.HIGH && "Alta"}
          {priority === TicketPriority.URGENT && "Urgente"}
        </Tag>
      ),
      filters: Object.values(TicketPriority).map((priority) => ({
        text:
          priority === TicketPriority.LOW
            ? "Baixa"
            : priority === TicketPriority.MEDIUM
            ? "Média"
            : priority === TicketPriority.HIGH
            ? "Alta"
            : "Urgente",
        value: priority,
      })),
      onFilter: (value, record) => record.priority === value.toString(),
    },
    {
      title: "Setor",
      dataIndex: "sector",
      key: "sector",
      render: (sector: string) => <span>{sector}</span>,
      filters: uniqueSectors.map((sector) => ({
        text: sector,
        value: sector,
      })),
      onFilter: (value, record) => record.sector === value.toString(),
    },
    {
      title: "Atribuído para",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (assignedTo: string) =>
        assignedTo || <span className="text-gray-400">Não atribuído</span>,
    },
    {
      title: "Data de Criação",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: Date) => new Date(date).toLocaleDateString("pt-BR"),
      sorter: (a: Ticket, b: Ticket) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Carregando tickets..." />
      </div>
    );

  if (error)
    return <Alert message="Erro" description={error} type="error" showIcon />;

  return (
    <Card className="shadow-md">
      <div className="mb-6">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col>
            <Title level={4} className="m-0">
              Tickets
            </Title>
          </Col>
          <Col>
            <Link href="/tickets/new">
              <Button type="primary" icon={<PlusOutlined />}>
                Novo Ticket
              </Button>
            </Link>
          </Col>
        </Row>

        <Divider className="my-4" />

        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} md={8}>
            <Input
              placeholder="Buscar por título ou descrição"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} md={16} className="flex justify-end">
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Limpar Filtros
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Table
        dataSource={filteredTickets}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total de ${total} tickets`,
        }}
        className="shadow-sm"
      />
    </Card>
  );
};
