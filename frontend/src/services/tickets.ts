import axios from "axios";
import { AuthService } from "./auth";

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
  sector: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  ticketId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  sector: string;
}

export interface CreateCommentData {
  ticketId: string;
  content: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = AuthService.getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function createTicket(data: CreateTicketData): Promise<Ticket> {
  try {
    console.log("Enviando dados para criação de ticket:", data);

    AuthService.setupAxiosInterceptors();

    const response = await api.post<Ticket>("/tickets", data);
    console.log("Resposta da criação de ticket:", response.data);

    createNotification({
      title: "Novo ticket criado",
      message: `O ticket "${data.title}" foi criado com prioridade ${data.priority}`,
      ticketId: response.data._id,
      type: "info",
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    throw error;
  }
}

export async function getTickets(): Promise<Ticket[]> {
  const response = await api.get<Ticket[]>("/tickets");
  return response.data;
}

export async function getTicketById(id: string): Promise<Ticket> {
  const response = await api.get<Ticket>(`/tickets/${id}`);
  return response.data;
}

export async function updateTicket(
  id: string,
  data: Partial<Ticket>
): Promise<Ticket> {
  const response = await api.patch<Ticket>(`/tickets/${id}`, data);
  createNotification({
    title: "Ticket atualizado",
    message: `O ticket "${response.data.title}" foi atualizado`,
    ticketId: id,
    type: "info",
  });
  return response.data;
}

export async function addComment(data: CreateCommentData): Promise<Comment> {
  const response = await api.post<Comment>("/comments", data);
  const ticket = await getTicketById(data.ticketId);
  createNotification({
    title: "Novo comentário",
    message: `Um novo comentário foi adicionado ao ticket "${ticket.title}"`,
    ticketId: data.ticketId,
    type: "info",
  });
  return response.data;
}

export async function getTicketComments(ticketId: string): Promise<Comment[]> {
  const response = await api.get<Comment[]>(`/tickets/${ticketId}/comments`);
  return response.data;
}

export async function deleteComment(id: string): Promise<void> {
  await api.delete(`/comments/${id}`);
}

interface CreateNotificationData {
  title: string;
  message: string;
  ticketId: string;
  type: "info" | "warning" | "error";
}

function createNotification(data: CreateNotificationData) {
  const event = new CustomEvent("notification", { detail: data });
  window.dispatchEvent(event);
}
