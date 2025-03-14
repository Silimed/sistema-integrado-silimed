"use client";

import { useRouter } from "next/navigation";
import { TicketForm } from "../components/TicketForm";
import { createTicket, CreateTicketData } from "@/services/tickets";
import { Typography, Breadcrumb, Card, Alert } from "antd";
import { HomeOutlined, PlusOutlined } from "@ant-design/icons";
import MainLayout from "@/components/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";

const { Title, Text } = Typography;

const sectors = [
  "TI",
  "RH",
  "Financeiro",
  "Comercial",
  "Marketing",
  "Operações",
  "Administrativo",
];

export default function CreateTicketPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (data: CreateTicketData) => {
    try {
      setError(null);
      await createTicket(data);
      setSuccess(true);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/interceptor");
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      setError("Não foi possível criar o chamado. Por favor, tente novamente.");
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto py-8">
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item href="/interceptor">
              <HomeOutlined /> Início
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <PlusOutlined /> Novo Chamado
            </Breadcrumb.Item>
          </Breadcrumb>

          <Title level={2} className="mb-6">
            Criar Novo Chamado
          </Title>

          {error && (
            <Alert
              message="Erro"
              description={error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          {success && (
            <Alert
              message="Sucesso"
              description="Chamado criado com sucesso! Você será redirecionado em instantes."
              type="success"
              showIcon
              className="mb-4"
            />
          )}

          <Card className="mb-6">
            <Text>
              Utilize este formulário para criar um novo chamado para o setor de
              TI. Preencha todos os campos com informações detalhadas para que
              possamos atender sua solicitação da melhor forma possível.
            </Text>
          </Card>

          <div className="max-w-2xl mx-auto">
            <TicketForm onSubmit={handleSubmit} sectors={sectors} />
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
