"use client";
import { useState } from "react";
import {
  Layout,
  Card,
  Tabs,
  Form,
  Input,
  Switch,
  Button,
  Select,
  message,
  Row,
  Col,
  List,
  Typography,
  Divider,
  Descriptions,
} from "antd";
import {
  BellOutlined,
  LockOutlined,
  SecurityScanOutlined,
  NotificationOutlined,
  GlobalOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

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

  const handleNotificationSave = (values: NotificationSettings) => {
    setNotificationSettings(values);
    message.success("Configurações de notificação atualizadas!");
  };

  const handleSecuritySave = (values: SecuritySettings) => {
    setSecuritySettings(values);
    message.success("Configurações de segurança atualizadas!");
  };

  return (
    <Content style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      <Title level={2}>
        <SettingOutlined /> Configurações
      </Title>
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
                      <Select.Option value="en-US">English (US)</Select.Option>
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
                </Form>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Informações do Sistema" size="small">
                  <Descriptions column={1}>
                    <Descriptions.Item label="Versão">1.0.0</Descriptions.Item>
                    <Descriptions.Item label="Última Atualização">
                      07/03/2024
                    </Descriptions.Item>
                    <Descriptions.Item label="Ambiente">
                      Homologação
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </Content>
  );
};

export default SettingsPage;
