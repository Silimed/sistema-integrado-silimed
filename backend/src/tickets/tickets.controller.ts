import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
  Delete,
  Logger,
} from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("tickets")
@UseGuards(AuthGuard("jwt"))
export class TicketsController {
  private readonly logger = new Logger(TicketsController.name);

  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    this.logger.log(`Criando ticket: ${JSON.stringify(createTicketDto)}`);
    this.logger.log(`Usuário: ${JSON.stringify(req.user)}`);

    try {
      return this.ticketsService.create(createTicketDto, req.user.sub);
    } catch (error) {
      this.logger.error(`Erro ao criar ticket: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get()
  findAll() {
    this.logger.log("Buscando todos os tickets");
    return this.ticketsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    this.logger.log(`Buscando ticket por ID: ${id}`);
    return this.ticketsService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateTicketDto: UpdateTicketDto) {
    this.logger.log(
      `Atualizando ticket ${id}: ${JSON.stringify(updateTicketDto)}`
    );
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Post(":id/comments")
  async addComment(
    @Param("id") ticketId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req
  ) {
    this.logger.log(
      `Adicionando comentário ao ticket ${ticketId}: ${JSON.stringify(createCommentDto)}`
    );
    return this.ticketsService.addComment({
      ...createCommentDto,
      ticketId,
      author: req.user.name || req.user.sub,
    });
  }

  @Get(":id/comments")
  async getTicketComments(@Param("id") ticketId: string) {
    this.logger.log(`Buscando comentários do ticket ${ticketId}`);
    return this.ticketsService.getTicketComments(ticketId);
  }

  @Delete("comments/:id")
  async deleteComment(@Param("id") commentId: string, @Request() req) {
    this.logger.log(`Excluindo comentário ${commentId}`);
    return this.ticketsService.deleteComment(commentId, req.user.sub);
  }

  @Get("user/me")
  findMyTickets(@Request() req) {
    this.logger.log(`Buscando tickets do usuário ${req.user.sub}`);
    return this.ticketsService.findByUser(req.user.sub);
  }

  @Get("assignee/me")
  findAssignedToMe(@Request() req) {
    this.logger.log(`Buscando tickets atribuídos ao usuário ${req.user.sub}`);
    return this.ticketsService.findByAssignee(req.user.sub);
  }

  @Get("sector/:sector")
  findBySector(@Param("sector") sector: string) {
    this.logger.log(`Buscando tickets do setor ${sector}`);
    return this.ticketsService.findBySector(sector);
  }
}
