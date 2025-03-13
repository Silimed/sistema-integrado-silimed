"use client";
import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoAberta from "../../../public/logo-silimed-laranja-aberta.png";
import logoFechada from "../../../public/logo-sem-nome.png";
import { AuthService } from "@/services/auth";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";

const { Header, Sider, Content } = Layout;

const Silidesk = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const verifyAuth = async () => {
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

        // Validar o token no backend
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

        // Verificar se o usuário tem permissão para acessar o Silidesk
        const userGroups = response.data.payload.groups || [];
        const allowedGroups = ["TI", "Desenvolvimento", "Infraestrutura", "RH"];

        const hasPermission = userGroups.some((group: string) => {
          const groupName = group.replace(/^\/Setores\//, "");
          return allowedGroups.includes(groupName);
        });

        if (!hasPermission) {
          message.error("Você não tem permissão para acessar esta aplicação.");
          router.push("/interceptor");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        AuthService.removeToken();
        message.error("Sessão expirada. Por favor, faça login novamente.");
        router.push("/login");
      }
    };

    verifyAuth();
  }, [router]);

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
        Carregando...
      </div>
    );
  }

  return (
    <ProtectedRoute allowedSetores={["TI", "RH", "Infraestrutura"]}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div>
            {collapsed ? (
              <Image
                src={logoFechada}
                alt="logo"
                width={30}
                height={30}
                style={{ margin: 16 }}
              />
            ) : (
              <Image
                src={logoAberta}
                alt="logo"
                width={90}
                height={30}
                style={{
                  margin: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: "nav 1",
              },
              {
                key: "2",
                icon: <VideoCameraOutlined />,
                label: "nav 2",
              },
              {
                key: "3",
                icon: <UploadOutlined />,
                label: "nav 3",
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
};

export default Silidesk;
