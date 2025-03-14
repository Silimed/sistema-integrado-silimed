import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  CreateTicketDto,
  TicketPriority,
} from "../../interfaces/ticket.interface";
import { TicketService } from "../../services/ticket.service";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Space,
  message,
  Divider,
  Row,
  Col,
} from "antd";
import {
  SaveOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const CreateTicket: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sectors, setSectors] = useState<string[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // Aqui você poderia carregar os setores de uma API
    // Por enquanto, vamos usar alguns setores de exemplo
    setSectors(["TI", "RH", "Financeiro", "Marketing", "Operações", "Suporte"]);
  }, []);

  const handleSubmit = async (values: CreateTicketDto) => {
    setLoading(true);

    try {
      await TicketService.createTicket(values);
      messageApi.success("Ticket criado com sucesso!");
      router.push("/tickets");
    } catch (err: unknown) {
      console.error("Erro ao criar ticket:", err);
      messageApi.error("Erro ao criar o ticket. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      {contextHolder}
      <div className="mb-6">
        <Title level={4}>Criar Novo Ticket</Title>
        <Divider />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          priority: TicketPriority.MEDIUM,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={24}>
            <Form.Item
              name="title"
              label="Título"
              rules={[
                {
                  required: true,
                  message: "Por favor, informe o título do ticket",
                },
                {
                  min: 5,
                  message: "O título deve ter pelo menos 5 caracteres",
                },
              ]}
            >
              <Input placeholder="Digite o título do ticket" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="description"
              label="Descrição"
              rules={[
                {
                  required: true,
                  message: "Por favor, informe a descrição do ticket",
                },
                {
                  min: 10,
                  message: "A descrição deve ter pelo menos 10 caracteres",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Descreva detalhadamente o problema ou solicitação"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
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
              <Select placeholder="Selecione a prioridade">
                <Option value={TicketPriority.LOW}>Baixa</Option>
                <Option value={TicketPriority.MEDIUM}>Média</Option>
                <Option value={TicketPriority.HIGH}>Alta</Option>
                <Option value={TicketPriority.URGENT}>Urgente</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="sector"
              label="Setor"
              rules={[
                { required: true, message: "Por favor, selecione o setor" },
              ]}
            >
              <Select placeholder="Selecione o setor">
                {sectors.map((sector) => (
                  <Option key={sector} value={sector}>
                    {sector}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="assignedTo" label="Atribuir para (opcional)">
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
              loading={loading}
              icon={<SaveOutlined />}
            >
              Criar Ticket
            </Button>
            <Button onClick={() => router.back()} icon={<RollbackOutlined />}>
              Cancelar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
