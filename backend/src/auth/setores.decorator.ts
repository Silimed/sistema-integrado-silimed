import { SetMetadata } from "@nestjs/common";

export const Setores = (...setores: string[]) =>
  SetMetadata("setores", setores);
