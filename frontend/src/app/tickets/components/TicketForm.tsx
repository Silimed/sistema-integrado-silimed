"use client";

import { useState } from "react";
import { Form, Input, Select, Button, Card, Space, message } from "antd";
import { SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { CreateTicketData } from "@/services/tickets";
import { AuthService } from "@/services/auth";

const { TextArea } = Input;
const { Option } = Select;

interface TicketFormProps {
  onSubmit: (data: CreateTicketData) => Promise<void>;
  sectors: string[];
}

export function TicketForm({ onSubmit, sectors }: TicketFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const handleFormSubmit = async (values: {
    title: string;
    description: string;
    priority: string;
    sector: string;
  }) => {
    try {
      setIsSubmitting(true);

      // Verificar se o usuário está autenticado
      if (!AuthService.isAuthenticated()) {
        messageApi.error("Usuário não autenticado. Faça login novamente.");
        router.push("/login");
        return;
      }

      // Configurar interceptors do Axios
      AuthService.setupAxiosInterceptors();

      console.log("Valores do formulário:", values);

      // Mapear os valores do formulário para o formato esperado pela API
      const mappedValues: CreateTicketData = {
        title: values.title,
        description: values.description,
        priority: mapPriority(values.priority),
        sector: values.sector,
      };

      console.log("Valores mapeados para envio:", mappedValues);

      await onSubmit(mappedValues);
      messageApi.success("Chamado criado com sucesso!");

      // Limpar o formulário após o envio bem-sucedido
      form.resetFields();
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      messageApi.error("Erro ao criar o chamado. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para mapear as prioridades do português para o inglês
  const mapPriority = (priority: string): "low" | "medium" | "high" => {
    switch (priority) {
      case "baixa":
        return "low";
      case "media":
        return "medium";
      case "alta":
        return "high";
      default:
        return "medium";
    }
  };

  return (
    <Card className="shadow-md">
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          priority: "media",
        }}
      >
        <Form.Item
          name="title"
          label="Título"
          rules={[
            {
              required: true,
              message: "Por favor, informe o título do chamado",
            },
            { min: 5, message: "O título deve ter pelo menos 5 caracteres" },
          ]}
        >
          <Input placeholder="Digite o título do chamado" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição"
          rules={[
            {
              required: true,
              message: "Por favor, informe a descrição do chamado",
            },
            {
              min: 10,
              message: "A descrição deve ter pelo menos 10 caracteres",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Descreva detalhadamente o problema ou solicitação"
          />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Prioridade"
          rules={[
            { required: true, message: "Por favor, selecione a prioridade" },
          ]}
        >
          <Select placeholder="Selecione a prioridade">
            <Option value="baixa">Baixa</Option>
            <Option value="media">Média</Option>
            <Option value="alta">Alta</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="sector"
          label="Setor"
          rules={[{ required: true, message: "Por favor, selecione o setor" }]}
        >
          <Select placeholder="Selecione o setor">
            {sectors.map((sector) => (
              <Option key={sector} value={sector}>
                {sector}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              icon={<SaveOutlined />}
            >
              Criar Chamado
            </Button>
            <Button onClick={() => router.back()} icon={<RollbackOutlined />}>
              Cancelar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
