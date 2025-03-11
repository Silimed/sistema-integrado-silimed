"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Steps,
  Input,
  Form,
  Timeline,
  Modal,
  Select,
  Divider,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import MainLayout from "@/components/MainLayout";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface TicketComment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  type: "comment" | "status_change" | "resolution";
}

interface TicketDetail {
  id: string;
  title: string;
  description: string;
  requester: string;
  department: string;
  priority: "Alta" | "Média" | "Baixa";
  status: "Aberto" | "Em Atendimento" | "Resolvido" | "Fechado";
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  comments: TicketComment[];
  resolution?: string;
}

const TicketDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Dados mockados do ticket
  const [ticket, setTicket] = useState<TicketDetail>({
    id: params.id,
    title: "Computador não liga",
    description:
      "O computador não está ligando após queda de energia. Já verifiquei a tomada e os cabos, mas continua sem funcionar.",
    requester: "João Silva",
    department: "Vendas",
    priority: "Alta",
    status: "Em Atendimento",
    category: "Hardware",
    createdAt: "2024-03-07 09:00",
    updatedAt: "2024-03-07 09:30",
    assignedTo: "Carlos Técnico",
    comments: [
      {
        id: "1",
        user: "Carlos Técnico",
        content: "Iniciando atendimento do chamado.",
        timestamp: "2024-03-07 09:15",
        type: "status_change",
      },
      {
        id: "2",
        user: "Carlos Técnico",
        content: "Verificando fonte de alimentação do computador.",
        timestamp: "2024-03-07 09:30",
        type: "comment",
      },
    ],
  });

  const getStatusStep = (status: string) => {
    switch (status) {
      case "Aberto":
        return 0;
      case "Em Atendimento":
        return 1;
      case "Resolvido":
        return 2;
      case "Fechado":
        return 3;
      default:
        return 0;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aberto":
        return <ExclamationCircleOutlined style={{ color: "#f5222d" }} />;
      case "Em Atendimento":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "Resolvido":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
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

  const handleStatusChange = (newStatus: TicketDetail["status"]) => {
    const updatedTicket = {
      ...ticket,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      comments: [
        ...ticket.comments,
        {
          id: (ticket.comments.length + 1).toString(),
          user: "Carlos Técnico",
          content: `Status alterado para ${newStatus}`,
          timestamp: new Date().toISOString(),
          type: "status_change" as const,
        },
      ],
    };
    setTicket(updatedTicket);
  };

  const handleCommentSubmit = (values: { content: string }) => {
    const updatedTicket = {
      ...ticket,
      updatedAt: new Date().toISOString(),
      comments: [
        ...ticket.comments,
        {
          id: (ticket.comments.length + 1).toString(),
          user: "Carlos Técnico",
          content: values.content,
          timestamp: new Date().toISOString(),
          type: "comment" as const,
        },
      ],
    };
    setTicket(updatedTicket);
    setIsCommentModalOpen(false);
    form.resetFields();
  };

  const handleResolutionSubmit = (values: { resolution: string }) => {
    const updatedTicket = {
      ...ticket,
      status: "Resolvido" as const,
      resolution: values.resolution,
      updatedAt: new Date().toISOString(),
      comments: [
        ...ticket.comments,
        {
          id: (ticket.comments.length + 1).toString(),
          user: "Carlos Técnico",
          content: "Chamado resolvido: " + values.resolution,
          timestamp: new Date().toISOString(),
          type: "resolution" as const,
        },
      ],
    };
    setTicket(updatedTicket);
    setIsResolutionModalOpen(false);
    form.resetFields();
  };

  return (
    <MainLayout>
      <>
        <Space
          direction="horizontal"
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Title level={2}>Chamado #{params.id}</Title>
          <Button onClick={() => router.push("/tickets")}>Voltar</Button>
        </Space>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card>
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="large"
              >
                <div>
                  <Title level={4}>{ticket.title}</Title>
                  <Paragraph>{ticket.description}</Paragraph>
                </div>

                <Steps
                  current={getStatusStep(ticket.status)}
                  items={[
                    {
                      title: "Aberto",
                      icon: <ExclamationCircleOutlined />,
                    },
                    {
                      title: "Em Atendimento",
                      icon: <ClockCircleOutlined />,
                    },
                    {
                      title: "Resolvido",
                      icon: <CheckCircleOutlined />,
                    },
                    {
                      title: "Fechado",
                      icon: <CheckCircleOutlined />,
                    },
                  ]}
                />

                <Space>
                  <Button
                    type="primary"
                    icon={<MessageOutlined />}
                    onClick={() => setIsCommentModalOpen(true)}
                  >
                    Adicionar Comentário
                  </Button>
                  {ticket.status !== "Resolvido" && (
                    <Button
                      type="primary"
                      icon={<SolutionOutlined />}
                      onClick={() => setIsResolutionModalOpen(true)}
                    >
                      Registrar Resolução
                    </Button>
                  )}
                </Space>

                <Divider orientation="left">Histórico</Divider>
                <Timeline
                  items={ticket.comments.map((comment) => ({
                    color:
                      comment.type === "resolution"
                        ? "green"
                        : comment.type === "status_change"
                        ? "blue"
                        : "gray",
                    children: (
                      <div key={comment.id}>
                        <Text strong>{comment.user}</Text>
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                          {new Date(comment.timestamp).toLocaleString()}
                        </Text>
                        <br />
                        <Text>{comment.content}</Text>
                      </div>
                    ),
                  }))}
                />
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Card title="Informações do Chamado">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Text strong>Status: </Text>
                    <Tag
                      icon={getStatusIcon(ticket.status)}
                      color={getStatusColor(ticket.status)}
                    >
                      {ticket.status}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>Prioridade: </Text>
                    <Tag color={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>Categoria: </Text>
                    <Tag>{ticket.category}</Tag>
                  </div>
                  <div>
                    <Text strong>Criado em: </Text>
                    <Text>{new Date(ticket.createdAt).toLocaleString()}</Text>
                  </div>
                  <div>
                    <Text strong>Última atualização: </Text>
                    <Text>{new Date(ticket.updatedAt).toLocaleString()}</Text>
                  </div>
                </Space>
              </Card>

              <Card title="Informações do Solicitante">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Text strong>Nome: </Text>
                    <Text>{ticket.requester}</Text>
                  </div>
                  <div>
                    <Text strong>Departamento: </Text>
                    <Text>{ticket.department}</Text>
                  </div>
                </Space>
              </Card>

              <Card title="Atendimento">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Text strong>Atribuído para: </Text>
                    <Text>{ticket.assignedTo || "Não atribuído"}</Text>
                  </div>
                  {ticket.status !== "Fechado" && (
                    <Select
                      style={{ width: "100%" }}
                      value={ticket.status}
                      onChange={handleStatusChange}
                    >
                      <Select.Option value="Aberto">Aberto</Select.Option>
                      <Select.Option value="Em Atendimento">
                        Em Atendimento
                      </Select.Option>
                      <Select.Option value="Resolvido">Resolvido</Select.Option>
                      <Select.Option value="Fechado">Fechado</Select.Option>
                    </Select>
                  )}
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>

        <Modal
          title="Adicionar Comentário"
          open={isCommentModalOpen}
          onCancel={() => setIsCommentModalOpen(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleCommentSubmit}>
            <Form.Item
              name="content"
              rules={[
                { required: true, message: "Por favor, insira um comentário" },
              ]}
            >
              <TextArea rows={4} placeholder="Digite seu comentário..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Adicionar
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Registrar Resolução"
          open={isResolutionModalOpen}
          onCancel={() => setIsResolutionModalOpen(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleResolutionSubmit}>
            <Form.Item
              name="resolution"
              rules={[
                { required: true, message: "Por favor, descreva a resolução" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Descreva como o problema foi resolvido..."
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Registrar
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    </MainLayout>
  );
};

export default TicketDetailPage;
