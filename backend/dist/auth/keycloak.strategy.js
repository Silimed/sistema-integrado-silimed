"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
let KeycloakStrategy = class KeycloakStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, "keycloak") {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtGHe2U4Zakpj5jzMhF/Wwcsm/FvyCUxD0g4d8y154Zwopgceb5l59lxpcY49Oc9aOf2l1mvFiypQZnqIBAXGsZnlOuV1JnizSagtubCgoYdR3zXq7Jg2bSLr95xqZLSTZtDUELyJznY8Ph0MrsZQPYVmwl5DAqz/m7QSWSmHhkXxI15pl2rEYlv+xoZdHd8QZT7vUDV7donIyxVDfAw/8PmbmP75KGXr9CuZl/mvl79eXKRGCNfuY4e2i2Txf0OwzC2VlMEvJPBJH47Rfs/jpHU2lTmhogLzYNHXsUkfuZzgGt97U3NdnkeUsQ5uarfEQpn6DBNDKbOf5Xhu26dkdQIDAQAB
-----END PUBLIC KEY-----`,
            algorithms: ["RS256"],
            issuer: `${process.env.KEYCLOAK_URL || "http://localhost:8080"}/realms/${process.env.KEYCLOAK_REALM || "Silimed"}`,
        });
    }
    async validate(payload) {
        try {
            console.log("=== Validação do Payload ===");
            console.log("Payload completo recebido:", JSON.stringify(payload, null, 2));
            if (!payload) {
                console.error("Payload do token está vazio");
                throw new common_1.UnauthorizedException("Payload do token inválido");
            }
            if (!payload.sub) {
                console.error("Payload não contém o campo 'sub'");
                throw new common_1.UnauthorizedException("Token inválido: falta identificação do usuário");
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
        }
        catch (error) {
            console.error("Erro na validação do payload:", error);
            throw new common_1.UnauthorizedException(error.message || "Token inválido");
        }
    }
};
exports.KeycloakStrategy = KeycloakStrategy;
exports.KeycloakStrategy = KeycloakStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], KeycloakStrategy);
//# sourceMappingURL=keycloak.strategy.js.map