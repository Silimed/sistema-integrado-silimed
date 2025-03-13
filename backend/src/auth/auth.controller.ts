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
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { valid: false, message: "Token não fornecido" };
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return { valid: false, message: "Token inválido" };
      }

      // Decodifica o token JWT
      const decodedToken = jwt.decode(token) as DecodedToken;
      if (!decodedToken) {
        return { valid: false, message: "Token inválido ou malformado" };
      }

      // Verifica a expiração do token
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        return { valid: false, message: "Token expirado" };
      }

      // Extrai os setores dos grupos
      const setores = (decodedToken.groups || []).map((group) =>
        group.replace(/^\/Setores\//, "")
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
    } catch (error) {
      console.error("Erro na validação do token:", error);
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
