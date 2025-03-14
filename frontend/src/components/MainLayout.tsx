"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Layout,
  Menu,
  Button,
  theme,
  Avatar,
  Dropdown,
  Space,
  Badge,
  Switch,
  ConfigProvider,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  ProjectOutlined,
  LaptopOutlined,
  ToolOutlined,
  DatabaseOutlined,
  SunOutlined,
  MoonOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import logoAberta from "../../public/logo-silimed-laranja-aberta.png";
import logoFechada from "../../public/logo-sem-nome.png";
import { AuthService } from "@/services/auth";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme === "dark";
    }
    return false;
  });
  const [selectedKey, setSelectedKey] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedKey") || "1";
    }
    return "1";
  });
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  // Adicionando o hook de notificações
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  // Efeito para atualizar a classe do body quando o tema mudar
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  // Tema personalizado
  const customTheme = {
    token: {
      colorPrimary: "#86898be5",
      borderRadius: 6,
    },
    components: {
      Layout: {
        siderBg: isDarkMode ? "#001529" : "#fff",
        headerBg: isDarkMode ? "#001529" : "#fff",
      },
      Menu: {
        darkItemBg: "#001529",
        darkItemSelectedBg: "#f1f1f1",
        darkItemHoverBg: "rgba(24, 144, 255, 0.2)",
      },
      Card: {
        colorBgContainer: isDarkMode ? "#141414" : "#fff",
      },
    },
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  // Função para alternar o tema
  const toggleTheme = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  // Função para navegar para diferentes páginas
  const handleMenuClick = (path: string) => {
    router.push(path);
  };

  // Função para lidar com cliques em notificações
  const handleNotificationClick = (
    ticketId: string,
    notificationId: string
  ) => {
    markAsRead(notificationId);
    router.push(`/tickets/${ticketId}`);
  };

  const userMenu = {
    items: [
      {
        key: "1",
        label: "Perfil",
        icon: <UserOutlined />,
        onClick: () => router.push("/profile"),
      },
      {
        key: "2",
        label: "Configurações",
        icon: <SettingOutlined />,
        onClick: () => router.push("/settings"),
      },
      {
        key: "3",
        label: "Sair",
        onClick: async () => {
          try {
            await AuthService.logout();
            router.push("/login");
          } catch (error) {
            console.error("Erro ao fazer logout:", error);
            AuthService.removeToken();
            router.push("/login");
          }
        },
      },
    ],
  };

  return (
    <ConfigProvider theme={customTheme}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            background: isDarkMode ? "#141414" : "#fff",
          }}
        >
          <div>
            {collapsed ? (
              <Image
                src={logoFechada}
                alt="logo"
                width={30}
                height={40}
                style={{
                  marginLeft: 26,
                  marginTop: 20,
                  marginBottom: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            ) : (
              <Image
                src={logoAberta}
                alt="logo"
                width={120}
                height={40}
                style={{
                  marginLeft: 30,
                  marginTop: 20,
                  marginBottom: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
          </div>

          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{
              background: isDarkMode ? "#141414" : "#fff",
            }}
            onClick={({ key }) => {
              setSelectedKey(key);
              localStorage.setItem("selectedKey", key);
              switch (key) {
                case "1":
                  handleMenuClick("/dashboard");
                  break;
                case "2":
                  handleMenuClick("/tickets");
                  break;
                case "3":
                  handleMenuClick("/applications");
                  break;
                case "4":
                  handleMenuClick("/databases");
                  break;
                case "5":
                  handleMenuClick("/kanban");
                  break;
                case "6":
                  handleMenuClick("/tickets/create");
                  break;
              }
            }}
            items={[
              {
                key: "1",
                icon: <DashboardOutlined />,
                label: "Dashboard",
              },
              {
                key: "2",
                icon: <ToolOutlined />,
                label: "Chamados",
              },
              {
                key: "3",
                icon: <LaptopOutlined />,
                label: "Aplicações",
              },
              {
                key: "4",
                icon: <DatabaseOutlined />,
                label: "Bancos de Dados",
              },
              {
                key: "5",
                icon: <ProjectOutlined />,
                label: "Kanban de Demandas",
              },
              {
                key: "6",
                icon: <PlusOutlined />,
                label: "Criar Chamado",
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: isDarkMode ? "#141414" : "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                color: isDarkMode ? "#fff" : undefined,
              }}
            />
            <Space size={16} style={{ marginRight: 24 }}>
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "header",
                      label: (
                        <div className="flex items-center justify-between p-2">
                          <span>Notificações</span>
                          {notifications.length > 0 && (
                            <Button
                              type="link"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAllAsRead();
                              }}
                            >
                              Marcar todas como lidas
                            </Button>
                          )}
                        </div>
                      ),
                      type: "group",
                    },
                    ...notifications.map((notification) => ({
                      key: notification.id,
                      label: (
                        <div
                          style={{
                            padding: "8px",
                            background: !notification.read
                              ? isDarkMode
                                ? "#1f1f1f"
                                : "#f0f0f0"
                              : "transparent",
                            borderRadius: "4px",
                            marginBottom: "4px",
                          }}
                        >
                          <div style={{ fontWeight: "bold" }}>
                            {notification.title}
                          </div>
                          <div style={{ fontSize: "12px" }}>
                            {notification.message}
                          </div>
                          <div style={{ fontSize: "11px", color: "#888" }}>
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                                locale: ptBR,
                              }
                            )}
                          </div>
                        </div>
                      ),
                      onClick: () =>
                        handleNotificationClick(
                          notification.ticketId,
                          notification.id
                        ),
                    })),
                    ...(notifications.length === 0
                      ? [
                          {
                            key: "empty",
                            label: (
                              <div
                                style={{
                                  padding: "8px",
                                  textAlign: "center",
                                  color: "#888",
                                }}
                              >
                                Nenhuma notificação
                              </div>
                            ),
                            disabled: true,
                          },
                        ]
                      : []),
                  ],
                }}
                placement="bottomRight"
                arrow
                trigger={["click"]}
                dropdownRender={(menu) => (
                  <div
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      width: "320px",
                      background: isDarkMode ? "#141414" : "#fff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      borderRadius: "8px",
                    }}
                  >
                    {menu}
                  </div>
                )}
              >
                <Badge count={unreadCount} overflowCount={99}>
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    style={{
                      color: isDarkMode ? "#fff" : undefined,
                    }}
                  />
                </Badge>
              </Dropdown>
              <Dropdown menu={userMenu} placement="bottomRight">
                <Avatar
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: isDarkMode ? "#646C74" : "#646C74",
                    cursor: "pointer",
                  }}
                />
              </Dropdown>
            </Space>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: isDarkMode ? "#141414" : "#fff",
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
