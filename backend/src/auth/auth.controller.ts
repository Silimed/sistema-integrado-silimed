import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  UseGuards,
  Req,
  Get,
  BadRequestException,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
//import { TokenValidationResponse } from "./interfaces/keycloak.interface";
import { Response } from "express";
import * as jwt from "jsonwebtoken";
import { LoginCredentials } from "./interfaces/login-credentials.interface";

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

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() credentials: LoginCredentials, @Res() res: Response) {
    if (!credentials) {
      throw new BadRequestException("Credenciais não fornecidas");
    }

    const { username, password } = credentials;

    if (typeof username !== "string" || typeof password !== "string") {
      throw new BadRequestException("Username e password devem ser strings");
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      throw new BadRequestException(
        "Username e password são obrigatórios e não podem estar vazios"
      );
    }

    try {
      const result = await this.authService.loginWithKeycloak({
        username: trimmedUsername,
        password: trimmedPassword,
      });

      if (!result || !result.access_token) {
        throw new Error("Resposta de autenticação inválida");
      }

      // Configura o cookie com o token
      console.log("Configurando cookie com o token...");

      // Codifica o token para garantir que caracteres especiais sejam tratados corretamente
      const encodedToken = encodeURIComponent(result.access_token);

      // Define o cookie com o token codificado
      res.cookie("auth_token", encodedToken, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        path: "/",
        domain: "localhost",
        maxAge: 3600000, // 1 hora
      });

      // Adiciona headers de CORS específicos para esta resposta
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
      res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
      res.setHeader("Connection", "keep-alive");

      // Log para debug
      console.log("Token original length:", result.access_token.length);
      console.log("Token codificado length:", encodedToken.length);
      console.log("Headers configurados:", res.getHeaders());

      // Garante que todos os headers e cookies sejam enviados antes de finalizar a resposta
      res.status(201);
      return res.json({
        ...result,
        token_length: result.access_token.length,
        encoded_length: encodedToken.length,
        message: "Login realizado com sucesso",
      });
    } catch (error) {
      console.error("Erro na autenticação:", error.message);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException(error.message || "Erro na autenticação");
    }
  }

  @Post("validate")
  async validateToken(@Headers("authorization") authHeader: string) {
    try {
      console.log(
        "Iniciando validação de token com header:",
        authHeader ? "Presente" : "Ausente"
      );

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("Token não fornecido ou formato inválido");
        return {
          valid: false,
          message: "Token não fornecido ou formato inválido",
        };
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        console.log("Token vazio após split");
        return { valid: false, message: "Token inválido" };
      }

      console.log("Token extraído do header, comprimento:", token.length);

      try {
        // Tenta validar o token usando o serviço de autenticação
        const validationResult = await this.authService.validateToken(token);

        // Extrai os setores dos grupos
        const setores = (validationResult.payload.groups || []).map((group) =>
          group.replace(/^\/Setores\//, "")
        );

        console.log("Validação bem-sucedida, setores:", setores);

        // Retorna os dados do token validado
        return {
          valid: true,
          payload: {
            sub: validationResult.payload.sub,
            email:
              validationResult.payload.email ||
              validationResult.payload.preferred_username,
            name:
              validationResult.payload.name ||
              validationResult.payload.preferred_username,
            groups: validationResult.payload.groups,
            roles: validationResult.payload.realm_access?.roles || [],
          },
          setores: setores,
        };
      } catch (validationError) {
        console.error(
          "Erro na validação do token pelo serviço:",
          validationError
        );

        // Tenta decodificar o token manualmente como fallback
        const decodedToken = jwt.decode(token) as DecodedToken;
        if (!decodedToken) {
          console.log("Fallback: Token inválido ou malformado");
          return { valid: false, message: "Token inválido ou malformado" };
        }

        // Verifica a expiração do token
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          console.log("Fallback: Token expirado");
          return { valid: false, message: "Token expirado" };
        }

        // Extrai os setores dos grupos
        const setores = (decodedToken.groups || []).map((group) =>
          group.replace(/^\/Setores\//, "")
        );

        console.log(
          "Fallback: Validação manual bem-sucedida, setores:",
          setores
        );

        // Retorna os dados do token validado
        return {
          valid: true,
          payload: {
            sub: decodedToken.sub,
            email: decodedToken.email,
            name: decodedToken.name,
            groups: decodedToken.groups,
            roles: decodedToken.realm_access?.roles || [],
          },
          setores: setores,
        };
      }
    } catch (error) {
      console.error("Erro geral na validação do token:", error);
      return { valid: false, message: "Erro na validação do token" };
    }
  }

  @Post("logout")
  async logout(@Res() res: Response) {
    res.clearCookie("auth_token");
    return res.json({ message: "Logout realizado com sucesso" });
  }

  @Get("roles")
  @UseGuards(AuthGuard("keycloak"))
  getRoles(@Req() req) {
    return req.user;
  }

  @Get("setores")
  @UseGuards(AuthGuard("keycloak"))
  getSetores(@Req() req) {
    return req.user.groups.map((group) => group.replace(/^\/Setores\//, ""));
  }
}
