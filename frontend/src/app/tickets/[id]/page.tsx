"use client";
import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Steps,
  Timeline,
  Form,
  Input,
  Modal,
  message,
  Divider,
  Select,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  MessageOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import MainLayout from "@/components/MainLayout";
import { useRouter, useParams } from "next/navigation";
import { ticketsService, Ticket, Comment } from "@/services/tickets.service";
import {
  getTicketComments,
  addComment,
  deleteComment,
} from "@/services/tickets";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CommentSection } from "../components/CommentSection";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const { Title, Text } = Typography;
const { TextArea } = Input;

const TicketDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignee, setAssignee] = useState("");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Lista de técnicos de TI (exemplo)
  const techniciansList = [
    "João Silva",
    "Maria Oliveira",
    "Pedro Santos",
    "Ana Costa",
    "Carlos Ferreira",
  ];

  useEffect(() => {
    fetchTicket();
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const ticketData = await ticketsService.getTicket(params.id);
      setTicket(ticketData);
      const commentsData = await getTicketComments(params.id);
      setComments(commentsData);
    } catch (error) {
      message.error("Erro ao carregar o ticket");
      router.push("/tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: Ticket["status"]) => {
    if (!ticket) return;

    try {
      await ticketsService.updateTicket(ticket.id, { status: newStatus });
      message.success("Status atualizado com sucesso");
      fetchTicket();
    } catch (error) {
      message.error("Erro ao atualizar o status");
    }
  };

  const handleCommentSubmit = async (values: { content: string }) => {
    if (!ticket) return;

    try {
      await addComment({
        content: values.content,
        ticketId: ticket._id,
      });
      message.success("Comentário adicionado com sucesso");
      setIsCommentModalOpen(false);
      form.resetFields();
      fetchTicket();
    } catch (error) {
      message.error("Erro ao adicionar comentário");
    }
  };

  const handleResolutionSubmit = async (values: { resolution: string }) => {
    if (!ticket) return;

    try {
      await ticketsService.updateTicket(ticket.id, {
        status: "Resolvido",
        resolution: values.resolution,
      });
      message.success("Ticket resolvido com sucesso");
      setIsResolutionModalOpen(false);
      form.resetFields();
      fetchTicket();
    } catch (error) {
      message.error("Erro ao resolver o ticket");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !ticket) return;

    try {
      await addComment({
        content: newComment,
        ticketId: ticket._id,
      });
      message.success("Comentário adicionado com sucesso");
      setNewComment("");
      fetchTicket();
    } catch (error) {
      message.error("Erro ao adicionar comentário");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
      fetchTicket();
    } catch (error) {
      message.error("Erro ao excluir comentário");
    }
  };

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

  const handleAssignTicket = async (values: { assignee: string }) => {
    if (!ticket) return;

    try {
      await ticketsService.updateTicket(ticket.id, {
        assignee: values.assignee,
        status: "Em Atendimento",
      });
      messageApi.success("Chamado atribuído com sucesso");
      setIsAssignModalOpen(false);
      form.resetFields();
      fetchTicket();
    } catch (error) {
      messageApi.error("Erro ao atribuir o chamado");
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!ticket) return;

    try {
      await ticketsService.updateTicket(ticket.id, { priority: newPriority });
      messageApi.success("Prioridade atualizada com sucesso");
      fetchTicket();
    } catch (error) {
      messageApi.error("Erro ao atualizar a prioridade");
    }
  };

  if (loading || !ticket) {
    return (
      <MainLayout>
        <Card loading={true} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {contextHolder}
      <>
        <Space
          direction="horizontal"
          style={{
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Title level={2}>Ticket #{params.id}</Title>
          <Button onClick={() => router.push("/tickets")}>Voltar</Button>
        </Space>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Detalhes do Ticket">
              <Title level={4}>{ticket?.title}</Title>
              <Text>{ticket?.description}</Text>

              <Divider />

              <Steps
                current={getStatusStep(ticket?.status || "Aberto")}
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
                    icon: <StopOutlined />,
                  },
                ]}
              />

              <Divider />

              <Space direction="vertical" style={{ width: "100%" }}>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => setIsAssignModalOpen(true)}
                    disabled={
                      ticket?.status === "Fechado" ||
                      ticket?.status === "Resolvido"
                    }
                  >
                    Atribuir Chamado
                  </Button>

                  <Button
                    onClick={() => handleStatusChange("Em Atendimento")}
                    disabled={
                      ticket?.status === "Em Atendimento" ||
                      ticket?.status === "Resolvido" ||
                      ticket?.status === "Fechado"
                    }
                  >
                    Iniciar Atendimento
                  </Button>

                  <Button
                    type="primary"
                    onClick={() => setIsResolutionModalOpen(true)}
                    disabled={
                      ticket?.status === "Resolvido" ||
                      ticket?.status === "Fechado"
                    }
                  >
                    Resolver Chamado
                  </Button>

                  <Button
                    danger
                    onClick={() => handleStatusChange("Fechado")}
                    disabled={ticket?.status !== "Resolvido"}
                  >
                    Fechar Chamado
                  </Button>
                </Space>
              </Space>
            </Card>

            <Card title="Comentários" style={{ marginTop: 16 }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <TextArea
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Adicione um comentário..."
                />
                <Button
                  type="primary"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Adicionar Comentário
                </Button>
              </Space>

              <Divider />

              <CommentSection
                comments={comments}
                onDeleteComment={handleDeleteComment}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Informações do Chamado">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>Status: </Text>
                  <Tag color={getStatusColor(ticket?.status || "Aberto")}>
                    {ticket?.status || "Aberto"}
                  </Tag>
                </div>

                <div>
                  <Text strong>Prioridade: </Text>
                  <Select
                    value={ticket?.priority || "Média"}
                    style={{ width: 120 }}
                    onChange={handlePriorityChange}
                    disabled={ticket?.status === "Fechado"}
                  >
                    <Select.Option value="Baixa">Baixa</Select.Option>
                    <Select.Option value="Média">Média</Select.Option>
                    <Select.Option value="Alta">Alta</Select.Option>
                  </Select>
                </div>

                <div>
                  <Text strong>Setor: </Text>
                  <span>{ticket?.sector}</span>
                </div>

                <div>
                  <Text strong>Criado por: </Text>
                  <span>{ticket?.createdBy || "Não informado"}</span>
                </div>

                <div>
                  <Text strong>Atribuído para: </Text>
                  <span>{ticket?.assignee || "Não atribuído"}</span>
                </div>

                <div>
                  <Text strong>Data de Criação: </Text>
                  <span>
                    {ticket?.createdAt
                      ? format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", {
                          locale: ptBR,
                        })
                      : ""}
                  </span>
                </div>

                <div>
                  <Text strong>Última Atualização: </Text>
                  <span>
                    {ticket?.updatedAt
                      ? format(new Date(ticket.updatedAt), "dd/MM/yyyy HH:mm", {
                          locale: ptBR,
                        })
                      : ""}
                  </span>
                </div>

                {ticket?.resolution && (
                  <div>
                    <Text strong>Resolução: </Text>
                    <p>{ticket.resolution}</p>
                  </div>
                )}
              </Space>
            </Card>

            <Card title="Histórico" style={{ marginTop: 16 }}>
              <Timeline
                items={[
                  {
                    color: "blue",
                    children: (
                      <>
                        <Text strong>Chamado Aberto</Text>
                        <br />
                        <Text>
                          {ticket?.createdAt
                            ? format(
                                new Date(ticket.createdAt),
                                "dd/MM/yyyy HH:mm",
                                { locale: ptBR }
                              )
                            : ""}
                        </Text>
                      </>
                    ),
                  },
                  ...(ticket?.status !== "Aberto"
                    ? [
                        {
                          color: "orange",
                          children: (
                            <>
                              <Text strong>Em Atendimento</Text>
                              <br />
                              <Text>
                                {ticket?.updatedAt
                                  ? format(
                                      new Date(ticket.updatedAt),
                                      "dd/MM/yyyy HH:mm",
                                      { locale: ptBR }
                                    )
                                  : ""}
                              </Text>
                            </>
                          ),
                        },
                      ]
                    : []),
                  ...(ticket?.status === "Resolvido" ||
                  ticket?.status === "Fechado"
                    ? [
                        {
                          color: "green",
                          children: (
                            <>
                              <Text strong>Resolvido</Text>
                              <br />
                              <Text>
                                {ticket?.updatedAt
                                  ? format(
                                      new Date(ticket.updatedAt),
                                      "dd/MM/yyyy HH:mm",
                                      { locale: ptBR }
                                    )
                                  : ""}
                              </Text>
                            </>
                          ),
                        },
                      ]
                    : []),
                  ...(ticket?.status === "Fechado"
                    ? [
                        {
                          color: "gray",
                          children: (
                            <>
                              <Text strong>Fechado</Text>
                              <br />
                              <Text>
                                {ticket?.updatedAt
                                  ? format(
                                      new Date(ticket.updatedAt),
                                      "dd/MM/yyyy HH:mm",
                                      { locale: ptBR }
                                    )
                                  : ""}
                              </Text>
                            </>
                          ),
                        },
                      ]
                    : []),
                ]}
              />
            </Card>
          </Col>
        </Row>

        {/* Modal para adicionar resolução */}
        <Modal
          title="Resolver Chamado"
          open={isResolutionModalOpen}
          onCancel={() => setIsResolutionModalOpen(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleResolutionSubmit} layout="vertical">
            <Form.Item
              name="resolution"
              label="Descrição da Resolução"
              rules={[
                {
                  required: true,
                  message: "Por favor, descreva como o problema foi resolvido",
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Resolver Chamado
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal para atribuir chamado */}
        <Modal
          title="Atribuir Chamado"
          open={isAssignModalOpen}
          onCancel={() => setIsAssignModalOpen(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleAssignTicket} layout="vertical">
            <Form.Item
              name="assignee"
              label="Técnico Responsável"
              rules={[
                {
                  required: true,
                  message: "Por favor, selecione um técnico",
                },
              ]}
            >
              <Select placeholder="Selecione um técnico">
                {techniciansList.map((tech) => (
                  <Select.Option key={tech} value={tech}>
                    {tech}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Atribuir
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    </MainLayout>
  );
};

export default TicketDetailPage;
