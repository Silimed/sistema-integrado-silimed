import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  UseGuards,
  Req,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() credentials: { username: string; password: string }) {
    return this.authService.loginWithKeycloak(credentials);
  }

  @Post("validate")
  async validate(@Headers("authorization") authorization: string) {
    const token = authorization.replace("Bearer", "").trim();
    const payload = await this.authService.validateToken(token);

    if (payload) {
      return { valid: true, payload, redirectTo: "/interceptor" };
    } else {
      throw new UnauthorizedException("token inválido");
    }
  }

  @Get("roles")
  @UseGuards(AuthGuard("keycloak"))
  getRoles(@Req() req) {
    return req.user.roles;
  }
}
