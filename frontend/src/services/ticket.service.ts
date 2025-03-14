import axios from "axios";
import {
  Ticket,
  CreateTicketDto,
  UpdateTicketDto,
  AddCommentDto,
} from "../interfaces/ticket.interface";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const TicketService = {
  async getAllTickets(): Promise<Ticket[]> {
    const response = await axios.get(`${API_URL}/tickets`);
    return response.data;
  },

  async getTicketById(id: string): Promise<Ticket> {
    const response = await axios.get(`${API_URL}/tickets/${id}`);
    return response.data;
  },

  async createTicket(ticket: CreateTicketDto): Promise<Ticket> {
    const response = await axios.post(`${API_URL}/tickets`, ticket);
    return response.data;
  },

  async updateTicket(id: string, ticket: UpdateTicketDto): Promise<Ticket> {
    const response = await axios.put(`${API_URL}/tickets/${id}`, ticket);
    return response.data;
  },

  async addComment(id: string, comment: AddCommentDto): Promise<Ticket> {
    const response = await axios.post(
      `${API_URL}/tickets/${id}/comments`,
      comment
    );
    return response.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await axios.delete(`${API_URL}/tickets/comments/${commentId}`);
  },

  async getMyTickets(): Promise<Ticket[]> {
    const response = await axios.get(`${API_URL}/tickets/user/me`);
    return response.data;
  },

  async getAssignedToMe(): Promise<Ticket[]> {
    const response = await axios.get(`${API_URL}/tickets/assignee/me`);
    return response.data;
  },

  async getTicketsBySector(sector: string): Promise<Ticket[]> {
    const response = await axios.get(`${API_URL}/tickets/sector/${sector}`);
    return response.data;
  },
};
