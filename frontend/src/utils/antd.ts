"use client";

import { App } from "antd";

export const useMessage = () => {
  const { message } = App.useApp();
  return message;
};

export const useNotification = () => {
  const { notification } = App.useApp();
  return notification;
};

// Exemplo de uso:
// const message = useMessage();
// const notification = useNotification();
//
// message.success('Sucesso!');
// notification.info({ message: 'Info', description: 'Descrição' });
