import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Application, applications } from "./interfaces/applications.interface";

@Controller("applications")
export class ApplicationsController {
  @Get()
  @UseGuards(AuthGuard("keycloak"))
  async getAuthorizedApplications(@Req() req): Promise<Application[]> {
    try {
      console.log("=== Início do processamento de aplicações autorizadas ===");
      console.log("Headers da requisição:", req.headers);
      console.log("Token recebido:", req.headers.authorization);

      if (!req.headers.authorization) {
        console.log("Token não encontrado no header");
        throw new UnauthorizedException("Token não fornecido");
      }

      console.log(
        "Dados completos do usuário:",
        JSON.stringify(req.user, null, 2)
      );

      if (!req.user) {
        console.log("Usuário não encontrado na requisição");
        throw new UnauthorizedException("Usuário não autenticado");
      }

      // Obter os setores do usuário do token
      const userSetores = (req.user.groups || []).map((group) => {
        const setor = group.replace(/^\/Setores\//, "");
        console.log(
          `Processando grupo do usuário: ${group} -> setor: ${setor}`
        );
        return setor;
      });

      console.log("Setores do usuário processados:", userSetores);

      // Verificar se o usuário é do setor de TI
      const isTI = userSetores.some(
        (setor) =>
          setor.toLowerCase() === "ti" ||
          setor.toLowerCase() === "desenvolvimento"
      );

      console.log("Usuário é do setor de TI:", isTI);

      if (isTI) {
        console.log(
          "Usuário é do setor de TI - Retornando todas as aplicações"
        );
        return applications;
      }

      if (!userSetores.length) {
        console.log("ATENÇÃO: Usuário não possui setores associados");
        return [];
      }

      console.log("Todas as aplicações disponíveis:", applications);

      // Filtrar as aplicações que o usuário tem acesso baseado em seus setores
      const authorizedApps = applications.filter((app) => {
        const hasAccess = app.setoresPermitidos.some((setor) =>
          userSetores.includes(setor)
        );
        console.log(`Verificando acesso à aplicação ${app.name}:`, {
          setoresPermitidos: app.setoresPermitidos,
          userSetores,
          hasAccess,
        });
        return hasAccess;
      });

      console.log(
        "Aplicações autorizadas final:",
        JSON.stringify(authorizedApps, null, 2)
      );
      console.log("=== Fim do processamento de aplicações autorizadas ===");
      return authorizedApps;
    } catch (error) {
      console.error("Erro ao processar aplicações:", error);
      throw error;
    }
  }
}
