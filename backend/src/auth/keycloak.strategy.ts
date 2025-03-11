import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, "keycloak") {
  // constructor() {
  //   super({
  //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //     ignoreExpiration: false,
  //     secretOrKey: "jmpdqukAg1JmFo0iV3pCOpqmvna3Fm3g",
  //     issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
  //   });
  // } estratégia antiga de autenticação do keycloak

  //teste de nova estratégia do keycloak
  constructor(private readonly httpService: HttpService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        try {
          const url = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`;
          const response = await firstValueFrom(this.httpService.get(url));
          const publicKey = response.data.keys[0].x5c[0];
          done(
            null,
            `-----BEGIN CERTIFICATE-----\n${publicKey}\n-----END CERTIFICATE-----`
          );
        } catch (error) {
          done(error);
        }
      },
      issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload.preferred_username,
      roles: payload.realm_access?.roles || [],
    };
  }
}
