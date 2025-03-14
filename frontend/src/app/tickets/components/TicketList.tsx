"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Ticket, getTickets } from "@/services/tickets";
import {
  Table,
  Card,
  Input,
  Button,
  Tag,
  Space,
  Spin,
  Alert,
  Typography,
  Select,
  Row,
  Col,
  Divider,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const { Title, Text } = Typography;

interface TicketListProps {
  sectors: string[];
  statusFilter?: string;
}

export function TicketList({
  sectors,
  statusFilter = "Todos",
}: TicketListProps) {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [internalStatusFilter, setInternalStatusFilter] =
    useState<string>(statusFilter);
  const [priorityFilter, setPriorityFilter] = useState<string>("Todas");
  const [sectorFilter, setSectorFilter] = useState<string>("Todos");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (statusFilter !== "Todos") {
      setInternalStatusFilter(statusFilter);
      applyFilters(
        searchText,
        statusFilter,
        priorityFilter,
        sectorFilter,
        dateRange
      );
    }
  }, [statusFilter, tickets]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const data = await getTickets();

      // Garantir que data é um array
      const ticketsArray = Array.isArray(data) ? data : [];

      setTickets(ticketsArray);
      setFilteredTickets(ticketsArray);
    } catch (error) {
      console.error("Erro ao carregar tickets:", error);
      setError("Erro ao carregar os tickets. Por favor, tente novamente.");
      // Inicializar com array vazio em caso de erro
      setTickets([]);
      setFilteredTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    applyFilters(
      value,
      internalStatusFilter,
      priorityFilter,
      sectorFilter,
      dateRange
    );
  };

  const handleStatusChange = (value: string) => {
    setInternalStatusFilter(value);
    applyFilters(searchText, value, priorityFilter, sectorFilter, dateRange);
  };

  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value);
    applyFilters(
      searchText,
      internalStatusFilter,
      value,
      sectorFilter,
      dateRange
    );
  };

  const handleSectorChange = (value: string) => {
    setSectorFilter(value);
    applyFilters(
      searchText,
      internalStatusFilter,
      priorityFilter,
      value,
      dateRange
    );
  };

  const handleReset = () => {
    setSearchText("");
    setInternalStatusFilter("Todos");
    setPriorityFilter("Todas");
    setSectorFilter("Todos");
    setDateRange([null, null]);
    setFilteredTickets(tickets);
  };

  const applyFilters = (
    search: string,
    status: string,
    priority: string,
    sector: string,
    dateRange: [Date | null, Date | null]
  ) => {
    // Garantir que tickets é um array antes de filtrar
    if (!Array.isArray(tickets)) {
      console.error("tickets não é um array:", tickets);
      setFilteredTickets([]);
      return;
    }

    let filtered = [...tickets];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower)
      );
    }

    if (status !== "Todos") {
      filtered = filtered.filter((ticket) => ticket.status === status);
    }

    if (priority !== "Todas") {
      filtered = filtered.filter((ticket) => ticket.priority === priority);
    }

    if (sector !== "Todos") {
      filtered = filtered.filter((ticket) => ticket.sector === sector);
    }

    if (dateRange[0]) {
      filtered = filtered.filter(
        (ticket) => new Date(ticket.createdAt) >= dateRange[0]!
      );
    }

    if (dateRange[1]) {
      filtered = filtered.filter(
        (ticket) => new Date(ticket.createdAt) <= dateRange[1]!
      );
    }

    setFilteredTickets(filtered);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return "red";
      case "média":
        return "gold";
      case "baixa":
        return "green";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aberto":
        return "blue";
      case "em andamento":
        return "orange";
      case "fechado":
        return "default";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<Ticket> = [
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Ticket) => (
        <a onClick={() => router.push(`/tickets/${record._id}`)}>
          <Text strong className="cursor-pointer hover:text-blue-600">
            {text}
          </Text>
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      filters: [
        { text: "Aberto", value: "Aberto" },
        { text: "Em Andamento", value: "Em Andamento" },
        { text: "Fechado", value: "Fechado" },
      ],
      onFilter: (value, record) => record.status === value.toString(),
    },
    {
      title: "Prioridade",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
      filters: [
        { text: "Baixa", value: "Baixa" },
        { text: "Média", value: "Média" },
        { text: "Alta", value: "Alta" },
      ],
      onFilter: (value, record) => record.priority === value.toString(),
    },
    {
      title: "Setor",
      dataIndex: "sector",
      key: "sector",
      render: (sector: string) => <span>{sector}</span>,
      filters: sectors.map((sector) => ({
        text: sector,
        value: sector,
      })),
      onFilter: (value, record) => record.sector === value.toString(),
    },
    {
      title: "Data de Criação",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR }),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Ações",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => router.push(`/tickets/${record._id}`)}
        >
          Ver Detalhes
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Carregando tickets..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Erro"
        description={error}
        type="error"
        showIcon
        action={
          <Button onClick={fetchTickets} type="primary">
            Tentar Novamente
          </Button>
        }
      />
    );
  }

  return (
    <Card className="shadow-md">
      <div className="mb-6">
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col>
            <Title level={4} className="m-0">
              Chamados
            </Title>
            <Text type="secondary">
              {filteredTickets.length}{" "}
              {filteredTickets.length === 1
                ? "chamado encontrado"
                : "chamados encontrados"}
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push("/tickets/new")}
            >
              Novo Chamado
            </Button>
          </Col>
        </Row>

        <Divider className="my-4" />

        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} md={6}>
            <Input
              placeholder="Buscar por título ou descrição"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} md={4}>
            <Select
              style={{ width: "100%" }}
              placeholder="Status"
              value={internalStatusFilter}
              onChange={handleStatusChange}
            >
              <Select.Option value="Todos">Todos os Status</Select.Option>
              <Select.Option value="Aberto">Aberto</Select.Option>
              <Select.Option value="Em Andamento">Em Andamento</Select.Option>
              <Select.Option value="Fechado">Fechado</Select.Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Select
              style={{ width: "100%" }}
              placeholder="Prioridade"
              value={priorityFilter}
              onChange={handlePriorityChange}
            >
              <Select.Option value="Todas">Todas as Prioridades</Select.Option>
              <Select.Option value="Baixa">Baixa</Select.Option>
              <Select.Option value="Média">Média</Select.Option>
              <Select.Option value="Alta">Alta</Select.Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Select
              style={{ width: "100%" }}
              placeholder="Setor"
              value={sectorFilter}
              onChange={handleSectorChange}
            >
              <Select.Option value="Todos">Todos os Setores</Select.Option>
              {sectors.map((sector) => (
                <Select.Option key={sector} value={sector}>
                  {sector}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={6}>
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
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total de ${total} chamados`,
        }}
        className="shadow-sm"
      />
    </Card>
  );
}
