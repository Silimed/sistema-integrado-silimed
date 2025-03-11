"use client";
import { useState } from "react";
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
} from "@ant-design/icons";
import Image from "next/image";
import logoAberta from "../../public/logo-silimed-laranja-aberta.png";
import logoFechada from "../../public/logo-sem-nome.png";
const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  // Tema personalizado
  const customTheme = {
    token: {
      colorPrimary: "#86898be5",

      borderRadius: 6,
    },
    components: {
      Layout: {
        siderBg: isDarkMode ? "#001529" : "#001529",
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

  // Função para navegar para diferentes páginas
  const handleMenuClick = (path: string) => {
    router.push(path);
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
        onClick: () => {
          localStorage.removeItem("access_token");
          router.push("/login");
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
            background: "#fff",
          }}
        >
          <div>
            {collapsed ? (
              <Image
                src={logoFechada}
                alt="logo"
                width={30}
                height={30}
                style={{
                  marginTop: 16,
                  marginBottom: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
            ) : (
              <Image
                src={logoAberta}
                alt="logo"
                width={90}
                height={30}
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />
            )}
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{
              background: "#fff",
            }}
            onClick={({ key }) => {
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
                  handleMenuClick("/projects");
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
                label: "Novos Projetos",
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: isDarkMode ? "#001529" : "#fff",
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
                onChange={setIsDarkMode}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
              <Badge count={5}>
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  style={{
                    color: isDarkMode ? "#fff" : undefined,
                  }}
                />
              </Badge>
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
