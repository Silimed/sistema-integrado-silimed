"use client";
import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  App,
  message,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CalendarOutlined,
  RightOutlined,
} from "@ant-design/icons";
import MainLayout from "@/components/MainLayout";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "react-beautiful-dnd";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { AuthService } from "@/services/auth";
import axios from "axios";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "alta" | "media" | "baixa";
  assignee: string;
  dueDate: string;
  status: "backlog" | "todo" | "doing" | "done";
}

type PriorityColors = {
  [K in Task["priority"]]: string;
};

const KanbanPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Implementar autenticação",
      description: "Adicionar sistema de login com OAuth",
      priority: "alta",
      assignee: "Arthur Lima",
      dueDate: "2024-03-20",
      status: "todo",
    },
    {
      id: "2",
      title: "Criar dashboard",
      description: "Desenvolver painéis de visualização",
      priority: "media",
      assignee: "Reinaldo Scagliera",
      dueDate: "2024-03-25",
      status: "doing",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        if (!AuthService.isAuthenticated()) {
          message.error("Sessão expirada. Por favor, faça login novamente.");
          router.push("/login");
          return;
        }

        // Configura os interceptors do Axios
        AuthService.setupAxiosInterceptors();

        const token = AuthService.getAuthToken();
        if (!token) {
          throw new Error("Token não encontrado");
        }

        const response = await axios.post(
          "/auth/validate",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.data.valid) {
          throw new Error("Token inválido");
        }

        const userGroups = response.data.payload.groups || [];
        const isTIUser = userGroups.some((group: string) =>
          group.includes("/Setores/TI")
        );

        if (!isTIUser) {
          message.error("Acesso restrito ao setor de TI.");
          router.push("/dashboard");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro na verificação de acesso:", error);
        message.error("Erro ao verificar permissões. Redirecionando...");
        router.push("/dashboard");
      }
    };

    verifyAccess();
  }, [router]);

  const columns = [
    { id: "backlog", title: "Backlog" },
    { id: "todo", title: "A Fazer" },
    { id: "doing", title: "Em Andamento" },
    { id: "done", title: "Concluído" },
  ];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    reorderedItem.status = result.destination.droppableId as Task["status"];
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
    message.success("Demanda movida com sucesso!");
  };

  const moveTask = (taskId: string, currentStatus: Task["status"]) => {
    const statusOrder = ["backlog", "todo", "doing", "done"];
    const currentIndex = statusOrder.indexOf(currentStatus);

    if (currentIndex < statusOrder.length - 1) {
      const nextStatus = statusOrder[currentIndex + 1] as Task["status"];
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: nextStatus } : task
        )
      );
      message.success(`Demanda movida para ${getStatusLabel(nextStatus)}`);
    }
  };

  const getStatusLabel = (status: Task["status"]) => {
    const labels = {
      backlog: "Backlog",
      todo: "A Fazer",
      doing: "Em Andamento",
      done: "Concluído",
    };
    return labels[status];
  };

  const showModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue(task);
    } else {
      setEditingTask(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingTask) {
        setTasks(
          tasks.map((t) =>
            t.id === editingTask.id ? { ...values, id: t.id } : t
          )
        );
        message.success("Tarefa atualizada com sucesso!");
      } else {
        const newTask = {
          ...values,
          id: Date.now().toString(),
          status: "backlog" as Task["status"],
        };
        setTasks([...tasks, newTask]);
        message.success("Tarefa criada com sucesso!");
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    message.success("Tarefa removida com sucesso!");
  };

  const priorityColors: PriorityColors = {
    alta: "red",
    media: "orange",
    baixa: "green",
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    return priorityColors[priority];
  };

  if (loading) {
    return (
      <MainLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <App>
      <MainLayout>
        <div style={{ padding: "20px" }}>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 20 }}
          >
            <Title level={2}>Kanban de Demandas</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Nova Demanda
            </Button>
          </Row>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Row gutter={16}>
              {columns.map((column) => (
                <Col span={6} key={column.id}>
                  <Card title={column.title} variant="outlined">
                    <Droppable droppableId={column.id} isDropDisabled={false}>
                      {(provided: DroppableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{ minHeight: 500 }}
                        >
                          {tasks
                            .filter((task) => task.status === column.id)
                            .map((task, index) => (
                              <Draggable
                                key={task.id}
                                draggableId={task.id}
                                index={index}
                              >
                                {(provided: DraggableProvided) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    size="small"
                                    variant="outlined"
                                    style={{ marginBottom: 8 }}
                                  >
                                    <div>
                                      <Text strong>{task.title}</Text>
                                      <div style={{ marginTop: 8 }}>
                                        <Tag
                                          color={getPriorityColor(
                                            task.priority
                                          )}
                                        >
                                          {task.priority.toUpperCase()}
                                        </Tag>
                                      </div>
                                      <div style={{ marginTop: 8 }}>
                                        <Space>
                                          <UserOutlined /> {task.assignee}
                                        </Space>
                                      </div>
                                      <div style={{ marginTop: 8 }}>
                                        <Space>
                                          <CalendarOutlined />{" "}
                                          {dayjs(task.dueDate).format(
                                            "DD/MM/YYYY"
                                          )}
                                        </Space>
                                      </div>
                                      <div style={{ marginTop: 8 }}>
                                        <Space>
                                          <Button
                                            type="text"
                                            icon={<EditOutlined />}
                                            onClick={() => showModal(task)}
                                          />
                                          <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() =>
                                              handleDeleteTask(task.id)
                                            }
                                          />
                                          {task.status !== "done" && (
                                            <Button
                                              type="text"
                                              icon={<RightOutlined />}
                                              onClick={() =>
                                                moveTask(task.id, task.status)
                                              }
                                              title={`Mover para ${getStatusLabel(
                                                columns[
                                                  columns.findIndex(
                                                    (col) =>
                                                      col.id === task.status
                                                  ) + 1
                                                ]?.id as Task["status"]
                                              )}`}
                                            />
                                          )}
                                        </Space>
                                      </div>
                                    </div>
                                  </Card>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Card>
                </Col>
              ))}
            </Row>
          </DragDropContext>

          <Modal
            title={editingTask ? "Editar Demanda" : "Nova Demanda"}
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={() => setIsModalVisible(false)}
            width={600}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="title"
                label="Título"
                rules={[
                  { required: true, message: "Por favor, insira um título" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Descrição"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira uma descrição",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
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
                      <Option value="alta">Alta</Option>
                      <Option value="media">Média</Option>
                      <Option value="baixa">Baixa</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="assignee"
                    label="Responsável"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, selecione um responsável",
                      },
                    ]}
                  >
                    <Select>
                      <Option value="Arthur Lima">Arthur Lima</Option>
                      <Option value="Vitoria Cerri">Vitoria Cerri</Option>
                      <Option value="Reinaldo Scagliera">
                        Reinaldo Scagliera
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="dueDate"
                label="Data de Entrega"
                rules={[
                  { required: true, message: "Por favor, selecione uma data" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </MainLayout>
    </App>
  );
};

export default KanbanPage;
