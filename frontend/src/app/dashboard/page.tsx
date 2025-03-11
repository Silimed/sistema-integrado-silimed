"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, Row, Col, Statistic, Table, Badge, message } from "antd";
import {
  WarningOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import MainLayout from "@/components/MainLayout";

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Dados mockados para exemplo
  const statisticsData = [
    {
      title: "Chamados Abertos",
      value: 12,
      icon: <WarningOutlined style={{ color: "#ff4d4f" }} />,
    },
    {
      title: "Em Atendimento",
      value: 5,
      icon: <ClockCircleOutlined style={{ color: "#faad14" }} />,
    },
    {
      title: "Resolvidos Hoje",
      value: 8,
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
    },
  ];

  const recentAppointments = [
    {
      key: "1",
      user: "Carlos Silva",
      department: "Financeiro",
      title: "Problema com Impressora",
      priority: "Alta",
      status: "Em Atendimento",
      created_at: "2024-03-07 09:00",
    },
    {
      key: "2",
      user: "Maria Santos",
      department: "RH",
      title: "Email não sincroniza",
      priority: "Média",
      status: "Aberto",
      created_at: "2024-03-07 10:30",
    },
    {
      key: "3",
      user: "João Oliveira",
      department: "Comercial",
      title: "Computador não liga",
      priority: "Alta",
      status: "Em Atendimento",
      created_at: "2024-03-07 11:00",
    },
  ];

  const columns = [
    {
      title: "Usuário",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Departamento",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Problema",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Prioridade",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Badge
          status={
            priority === "Alta"
              ? "error"
              : priority === "Média"
              ? "warning"
              : "success"
          }
          text={priority}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge
          status={
            status === "Aberto"
              ? "error"
              : status === "Em Atendimento"
              ? "processing"
              : "success"
          }
          text={status}
        />
      ),
    },
    {
      title: "Abertura",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];

  const verifyToken = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Token não encontrado");
      }

      // Configuração global do Axios para incluir o token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Tenta buscar os dados do dashboard
      await axios.get("http://localhost:3001/dashboard");
      setLoading(false);
    } catch (error) {
      console.error("Erro na verificação do token:", error);

      // Remove o token inválido
      localStorage.removeItem("access_token");

      // Mostra mensagem de erro apropriada
      if (axios.isAxiosError(error)) {
        message.error(
          error.response?.status === 401
            ? "Sessão expirada. Por favor, faça login novamente."
            : "Erro de autenticação. Por favor, faça login novamente."
        );
      } else {
        message.error("Erro de autenticação. Por favor, faça login novamente.");
      }

      // Redireciona para o login
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

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
    <MainLayout>
      <>
        <Row gutter={[16, 16]}>
          {statisticsData.map((stat, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.icon}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <Card title="Chamados Recentes" style={{ marginTop: 16 }}>
          <Table
            columns={columns}
            dataSource={recentAppointments}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </>
    </MainLayout>
  );
};

export default Dashboard;
