"use client";
import { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Form,
  Switch,
  Button,
  Select,
  message,
  Row,
  Col,
  List,
  Typography,
  Descriptions,
  Breadcrumb,
  Spin,
} from "antd";
import {
  SecurityScanOutlined,
  NotificationOutlined,
  GlobalOutlined,
  SettingOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { AuthService } from "@/services/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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

interface NotificationSettings {
  emailNotifications: boolean;
  desktopNotifications: boolean;
  soundEnabled: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: string;
  passwordExpiration: string;
}

const SettingsPage = () => {
  const [notificationForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      desktopNotifications: true,
      soundEnabled: true,
    });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiration: "90",
  });

  useEffect(() => {
    const fetchUserData = async () => {
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

        // Aqui você poderia carregar as configurações do usuário do backend
        // Por enquanto, estamos usando os valores padrão definidos no estado
      } catch (error) {
        console.error("Erro ao obter dados:", error);
        message.error(
          "Erro ao carregar dados do usuário. Por favor, tente novamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleNotificationSave = (values: NotificationSettings) => {
    setNotificationSettings(values);
    message.success("Configurações de notificação atualizadas!");
    // Aqui você implementaria a chamada para salvar no backend
  };

  const handleSecuritySave = (values: SecuritySettings) => {
    setSecuritySettings(values);
    message.success("Configurações de segurança atualizadas!");
    // Aqui você implementaria a chamada para salvar no backend
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
        <div className="container mx-auto py-8">
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item href="/interceptor">
              <HomeOutlined /> Início
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <SettingOutlined /> Configurações
            </Breadcrumb.Item>
          </Breadcrumb>

          <div className="flex justify-between items-center mb-8">
            <Title level={2}>
              <SettingOutlined /> Configurações
            </Title>
            <Button onClick={() => router.push("/interceptor")}>
              Voltar para Aplicações
            </Button>
          </div>

          <Card className="mb-6">
            <Text>
              Bem-vindo à página de configurações, {userData?.payload.name}.
              Aqui você pode personalizar suas preferências de notificação,
              segurança e sistema.
            </Text>
          </Card>

          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <NotificationOutlined /> Notificações
                  </span>
                }
                key="1"
              >
                <Form
                  form={notificationForm}
                  layout="vertical"
                  initialValues={notificationSettings}
                  onFinish={handleNotificationSave}
                >
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="emailNotifications"
                        label="Notificações por Email"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        name="desktopNotifications"
                        label="Notificações Desktop"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        name="soundEnabled"
                        label="Sons de Notificação"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <List
                        header={<Text strong>Tipos de Notificação</Text>}
                        bordered
                        dataSource={[
                          "Novos chamados",
                          "Atualizações de chamados",
                          "Mensagens diretas",
                          "Lembretes",
                        ]}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                      />
                    </Col>
                  </Row>
                  <Form.Item style={{ marginTop: 16 }}>
                    <Button type="primary" htmlType="submit">
                      Salvar Configurações
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <SecurityScanOutlined /> Segurança
                  </span>
                }
                key="2"
              >
                <Form
                  form={securityForm}
                  layout="vertical"
                  initialValues={securitySettings}
                  onFinish={handleSecuritySave}
                >
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="twoFactorAuth"
                        label="Autenticação em Dois Fatores"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        name="sessionTimeout"
                        label="Tempo Limite da Sessão (minutos)"
                      >
                        <Select>
                          <Select.Option value="15">15 minutos</Select.Option>
                          <Select.Option value="30">30 minutos</Select.Option>
                          <Select.Option value="60">1 hora</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        name="passwordExpiration"
                        label="Expiração de Senha (dias)"
                      >
                        <Select>
                          <Select.Option value="30">30 dias</Select.Option>
                          <Select.Option value="60">60 dias</Select.Option>
                          <Select.Option value="90">90 dias</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card title="Dicas de Segurança" size="small">
                        <ul>
                          <li>Use senhas fortes com pelo menos 8 caracteres</li>
                          <li>Combine letras, números e símbolos</li>
                          <li>Ative a autenticação em dois fatores</li>
                          <li>Não compartilhe suas credenciais</li>
                        </ul>
                      </Card>
                    </Col>
                  </Row>
                  <Form.Item style={{ marginTop: 16 }}>
                    <Button type="primary" htmlType="submit">
                      Salvar Configurações
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <GlobalOutlined /> Sistema
                  </span>
                }
                key="3"
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Form layout="vertical">
                      <Form.Item label="Idioma">
                        <Select defaultValue="pt-BR">
                          <Select.Option value="pt-BR">
                            Português (Brasil)
                          </Select.Option>
                          <Select.Option value="en-US">
                            English (US)
                          </Select.Option>
                          <Select.Option value="es">Español</Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="Fuso Horário">
                        <Select defaultValue="America/Sao_Paulo">
                          <Select.Option value="America/Sao_Paulo">
                            Brasília (GMT-3)
                          </Select.Option>
                          <Select.Option value="America/New_York">
                            New York (GMT-4)
                          </Select.Option>
                        </Select>
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary">Salvar Configurações</Button>
                      </Form.Item>
                    </Form>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="Informações do Sistema" size="small">
                      <Descriptions column={1}>
                        <Descriptions.Item label="Versão">
                          1.0.0
                        </Descriptions.Item>
                        <Descriptions.Item label="Última Atualização">
                          07/03/2024
                        </Descriptions.Item>
                        <Descriptions.Item label="Ambiente">
                          Homologação
                        </Descriptions.Item>
                        <Descriptions.Item label="Usuário">
                          {userData?.payload.name || "Nome não disponível"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                          {userData?.payload.email || "Email não disponível"}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default SettingsPage;
