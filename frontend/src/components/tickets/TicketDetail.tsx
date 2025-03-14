import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Ticket,
  UpdateTicketDto,
  AddCommentDto,
  TicketStatus,
  TicketPriority,
  Comment,
} from "../../interfaces/ticket.interface";
import { TicketService } from "../../services/ticket.service";
import {
  Card,
  Typography,
  Descriptions,
  Tag,
  Button,
  Space,
  Divider,
  Form,
  Input,
  Select,
  Spin,
  Alert,
  List,
  Avatar,
  message,
  Modal,
  Tabs,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  SendOutlined,
  DeleteOutlined,
  UserOutlined,
  HistoryOutlined,
  CommentOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

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

export const TicketDetail: React.FC<{ ticketId: string }> = ({ ticketId }) => {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateTicketDto>({});
  const [newComment, setNewComment] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await TicketService.getTicketById(ticketId);
        setTicket(data);
        setUpdateData({
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          sector: data.sector,
          assignedTo: data.assignedTo,
        });
        form.setFieldsValue({
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          sector: data.sector,
          assignedTo: data.assignedTo || "",
        });
      } catch (err: unknown) {
        console.error("Erro ao carregar ticket:", err);
        setError("Erro ao carregar o ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, form]);

  const handleUpdateChange = (changedValues: any, allValues: any) => {
    setUpdateData(allValues);
  };

  const handleUpdate = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      await TicketService.updateTicket(ticketId, values);

      const updatedTicket = await TicketService.getTicketById(ticketId);
      setTicket(updatedTicket);
      setEditMode(false);
      messageApi.success("Ticket atualizado com sucesso!");
    } catch (err: unknown) {
      console.error("Erro ao atualizar ticket:", err);
      messageApi.error("Erro ao atualizar o ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      messageApi.warning("O comentário não pode estar vazio");
      return;
    }

    try {
      setSubmitting(true);
      const commentData: AddCommentDto = { content: newComment };
      await TicketService.addComment(ticketId, commentData);

      const updatedTicket = await TicketService.getTicketById(ticketId);
      setTicket(updatedTicket);
      setNewComment("");
      messageApi.success("Comentário adicionado com sucesso!");
    } catch (err: unknown) {
      console.error("Erro ao adicionar comentário:", err);
      messageApi.error("Erro ao adicionar comentário");
    } finally {
      setSubmitting(false);
    }
  };

  const showDeleteModal = (commentId: string) => {
    setDeleteCommentId(commentId);
    setDeleteModalVisible(true);
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentId) return;

    try {
      setSubmitting(true);
      await TicketService.deleteComment(deleteCommentId);

      const updatedTicket = await TicketService.getTicketById(ticketId);
      setTicket(updatedTicket);
      messageApi.success("Comentário excluído com sucesso!");
    } catch (err: unknown) {
      console.error("Erro ao excluir comentário:", err);
      messageApi.error("Erro ao excluir comentário");
    } finally {
      setSubmitting(false);
      setDeleteModalVisible(false);
      setDeleteCommentId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Carregando ticket..." />
      </div>
    );

  if (error)
    return <Alert message="Erro" description={error} type="error" showIcon />;

  if (!ticket)
    return (
      <Alert
        message="Ticket não encontrado"
        description="O ticket solicitado não foi encontrado"
        type="warning"
        showIcon
      />
    );

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "Aberto";
      case TicketStatus.IN_PROGRESS:
        return "Em Progresso";
      case TicketStatus.RESOLVED:
        return "Resolvido";
      case TicketStatus.CLOSED:
        return "Fechado";
    }
  };

  const getPriorityLabel = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return "Baixa";
      case TicketPriority.MEDIUM:
        return "Média";
      case TicketPriority.HIGH:
        return "Alta";
      case TicketPriority.URGENT:
        return "Urgente";
    }
  };

  const renderComment = (comment: Comment) => (
    <div className="flex">
      <div className="mr-4">
        <Avatar icon={<UserOutlined />} />
      </div>
      <div>
        <Text strong>{comment.createdBy}</Text>
        <div>{comment.content}</div>
        <Text type="secondary">
          {new Date(comment.createdAt).toLocaleString("pt-BR")}
        </Text>
      </div>
    </div>
  );

  return (
    <Card className="shadow-md">
      {contextHolder}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <Title level={4} className="m-0">
            {editMode ? "Editar Ticket" : ticket.title}
          </Title>
          {!editMode && (
            <div className="mt-1">
              <Space>
                <Tag color={statusColors[ticket.status]}>
                  {getStatusLabel(ticket.status)}
                </Tag>
                <Tag color={priorityColors[ticket.priority]}>
                  {getPriorityLabel(ticket.priority)}
                </Tag>
              </Space>
            </div>
          )}
        </div>
        {!editMode && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setEditMode(true)}
          >
            Editar
          </Button>
        )}
      </div>

      <Divider />

      {editMode ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          onValuesChange={handleUpdateChange}
        >
          <Row gutter={16}>
            <Col xs={24} md={24}>
              <Form.Item
                name="title"
                label="Título"
                rules={[
                  { required: true, message: "Por favor, informe o título" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="description"
                label="Descrição"
                rules={[
                  { required: true, message: "Por favor, informe a descrição" },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[
                  { required: true, message: "Por favor, selecione o status" },
                ]}
              >
                <Select>
                  {Object.values(TicketStatus).map((status) => (
                    <Option key={status} value={status}>
                      {getStatusLabel(status)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="priority"
                label="Prioridade"
                rules={[
                  {
                    required: true,
                    message: "Por favor, selecione a prioridade",
                  },
                ]}
              >
                <Select>
                  {Object.values(TicketPriority).map((priority) => (
                    <Option key={priority} value={priority}>
                      {getPriorityLabel(priority)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="sector"
                label="Setor"
                rules={[
                  { required: true, message: "Por favor, informe o setor" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="assignedTo" label="Atribuído para">
                <Input placeholder="Nome do responsável (opcional)" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<SaveOutlined />}
              >
                Salvar
              </Button>
              <Button
                onClick={() => setEditMode(false)}
                icon={<CloseOutlined />}
              >
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ) : (
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <InfoCircleOutlined /> Informações
              </span>
            }
            key="1"
          >
            <Descriptions bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="ID">{ticket.id}</Descriptions.Item>
              <Descriptions.Item label="Criado por">
                {ticket.createdBy}
              </Descriptions.Item>
              <Descriptions.Item label="Setor">
                {ticket.sector}
              </Descriptions.Item>
              <Descriptions.Item label="Atribuído para">
                {ticket.assignedTo || "Não atribuído"}
              </Descriptions.Item>
              <Descriptions.Item label="Criado em">
                {new Date(ticket.createdAt).toLocaleString("pt-BR")}
              </Descriptions.Item>
              <Descriptions.Item label="Atualizado em">
                {new Date(ticket.updatedAt).toLocaleString("pt-BR")}
              </Descriptions.Item>
              <Descriptions.Item label="Descrição" span={2}>
                <Paragraph>{ticket.description}</Paragraph>
              </Descriptions.Item>
            </Descriptions>
          </TabPane>

          <TabPane
            tab={
              <span>
                <CommentOutlined /> Comentários ({ticket.comments?.length || 0})
              </span>
            }
            key="2"
          >
            <div className="mb-4">
              <Form.Item>
                <TextArea
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Adicione um comentário..."
                />
              </Form.Item>
              <Button
                type="primary"
                onClick={handleAddComment}
                loading={submitting}
                icon={<SendOutlined />}
              >
                Adicionar Comentário
              </Button>
            </div>

            <Divider />

            <List
              itemLayout="horizontal"
              dataSource={ticket.comments || []}
              locale={{ emptyText: "Nenhum comentário ainda" }}
              renderItem={(comment: Comment) => (
                <List.Item
                  actions={[
                    <Button
                      key="delete"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteModal(comment.id!)}
                    >
                      Excluir
                    </Button>,
                  ]}
                >
                  {renderComment(comment)}
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <HistoryOutlined /> Histórico
              </span>
            }
            key="3"
          >
            <Alert
              message="Histórico de Alterações"
              description="O histórico detalhado de alterações estará disponível em breve."
              type="info"
              showIcon
            />
          </TabPane>
        </Tabs>
      )}

      <Modal
        title="Confirmar exclusão"
        open={deleteModalVisible}
        onOk={handleDeleteComment}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Sim, excluir"
        cancelText="Cancelar"
        okButtonProps={{ danger: true, loading: submitting }}
      >
        <p>Tem certeza que deseja excluir este comentário?</p>
        <p>Esta ação não pode ser desfeita.</p>
      </Modal>
    </Card>
  );
};
