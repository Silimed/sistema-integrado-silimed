import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  Headers,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Application, applications } from "./interfaces/applications.interface";
import { AuthService } from "./auth.service";
import * as jwt from "jsonwebtoken";

interface DecodedToken {
  sub: string;
  email?: string;
  name?: string;
  groups?: string[];
  realm_access?: {
    roles: string[];
  };
  exp?: number;
}

@Controller("applications")
export class ApplicationsController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getAuthorizedApplications(
    @Headers("authorization") authHeader: string
  ): Promise<Application[]> {
    try {
      console.log("=== Início do processamento de aplicações autorizadas ===");
      console.log(
        "Header de autorização:",
        authHeader ? "Presente" : "Ausente"
      );

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("Token não encontrado no header");
        throw new UnauthorizedException("Token não fornecido");
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        console.log("Token vazio após split");
        throw new UnauthorizedException("Token inválido");
      }

      console.log("Token extraído do header, comprimento:", token.length);

      // Decodifica o token JWT
      let userGroups: string[] = [];
      let userSetores: string[] = [];

      try {
        // Tenta validar o token usando o serviço de autenticação
        const validationResult = await this.authService.validateToken(token);
        userGroups = validationResult.payload.groups || [];

        // Extrai os setores dos grupos
        userSetores = userGroups.map((group) => {
          const setor = group.replace(/^\/Setores\//, "");
          console.log(
            `Processando grupo do usuário: ${group} -> setor: ${setor}`
          );
          return setor;
        });
      } catch (validationError) {
        console.error(
          "Erro na validação do token pelo serviço:",
          validationError
        );

        // Tenta decodificar o token manualmente como fallback
        const decodedToken = jwt.decode(token) as DecodedToken;
        if (!decodedToken) {
          console.log("Fallback: Token inválido ou malformado");
          throw new UnauthorizedException("Token inválido ou malformado");
        }

        // Verifica a expiração do token
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.log("Fallback: Token expirado");
          throw new UnauthorizedException("Token expirado");
        }

        userGroups = decodedToken.groups || [];

        // Extrai os setores dos grupos
        userSetores = userGroups.map((group) => {
          const setor = group.replace(/^\/Setores\//, "");
          console.log(
            `Processando grupo do usuário: ${group} -> setor: ${setor}`
          );
          return setor;
        });
      }

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

      console.log("Todas as aplicações disponíveis:", applications.length);

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

      console.log("Aplicações autorizadas final:", authorizedApps.length);
      console.log("=== Fim do processamento de aplicações autorizadas ===");
      return authorizedApps;
    } catch (error) {
      console.error("Erro ao processar aplicações:", error);
      throw error;
    }
  }

  // Endpoint alternativo que usa o AuthGuard
  @Get("guard")
  @UseGuards(AuthGuard("keycloak"))
  async getAuthorizedApplicationsWithGuard(@Req() req): Promise<Application[]> {
    try {
      console.log("=== Início do processamento de aplicações com guard ===");
      console.log("Dados do usuário:", req.user ? "Presente" : "Ausente");

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

      console.log("Aplicações autorizadas final:", authorizedApps.length);
      console.log("=== Fim do processamento de aplicações com guard ===");
      return authorizedApps;
    } catch (error) {
      console.error("Erro ao processar aplicações com guard:", error);
      throw error;
    }
  }
}
