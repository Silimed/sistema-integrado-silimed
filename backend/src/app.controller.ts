import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth/auth.service";

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  // @Get("protected")
  // @UseGuards(AuthGuard("jwt"))
  // getProtectedData() {
  //   return {
  //     message: "rota de dados protegidos",
  //   };
  // }

  @Get("dashboard")
  @UseGuards(AuthGuard("keycloak"))
  getDashboard() {
    return {
      message: "rota de dashboard",
    };
  }
}
