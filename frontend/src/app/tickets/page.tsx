"use client";

import { useRouter } from "next/navigation";
import { Button, Typography, Breadcrumb, Card, Tabs, TabsProps } from "antd";
import { TicketList } from "./components/TicketList";
import MainLayout from "@/components/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { HomeOutlined, ToolOutlined } from "@ant-design/icons";

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

export default function TicketsManagementPage() {
  const router = useRouter();

  const items: TabsProps["items"] = [
    {
      key: "todos",
      label: "Todos os Chamados",
      children: <TicketList sectors={sectors} statusFilter="Todos" />,
    },
    {
      key: "abertos",
      label: "Chamados Abertos",
      children: <TicketList sectors={sectors} statusFilter="Aberto" />,
    },
    {
      key: "em-andamento",
      label: "Em Atendimento",
      children: <TicketList sectors={sectors} statusFilter="Em Andamento" />,
    },
    {
      key: "resolvidos",
      label: "Resolvidos",
      children: <TicketList sectors={sectors} statusFilter="Resolvido" />,
    },
    {
      key: "fechados",
      label: "Fechados",
      children: <TicketList sectors={sectors} statusFilter="Fechado" />,
    },
  ];

  return (
    <ProtectedRoute allowedSetores={["TI"]}>
      <MainLayout>
        <div className="container mx-auto py-8">
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item href="/interceptor">
              <HomeOutlined /> Início
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <ToolOutlined /> Gerenciamento de Chamados
            </Breadcrumb.Item>
          </Breadcrumb>

          <div className="flex justify-between items-center mb-8">
            <Title level={2}>Gerenciamento de Chamados</Title>
            <div>
              <Button
                type="primary"
                onClick={() => router.push("/tickets/create")}
                className="mr-2"
              >
                Criar Novo Chamado
              </Button>
              <Button onClick={() => router.push("/interceptor")}>
                Voltar para Aplicações
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <Text>
              Esta é a área de gerenciamento de chamados, exclusiva para a
              equipe de TI. Aqui você pode visualizar, filtrar e gerenciar todos
              os chamados abertos pelos usuários. Clique em um chamado para ver
              seus detalhes e atendê-lo.
            </Text>
          </Card>

          <Tabs defaultActiveKey="todos" items={items} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
