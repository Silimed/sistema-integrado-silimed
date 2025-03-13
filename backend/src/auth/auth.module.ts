import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { KeycloakStrategy } from "./keycloak.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { HttpModule } from "@nestjs/axios";
import { ApplicationsController } from "./applications.controller";
//import { QuickOrderController } from "./quick-order.controller";
//import { QuickOrderService } from "./quick-order.service";

@Module({
  imports: [
    PassportModule,
    HttpModule,
    JwtModule.register({
      publicKey: process.env.KEYCLOAK_PUBLIC_REALM_KEY as string,
      secret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [KeycloakStrategy, AuthService],
  controllers: [AuthController, ApplicationsController],
  exports: [AuthService],
})
export class AuthModule {}
