import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TicketDocument = Ticket & Document;

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  author: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @Prop({ required: true, enum: TicketPriority })
  priority: TicketPriority;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  assignedTo?: string;

  @Prop({ required: true })
  sector: string;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
