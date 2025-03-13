import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth/auth.service";
import { AppService } from "./app.service";
//import { SetorGuard } from "./auth/setor.guard";
//import { Setores } from "./auth/setores.decorator";

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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

  // @UseGuards(AuthGuard("keycloak"), SetorGuard)
  // @Get("financeiro")
  // @Setores("Financeiro")
  // getFinanceiro() {
  //   return { message: "Rota do financeiro" };
  // }

  // @UseGuards(AuthGuard("keycloak"), SetorGuard)
  // @Get("ti")
  // @Setores("TI")
  // getTI() {
  //   return { message: "Rota da TI" };
  // }
}
