"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const jwt = require("jsonwebtoken");
let AuthService = class AuthService {
    async loginWithKeycloak(credentials) {
        if (!credentials || !credentials.password || !credentials.username) {
            throw new Error("credenciais inválidas");
        }
        console.log("dados enviados para o Keycloak: ", {
            client_id: "NestJS",
            client_secret: "jmpdqukAg1JmFo0iV3pCOpqmvna3Fm3g",
            grant_type: "password",
            username: credentials.username,
            password: credentials.password,
        });
        try {
            const response = await axios_1.default.post(`http://localhost:8080/realms/Silimed/protocol/openid-connect/token`, new URLSearchParams({
                client_id: "NestJS",
                client_secret: "jmpdqukAg1JmFo0iV3pCOpqmvna3Fm3g",
                grant_type: "password",
                username: credentials.username,
                password: credentials.password,
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            return response.data;
        }
        catch (error) {
            console.log(error.response?.data);
            throw new Error(`falha na autenticação: ${error.response?.data?.error_description || error.message}`);
        }
    }
    async validateToken(token) {
        try {
            const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtGHe2U4Zakpj5jzMhF/Wwcsm/FvyCUxD0g4d8y154Zwopgceb5l59lxpcY49Oc9aOf2l1mvFiypQZnqIBAXGsZnlOuV1JnizSagtubCgoYdR3zXq7Jg2bSLr95xqZLSTZtDUELyJznY8Ph0MrsZQPYVmwl5DAqz/m7QSWSmHhkXxI15pl2rEYlv+xoZdHd8QZT7vUDV7donIyxVDfAw/8PmbmP75KGXr9CuZl/mvl79eXKRGCNfuY4e2i2Txf0OwzC2VlMEvJPBJH47Rfs/jpHU2lTmhogLzYNHXsUkfuZzgGt97U3NdnkeUsQ5uarfEQpn6DBNDKbOf5Xhu26dkdQIDAQAB
-----END PUBLIC KEY-----`;
            const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
            return { payload };
        }
        catch (error) {
            throw new Error(`token inválido: ${error.message}`);
        }
    }
    getHello() {
        return "Hello World!";
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map