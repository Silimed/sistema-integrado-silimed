"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Layout,
  Button,
  Avatar,
  Dropdown,
  Space,
  Badge,
  Switch,
  Typography,
  theme,
  ConfigProvider,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  SunOutlined,
  MoonOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import logoSilimed from "../../public/logo-silimed-laranja-aberta.png";
import { AuthService } from "@/services/auth";
import { useNotifications } from "@/contexts/NotificationContext";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const { Header } = Layout;
const { Title, Text } = Typography;

interface InterceptorHeaderProps {
  userName: string;
  userSector?: string;
}

const InterceptorHeader = ({
  userName,
  userSector,
}: InterceptorHeaderProps) => {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  // Adicionando o hook de notificações
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

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
        icon: <LogoutOutlined />,
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
      <Header
        style={{
          padding: "50px",
          background: isDarkMode ? "#141414" : "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
          marginBottom: "24px",
          borderRadius: borderRadiusLG,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src={logoSilimed}
            alt="logo"
            width={120}
            height={40}
            style={{ marginRight: "16px" }}
          />
          <div style={{ marginLeft: "2rem" }}>
            <Title
              level={4}
              style={{ marginTop: "20px", marginBottom: "-10px" }}
            >
              Portal de Aplicações
            </Title>
            <Text type="secondary">
              Bem-vindo(a), {userName}
              {userSector && ` | Setor: ${userSector}`}
            </Text>
          </div>
        </div>
        <Space size={16}>
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
                      className="flex flex-col p-2 cursor-pointer"
                      onClick={() =>
                        handleNotificationClick(
                          notification.ticketId,
                          notification.id
                        )
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {notification.title}
                        </span>
                        <Badge
                          status={notification.read ? "default" : "processing"}
                        />
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  ),
                })),
              ],
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Badge count={unreadCount} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{
                  fontSize: "18px",
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
    </ConfigProvider>
  );
};

export default InterceptorHeader;
