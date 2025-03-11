"use client";
import { useState } from "react";
import {
  Layout,
  Card,
  Avatar,
  Typography,
  Descriptions,
  Button,
  Form,
  Input,
  message,
  Divider,
  Row,
  Col,
  Tag,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  EditOutlined,
  CloudOutlined,
  DatabaseOutlined,
  DollarOutlined,
  FileProtectOutlined,
  ToolOutlined,
  WindowsOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;

interface UserData {
  name: string;
  email: string;
  department: string;
  role: string;
  phone: string;
  joinDate: string;
  lastAccess: string;
}

interface Application {
  name: string;
  icon: React.ReactNode;
  description: string;
  status: "active" | "inactive" | "pending";
  type: string;
}

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm<UserData>();

  // Dados mockados do usuário
  const userData: UserData = {
    name: "João Silva",
    email: "joao.silva@empresa.com",
    department: "TI",
    role: "Analista de Suporte",
    phone: "(11) 98765-4321",
    joinDate: "01/01/2023",
    lastAccess: "07/03/2024 15:30",
  };

  // Lista de aplicações empresariais
  const applications: Application[] = [
    {
      name: "SAP ERP",
      icon: <WindowsOutlined />,
      description: "Sistema de Gestão Empresarial",
      status: "active",
      type: "ERP",
    },
    {
      name: "Salesforce",
      icon: <CloudOutlined />,
      description: "CRM e Gestão de Vendas",
      status: "active",
      type: "CRM",
    },
    {
      name: "Oracle Database",
      icon: <DatabaseOutlined />,
      description: "Banco de Dados Corporativo",
      status: "active",
      type: "Database",
    },
    {
      name: "Jira",
      icon: <ToolOutlined />,
      description: "Gestão de Projetos e Tickets",
      status: "active",
      type: "Project Management",
    },
    {
      name: "Microsoft 365",
      icon: <WindowsOutlined />,
      description: "Suite de Produtividade",
      status: "active",
      type: "Office Suite",
    },
    {
      name: "ADP Folha",
      icon: <DollarOutlined />,
      description: "Sistema de Folha de Pagamento",
      status: "active",
      type: "HR",
    },
    {
      name: "Confluence",
      icon: <FileProtectOutlined />,
      description: "Base de Conhecimento",
      status: "active",
      type: "Documentation",
    },
    {
      name: "Power BI",
      icon: <WindowsOutlined />,
      description: "Análise de Dados e Relatórios",
      status: "active",
      type: "Business Intelligence",
    },
  ];

  const getStatusColor = (status: Application["status"]) => {
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

  const onFinish = (values: UserData) => {
    console.log("Valores atualizados:", values);
    message.success("Perfil atualizado com sucesso!");
    setIsEditing(false);
  };

  return (
    <Content style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      <Card>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} sm={8} style={{ textAlign: "center" }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff" }}
            />
            <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
              {userData.name}
            </Title>
            <Typography.Text type="secondary">{userData.role}</Typography.Text>
          </Col>
          <Col xs={24} sm={16}>
            {!isEditing ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 16,
                  }}
                >
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Perfil
                  </Button>
                </div>
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Email">
                    <MailOutlined /> {userData.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Departamento">
                    <TeamOutlined /> {userData.department}
                  </Descriptions.Item>
                  <Descriptions.Item label="Telefone">
                    <PhoneOutlined /> {userData.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Data de Admissão">
                    {userData.joinDate}
                  </Descriptions.Item>
                  <Descriptions.Item label="Último Acesso">
                    {userData.lastAccess}
                  </Descriptions.Item>
                </Descriptions>
              </>
            ) : (
              <Form
                form={form}
                layout="vertical"
                initialValues={userData}
                onFinish={onFinish}
              >
                <Form.Item
                  name="name"
                  label="Nome"
                  rules={[
                    { required: true, message: "Por favor, insira seu nome" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Por favor, insira seu email" },
                    { type: "email", message: "Email inválido" },
                  ]}
                >
                  <Input prefix={<MailOutlined />} />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Telefone"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, insira seu telefone",
                    },
                  ]}
                >
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Salvar
                  </Button>
                  <Button
                    style={{ marginLeft: 8 }}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Atividades Recentes" size="small">
              <ul>
                <li>Chamado #123 resolvido - 07/03/2024</li>
                <li>Chamado #122 aberto - 06/03/2024</li>
                <li>Atualização de perfil - 05/03/2024</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Estatísticas" size="small">
              <ul>
                <li>Chamados Resolvidos: 45</li>
                <li>Chamados em Andamento: 3</li>
                <li>Tempo Médio de Resolução: 2.5 horas</li>
              </ul>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Card title="Aplicações Empresariais" style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            {applications.map((app, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card size="small" hoverable>
                  <div style={{ textAlign: "center", marginBottom: 8 }}>
                    <Avatar
                      size={48}
                      icon={app.icon}
                      style={{
                        backgroundColor: "#1890ff",
                        marginBottom: 8,
                      }}
                    />
                    <div>
                      <Typography.Text strong>{app.name}</Typography.Text>
                    </div>
                    <div>
                      <Typography.Text
                        type="secondary"
                        style={{ fontSize: "12px" }}
                      >
                        {app.type}
                      </Typography.Text>
                    </div>
                    <Tooltip title={app.description}>
                      <Tag
                        color={getStatusColor(app.status)}
                        style={{ marginTop: 8 }}
                      >
                        {app.status.toUpperCase()}
                      </Tag>
                    </Tooltip>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Card>
    </Content>
  );
};

export default ProfilePage;
