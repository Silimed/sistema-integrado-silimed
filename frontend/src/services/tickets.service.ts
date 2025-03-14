import axios from "axios";
import { AuthService } from "./auth";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  requester: string;
  requesterSector: string;
  priority: "Alta" | "Média" | "Baixa";
  status: "Aberto" | "Em Atendimento" | "Resolvido" | "Fechado";
  category: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  resolution?: string;
  comments?: TicketComment[];
}

export interface TicketComment {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  type: "comment" | "status_change" | "resolution";
}

export interface CreateTicketDto {
  title: string;
  description: string;
  category: string;
  priority: "Alta" | "Média" | "Baixa";
}

class TicketsService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  private async getHeaders() {
    const token = await this.authService.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async createTicket(ticketData: CreateTicketDto): Promise<Ticket> {
    const headers = await this.getHeaders();
    const response = await axios.post(`${this.baseUrl}/tickets`, ticketData, {
      headers,
    });
    return response.data;
  }

  async getAllTickets(): Promise<Ticket[]> {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.baseUrl}/tickets`, { headers });
    return response.data;
  }

  async getTicket(id: string): Promise<Ticket> {
    const headers = await this.getHeaders();
    const response = await axios.get(`${this.baseUrl}/tickets/${id}`, {
      headers,
    });
    return response.data;
  }

  async updateTicket(id: string, updateData: Partial<Ticket>): Promise<Ticket> {
    const headers = await this.getHeaders();
    const response = await axios.put(
      `${this.baseUrl}/tickets/${id}`,
      updateData,
      { headers }
    );
    return response.data;
  }

  async addComment(id: string, content: string): Promise<Ticket> {
    const headers = await this.getHeaders();
    const response = await axios.post(
      `${this.baseUrl}/tickets/${id}/comments`,
      { content },
      { headers }
    );
    return response.data;
  }
}

export const ticketsService = new TicketsService();
