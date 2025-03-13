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
        if (!credentials ||
            typeof credentials.username !== "string" ||
            typeof credentials.password !== "string" ||
            credentials.username.trim() === "" ||
            credentials.password.trim() === "") {
            throw new Error("credenciais inválidas: username e password são obrigatórios");
        }
        const cleanUsername = credentials.username.trim();
        const cleanPassword = credentials.password.trim();
        if (cleanUsername === "" || cleanPassword === "") {
            throw new Error("credenciais inválidas: username e password não podem estar vazios");
        }
        console.log("Tentativa de login para usuário:", cleanUsername);
        try {
            const params = new URLSearchParams({
                client_id: "NestJS",
                client_secret: "jmpdqukAg1JmFo0iV3pCOpqmvna3Fm3g",
                grant_type: "password",
                username: cleanUsername,
                password: cleanPassword,
                scope: "openid profile email groups roles",
            });
            console.log("Parâmetros da requisição:", params.toString());
            const response = await axios_1.default.post(`http://localhost:8080/realms/Silimed/protocol/openid-connect/token`, params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                },
                validateStatus: (status) => status < 500,
            });
            if (response.status !== 200) {
                console.log("Erro na autenticação:", response.status, response.data);
                throw new Error(`Erro na autenticação: ${response.data?.error_description || "Credenciais inválidas"}`);
            }
            const decodedToken = jwt.decode(response.data.access_token);
            if (!decodedToken || typeof decodedToken !== "object") {
                throw new Error("Token inválido recebido do Keycloak");
            }
            if (decodedToken.preferred_username !== cleanUsername) {
                console.log(`Erro de correspondência de usuário: esperado ${cleanUsername}, recebido ${decodedToken.preferred_username}`);
                throw new Error("Erro de autenticação: usuário inválido");
            }
            return response.data;
        }
        catch (error) {
            if (error.response?.data?.error_description ===
                "Account is not fully set up") {
                try {
                    const adminToken = await this.getAdminToken();
                    const usersResponse = await axios_1.default.get(`http://localhost:8080/admin/realms/Silimed/users?username=${cleanUsername}&exact=true`, {
                        headers: {
                            Authorization: `Bearer ${adminToken}`,
                        },
                    });
                    if (!usersResponse.data || usersResponse.data.length === 0) {
                        throw new Error("Usuário não encontrado no Keycloak");
                    }
                    const userId = usersResponse.data[0].id;
                    console.log("Dados atuais do usuário:", usersResponse.data[0]);
                    await axios_1.default.put(`http://localhost:8080/admin/realms/Silimed/users/${userId}`, {
                        enabled: true,
                        emailVerified: true,
                        requiredActions: [],
                    }, {
                        headers: {
                            Authorization: `Bearer ${adminToken}`,
                            "Content-Type": "application/json",
                        },
                    });
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    const retryResponse = await axios_1.default.post(`http://localhost:8080/realms/Silimed/protocol/openid-connect/token`, new URLSearchParams({
                        client_id: "NestJS",
                        client_secret: "jmpdqukAg1JmFo0iV3pCOpqmvna3Fm3g",
                        grant_type: "password",
                        username: cleanUsername,
                        password: cleanPassword,
                        scope: "openid",
                    }), {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    });
                    return retryResponse.data;
                }
                catch (retryError) {
                    console.log("Erro na tentativa de configuração:", retryError.response?.data || retryError.message);
                    throw new Error("Falha ao configurar a conta. Por favor, contate o administrador.");
                }
            }
            console.log("Erro completo:", error.response?.data);
            throw new Error(`falha na autenticação: ${error.response?.data?.error_description || error.message}`);
        }
    }
    async getAdminToken() {
        try {
            const response = await axios_1.default.post(`http://localhost:8080/realms/master/protocol/openid-connect/token`, new URLSearchParams({
                client_id: "admin-cli",
                username: "admin",
                password: "admin",
                grant_type: "password",
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            return response.data.access_token;
        }
        catch (error) {
            console.log("Erro ao obter token admin:", error.response?.data);
            throw new Error("Falha ao obter token administrativo");
        }
    }
    async validateToken(token) {
        try {
            const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtGHe2U4Zakpj5jzMhF/Wwcsm/FvyCUxD0g4d8y154Zwopgceb5l59lxpcY49Oc9aOf2l1mvFiypQZnqIBAXGsZnlOuV1JnizSagtubCgoYdR3zXq7Jg2bSLr95xqZLSTZtDUELyJznY8Ph0MrsZQPYVmwl5DAqz/m7QSWSmHhkXxI15pl2rEYlv+xoZdHd8QZT7vUDV7donIyxVDfAw/8PmbmP75KGXr9CuZl/mvl79eXKRGCNfuY4e2i2Txf0OwzC2VlMEvJPBJH47Rfs/jpHU2lTmhogLzYNHXsUkfuZzgGt97U3NdnkeUsQ5uarfEQpn6DBNDKbOf5Xhu26dkdQIDAQAB
-----END PUBLIC KEY-----`;
            console.log("Iniciando validação do token");
            const payload = jwt.verify(token, publicKey, {
                algorithms: ["RS256"],
            });
            console.log("Token decodificado:", JSON.stringify(payload, null, 2));
            console.log("Grupos originais:", payload.groups);
            const setores = (payload.groups || []).map((group) => {
                const setor = group.replace(/^\/Setores\//, "");
                console.log(`Processando grupo: ${group} -> setor: ${setor}`);
                return setor;
            });
            console.log("Setores extraídos:", setores);
            const response = {
                payload,
                groups: payload.groups || [],
                realm_access: {
                    roles: payload.realm_access?.roles || [],
                    groups: payload.groups || [],
                },
                setores,
            };
            console.log("Resposta final:", JSON.stringify(response, null, 2));
            return response;
        }
        catch (error) {
            console.error("Erro na validação do token:", error);
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