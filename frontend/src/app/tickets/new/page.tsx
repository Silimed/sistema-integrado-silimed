"use client";

import { useRouter } from "next/navigation";
import { TicketForm } from "../components/TicketForm";
import { createTicket, CreateTicketData } from "@/services/tickets";
import { Typography, Breadcrumb } from "antd";
import { HomeOutlined, PlusOutlined } from "@ant-design/icons";
import MainLayout from "@/components/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

const { Title } = Typography;

const sectors = [
  "TI",
  "RH",
  "Financeiro",
  "Comercial",
  "Marketing",
  "Operações",
  "Administrativo",
];

export default function NewTicketPage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateTicketData) => {
    try {
      await createTicket(data);
      router.push("/tickets");
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
    }
  };

  return (
    <ProtectedRoute allowedSetores={["TI"]}>
      <MainLayout>
        <div className="container mx-auto py-8">
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item href="/">
              <HomeOutlined /> Início
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/tickets">Chamados</Breadcrumb.Item>
            <Breadcrumb.Item>
              <PlusOutlined /> Novo Chamado
            </Breadcrumb.Item>
          </Breadcrumb>

          <Title level={2} className="mb-6">
            Criar Novo Chamado
          </Title>

          <div className="max-w-2xl mx-auto">
            <TicketForm onSubmit={handleSubmit} sectors={sectors} />
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
