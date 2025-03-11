"use client";

import { Button } from "antd";
import { useMessage, useNotification } from "@/utils/antd";

export function ExampleComponent() {
  const message = useMessage();
  const notification = useNotification();

  const handleClick = () => {
    message.success("Operação realizada com sucesso!");
    notification.info({
      message: "Informação",
      description: "Esta é uma notificação de exemplo",
    });
  };

  return <Button onClick={handleClick}>Testar Mensagens</Button>;
}
