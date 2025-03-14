"use client";
import { useState, useEffect } from "react";
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
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { AuthService } from "@/services/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";

const { Content } = Layout;
const { Title } = Typography;

interface UserPayload {
  sub: string;
  email: string;
  name: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  groups?: string[];
  roles?: string[];
}

interface UserData {
  valid: boolean;
  payload: UserPayload;
  setores: string[];
}

interface Application {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  setoresPermitidos: string[];
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
}

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDataAndApplications = async () => {
      try {
        setLoading(true);
        const isAuthenticated = AuthService.isAuthenticated();

        if (!isAuthenticated) {
          message.error("Sessão expirada. Por favor, faça login novamente.");
          router.push("/login");
          return;
        }

        // Configura os interceptors do Axios
        AuthService.setupAxiosInterceptors();

        // Valida o token e obtém os dados do usuário
        const token = AuthService.getAuthToken();
        if (!token) {
          throw new Error("Token não encontrado");
        }

        const validationResponse = await axios.post(
          "/auth/validate",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!validationResponse.data.valid) {
          message.error("Token inválido. Por favor, faça login novamente.");
          AuthService.removeToken();
          router.push("/login");
          return;
        }

        // Armazena os dados do usuário
        setUserData(validationResponse.data);

        // Inicializa o formulário com os dados do usuário
        form.setFieldsValue({
          name: validationResponse.data.payload.name,
          email: validationResponse.data.payload.email,
          phone: "", // O telefone não vem no token, então mantemos vazio
        });

        // Busca as aplicações disponíveis
        try {
          const response = await axios.get("/applications", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setApplications(response.data);
        } catch (appError) {
          console.error("Erro na busca de aplicações:", appError);

          // Se falhar, tenta o endpoint alternativo com guard
          if (
            axios.isAxiosError(appError) &&
            appError.response?.status === 401
          ) {
            try {
              const guardResponse = await axios.get("/applications/guard", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setApplications(guardResponse.data);
            } catch (guardError) {
              console.error("Erro também no endpoint com guard:", guardError);
              throw guardError;
            }
          } else {
            throw appError;
          }
        }
      } catch (error) {
        console.error("Erro ao obter dados:", error);
        message.error(
          "Erro ao carregar dados do perfil. Por favor, tente novamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndApplications();
  }, [router, form]);

  const onFinish = (values: FormValues) => {
    console.log("Valores atualizados:", values);
    message.success("Perfil atualizado com sucesso!");
    setIsEditing(false);
  };

  const handleCardClick = (url: string) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank");
    } else {
      router.push(url);
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
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
                  {userData?.payload.name || "Nome não disponível"}
                </Title>
                <Typography.Text type="secondary">
                  {userData?.setores?.join(", ") || "Setor não definido"}
                </Typography.Text>
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
                        <MailOutlined />{" "}
                        {userData?.payload.email || "Email não disponível"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Departamento">
                        <TeamOutlined />{" "}
                        {userData?.setores?.join(", ") || "Setor não definido"}
                      </Descriptions.Item>
                      <Descriptions.Item label="ID do Usuário">
                        {userData?.payload.sub || "ID não disponível"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Grupos">
                        {userData?.payload.groups?.map((group, index) => (
                          <Tag key={index} color="blue">
                            {group}
                          </Tag>
                        )) || "Nenhum grupo disponível"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Funções">
                        {userData?.payload.roles?.map((role, index) => (
                          <Tag key={index} color="green">
                            {role}
                          </Tag>
                        )) || "Nenhuma função disponível"}
                      </Descriptions.Item>
                    </Descriptions>
                  </>
                ) : (
                  <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                      name="name"
                      label="Nome"
                      rules={[
                        {
                          required: true,
                          message: "Por favor, insira seu nome",
                        },
                      ]}
                    >
                      <Input prefix={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        {
                          required: true,
                          message: "Por favor, insira seu email",
                        },
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

            <Divider orientation="left">Aplicações Disponíveis</Divider>
            {applications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Typography.Text>Nenhuma aplicação disponível</Typography.Text>
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {applications.map((app) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={app.id}>
                    <Card
                      hoverable
                      onClick={() => handleCardClick(app.url)}
                      style={{ height: "100%" }}
                    >
                      <div style={{ textAlign: "center", marginBottom: 12 }}>
                        <div style={{ marginBottom: 8 }}>
                          <Image
                            src={app.icon}
                            alt={`Logo ${app.name}`}
                            width={64}
                            height={64}
                          />
                        </div>
                        <Typography.Title level={5} style={{ marginTop: 8 }}>
                          {app.name}
                        </Typography.Title>
                      </div>
                      <Typography.Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{ height: 44 }}
                      >
                        {app.description}
                      </Typography.Paragraph>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Tag color="blue">
                          {app.setoresPermitidos.length > 1
                            ? `${app.setoresPermitidos.length} setores`
                            : app.setoresPermitidos[0]}
                        </Tag>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Content>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProfilePage;
