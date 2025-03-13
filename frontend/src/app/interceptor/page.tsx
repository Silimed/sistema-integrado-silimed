"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, Row, Col, Typography, Spin, Empty, message } from "antd";
import Image from "next/image";
import styles from "./interceptor.module.css";
import axios from "axios";
import { AuthService } from "@/services/auth";
import LogoutButton from "@/components/LogoutButton";
import { useRouter } from "next/navigation";

const { Title } = Typography;

interface Application {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  setoresPermitidos: string[];
}

interface UserPayload {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  groups: string[];
}

interface UserData {
  valid: boolean;
  payload: UserPayload;
  redirectTo: string;
  setores: string[];
}

export default function Interceptor() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  const validateTokenAndFetchApplications = async () => {
    try {
      console.log("Verificando autenticação...");
      const isAuthenticated = AuthService.isAuthenticated();
      console.log("Token existe?", isAuthenticated);

      if (!isAuthenticated) {
        message.error("Sessão expirada. Por favor, faça login novamente.");
        router.push("/login");
        return;
      }

      try {
        // Primeiro valida o token
        console.log("Iniciando validação do token...");
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
        console.log("Resposta da validação:", validationResponse.data);

        if (!validationResponse.data.valid) {
          console.log("Token inválido na validação");
          message.error("Token inválido. Por favor, faça login novamente.");
          AuthService.removeToken();
          router.push("/login");
          return;
        }

        // Armazena os dados do usuário
        setUserData(validationResponse.data);

        // Se o token é válido, busca as aplicações
        console.log("Buscando aplicações...");
        const response = await axios.get("/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Aplicações recebidas:", response.data);
        setApplications(response.data);
      } catch (error) {
        console.error(
          "Erro na validação do token ou busca de aplicações:",
          error
        );
        if (axios.isAxiosError(error)) {
          console.log("Status do erro:", error.response?.status);
          console.log("Dados do erro:", error.response?.data);

          if (error.response?.status === 401) {
            console.log("Erro 401 detectado - removendo token");
            AuthService.removeToken();
            message.error("Sessão expirada. Por favor, faça login novamente.");
            router.push("/login");
          } else {
            message.error(
              error.response?.data?.message || "Erro ao carregar dados"
            );
          }
        } else {
          message.error("Erro ao carregar dados");
        }
      }
    } catch (error) {
      console.error("Erro geral:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Interceptor montado - iniciando validação");
    validateTokenAndFetchApplications();
  }, []);

  const handleCardClick = useCallback((url: string) => {
    window.location.href = url;
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {userData && (
        <div className={styles.userInfo}>
          <Title level={4}>Bem-vindo(a): {userData.payload.name}</Title>
          <p>Setor: {userData.setores?.join(", ") || "Não definido"}</p>
          <LogoutButton />
        </div>
      )}
      <Title level={2} className={styles.title}>
        Aplicações Disponíveis
      </Title>

      {applications.length === 0 ? (
        <Empty
          description="Nenhuma aplicação disponível"
          className={styles.empty}
        />
      ) : (
        <Row gutter={[16, 16]} className={styles.cardGrid}>
          {applications.map((app) => (
            <Col xs={24} sm={12} md={8} lg={6} key={app.id}>
              <Card
                hoverable
                className={styles.card}
                onClick={() => handleCardClick(app.url)}
              >
                <div className={styles.cardContent}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={app.icon}
                      alt={`Logo ${app.name}`}
                      width={64}
                      height={64}
                      className={styles.appImage}
                    />
                  </div>
                  <Title level={4} className={styles.cardTitle}>
                    {app.name}
                  </Title>
                  <p className={styles.cardDescription}>{app.description}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
