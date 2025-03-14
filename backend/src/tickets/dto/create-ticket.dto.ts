import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { TicketPriority } from "../schemas/ticket.schema";

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @IsString()
  @IsNotEmpty()
  sector: string;
}
