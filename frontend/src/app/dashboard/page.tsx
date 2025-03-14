"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Statistic,
  List,
  Tag,
  Space,
  Divider,
} from "antd";
import {
  PlusOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import MainLayout from "@/components/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getTickets, Ticket } from "@/services/tickets";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aberto":
        return <ExclamationCircleOutlined style={{ color: "#f5222d" }} />;
      case "Em Andamento":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "Resolvido":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "error";
      case "in_progress":
        return "warning";
      case "closed":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Aberto";
      case "in_progress":
        return "Em Andamento";
      case "closed":
        return "Fechado";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      case "low":
        return "Baixa";
      default:
        return priority;
    }
  };

  // Filtrar tickets por status
  const openTickets = tickets.filter((ticket) => ticket.status === "open");
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "in_progress"
  );
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "closed"
  );

  // Ordenar tickets recentes por data de criação (mais recentes primeiro)
  const recentTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <Title level={2}>Dashboard</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push("/tickets/create")}
            >
              Criar Novo Chamado
            </Button>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Chamados Abertos"
                  value={openTickets.length}
                  valueStyle={{ color: "#f5222d" }}
                  prefix={<ExclamationCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Em Atendimento"
                  value={inProgressTickets.length}
                  valueStyle={{ color: "#faad14" }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Resolvidos"
                  value={resolvedTickets.length}
                  valueStyle={{ color: "#52c41a" }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <ToolOutlined />
                    <span>Chamados Recentes</span>
                  </Space>
                }
                extra={
                  <Button type="link" onClick={() => router.push("/tickets")}>
                    Ver Todos
                  </Button>
                }
              >
                <List
                  dataSource={recentTickets}
                  renderItem={(ticket) => (
                    <List.Item
                      key={ticket._id}
                      actions={[
                        <Button
                          key="view"
                          type="link"
                          onClick={() => router.push(`/tickets/${ticket._id}`)}
                        >
                          Ver
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <a
                            onClick={() =>
                              router.push(`/tickets/${ticket._id}`)
                            }
                          >
                            {ticket.title}
                          </a>
                        }
                        description={
                          <Space>
                            <Tag color={getStatusColor(ticket.status)}>
                              {getStatusText(ticket.status)}
                            </Tag>
                            <Tag color={getPriorityColor(ticket.priority)}>
                              {getPriorityText(ticket.priority)}
                            </Tag>
                            <Text type="secondary">
                              {format(
                                new Date(ticket.createdAt),
                                "dd/MM/yyyy HH:mm",
                                { locale: ptBR }
                              )}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                  loading={loading}
                  locale={{
                    emptyText: "Nenhum chamado encontrado",
                  }}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <ExclamationCircleOutlined />
                    <span>Meus Chamados Abertos</span>
                  </Space>
                }
              >
                <List
                  dataSource={openTickets.slice(0, 5)}
                  renderItem={(ticket) => (
                    <List.Item
                      key={ticket._id}
                      actions={[
                        <Button
                          key="view"
                          type="link"
                          onClick={() => router.push(`/tickets/${ticket._id}`)}
                        >
                          Ver
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <a
                            onClick={() =>
                              router.push(`/tickets/${ticket._id}`)
                            }
                          >
                            {ticket.title}
                          </a>
                        }
                        description={
                          <Space>
                            <Tag color={getPriorityColor(ticket.priority)}>
                              {getPriorityText(ticket.priority)}
                            </Tag>
                            <Text type="secondary">
                              {format(
                                new Date(ticket.createdAt),
                                "dd/MM/yyyy HH:mm",
                                { locale: ptBR }
                              )}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                  loading={loading}
                  locale={{
                    emptyText: "Nenhum chamado aberto",
                  }}
                />
                {openTickets.length > 5 && (
                  <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Button type="link" onClick={() => router.push("/tickets")}>
                      Ver Todos ({openTickets.length})
                    </Button>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Title level={4}>Acesso Rápido</Title>
                  <Space wrap>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => router.push("/tickets/create")}
                    >
                      Criar Novo Chamado
                    </Button>
                    <Button
                      icon={<ToolOutlined />}
                      onClick={() => router.push("/tickets")}
                    >
                      Gerenciar Chamados
                    </Button>
                  </Space>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
