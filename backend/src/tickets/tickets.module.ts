import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TicketsController } from "./tickets.controller";
import { TicketsService } from "./tickets.service";
import { Ticket, TicketSchema } from "./schemas/ticket.schema";
import { Comment, CommentSchema } from "./schemas/comment.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
