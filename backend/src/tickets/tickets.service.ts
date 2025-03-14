import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ticket, TicketDocument, TicketStatus } from "./schemas/ticket.schema";
import { Comment } from "./schemas/comment.schema";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>
  ) {}

  async create(
    createTicketDto: CreateTicketDto,
    userId: string
  ): Promise<Ticket> {
    this.logger.log(
      `Criando ticket com dados: ${JSON.stringify(createTicketDto)}`
    );
    this.logger.log(`ID do usuário: ${userId}`);

    try {
      const createdTicket = new this.ticketModel({
        ...createTicketDto,
        createdBy: userId,
        status: TicketStatus.OPEN,
      });

      this.logger.log(`Ticket criado: ${JSON.stringify(createdTicket)}`);
      const savedTicket = await createdTicket.save();
      this.logger.log(`Ticket salvo com ID: ${savedTicket._id}`);

      return savedTicket;
    } catch (error) {
      this.logger.error(`Erro ao criar ticket: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Ticket[]> {
    this.logger.log("Buscando todos os tickets");
    return this.ticketModel.find().exec();
  }

  async findOne(id: string): Promise<Ticket> {
    this.logger.log(`Buscando ticket com ID: ${id}`);
    const ticket = await this.ticketModel.findById(id).exec();
    if (!ticket) {
      this.logger.warn(`Ticket #${id} não encontrado`);
      throw new NotFoundException(`Ticket #${id} não encontrado`);
    }
    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    this.logger.log(
      `Atualizando ticket ${id} com dados: ${JSON.stringify(updateTicketDto)}`
    );
    const updatedTicket = await this.ticketModel
      .findByIdAndUpdate(id, updateTicketDto, { new: true })
      .exec();
    if (!updatedTicket) {
      this.logger.warn(`Ticket #${id} não encontrado para atualização`);
      throw new NotFoundException(`Ticket #${id} não encontrado`);
    }
    return updatedTicket;
  }

  async addComment(createCommentDto: CreateCommentDto & { author: string }) {
    this.logger.log(
      `Adicionando comentário: ${JSON.stringify(createCommentDto)}`
    );

    try {
      const comment = new this.commentModel({
        content: createCommentDto.content,
        author: createCommentDto.author,
        ticketId: createCommentDto.ticketId,
      });

      const savedComment = await comment.save();
      this.logger.log(`Comentário salvo com ID: ${savedComment._id}`);

      await this.ticketModel.findByIdAndUpdate(createCommentDto.ticketId, {
        $push: { comments: savedComment },
      });

      return savedComment;
    } catch (error) {
      this.logger.error(
        `Erro ao adicionar comentário: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async getTicketComments(ticketId: string) {
    this.logger.log(`Buscando comentários do ticket ${ticketId}`);
    return this.commentModel.find({ ticketId }).sort({ createdAt: 1 });
  }

  async deleteComment(commentId: string, userId: string) {
    this.logger.log(`Excluindo comentário ${commentId} pelo usuário ${userId}`);

    try {
      const comment = await this.commentModel.findById(commentId);

      if (!comment || comment.author !== userId) {
        this.logger.warn(
          `Comentário não encontrado ou sem permissão para excluir`
        );
        throw new NotFoundException(
          "Comentário não encontrado ou sem permissão para excluir"
        );
      }

      const ticket = await this.ticketModel.findOne({
        "comments._id": commentId,
      });

      if (ticket) {
        await this.ticketModel.findByIdAndUpdate(ticket._id, {
          $pull: { comments: { _id: commentId } },
        });
      }

      return this.commentModel.findByIdAndDelete(commentId);
    } catch (error) {
      this.logger.error(
        `Erro ao excluir comentário: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async findByUser(userId: string): Promise<Ticket[]> {
    this.logger.log(`Buscando tickets do usuário ${userId}`);
    return this.ticketModel.find({ createdBy: userId }).exec();
  }

  async findByAssignee(userId: string): Promise<Ticket[]> {
    this.logger.log(`Buscando tickets atribuídos ao usuário ${userId}`);
    return this.ticketModel.find({ assignedTo: userId }).exec();
  }

  async findBySector(sector: string): Promise<Ticket[]> {
    this.logger.log(`Buscando tickets do setor ${sector}`);
    return this.ticketModel.find({ sector }).exec();
  }
}
