import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

interface KeycloakPayload {
  sub: string;
  preferred_username: string;
  realm_access?: {
    roles?: string[];
  };
  groups?: string[];
  resource_access?: {
    [key: string]: {
      roles?: string[];
      groups?: string[];
    };
  };
}

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, "keycloak") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtGHe2U4Zakpj5jzMhF/Wwcsm/FvyCUxD0g4d8y154Zwopgceb5l59lxpcY49Oc9aOf2l1mvFiypQZnqIBAXGsZnlOuV1JnizSagtubCgoYdR3zXq7Jg2bSLr95xqZLSTZtDUELyJznY8Ph0MrsZQPYVmwl5DAqz/m7QSWSmHhkXxI15pl2rEYlv+xoZdHd8QZT7vUDV7donIyxVDfAw/8PmbmP75KGXr9CuZl/mvl79eXKRGCNfuY4e2i2Txf0OwzC2VlMEvJPBJH47Rfs/jpHU2lTmhogLzYNHXsUkfuZzgGt97U3NdnkeUsQ5uarfEQpn6DBNDKbOf5Xhu26dkdQIDAQAB
-----END PUBLIC KEY-----`,
      algorithms: ["RS256"],
      issuer: `${process.env.KEYCLOAK_URL || "http://localhost:8080"}/realms/${process.env.KEYCLOAK_REALM || "Silimed"}`,
    });
  }

  async validate(payload: KeycloakPayload) {
    try {
      console.log("=== Validação do Payload ===");
      console.log(
        "Payload completo recebido:",
        JSON.stringify(payload, null, 2)
      );

      if (!payload) {
        console.error("Payload do token está vazio");
        throw new UnauthorizedException("Payload do token inválido");
      }

      if (!payload.sub) {
        console.error("Payload não contém o campo 'sub'");
        throw new UnauthorizedException(
          "Token inválido: falta identificação do usuário"
        );
      }

      const groups = payload.groups || [];

      const user = {
        userId: payload.sub,
        username: payload.preferred_username,
        roles: payload.realm_access?.roles || [],
        groups: groups,
        realm_access: {
          roles: payload.realm_access?.roles || [],
          groups: groups,
        },
      };

      console.log("Usuário processado:", JSON.stringify(user, null, 2));
      return user;
    } catch (error) {
      console.error("Erro na validação do payload:", error);
      throw new UnauthorizedException(error.message || "Token inválido");
    }
  }
}
