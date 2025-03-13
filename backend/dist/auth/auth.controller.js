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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(credentials, res) {
        if (!credentials) {
            throw new common_1.BadRequestException("Credenciais não fornecidas");
        }
        const { username, password } = credentials;
        if (typeof username !== "string" || typeof password !== "string") {
            throw new common_1.BadRequestException("Username e password devem ser strings");
        }
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        if (!trimmedUsername || !trimmedPassword) {
            throw new common_1.BadRequestException("Username e password são obrigatórios e não podem estar vazios");
        }
        try {
            const result = await this.authService.loginWithKeycloak({
                username: trimmedUsername,
                password: trimmedPassword,
            });
            if (!result || !result.access_token) {
                throw new Error("Resposta de autenticação inválida");
            }
            console.log("Configurando cookie com o token...");
            const encodedToken = encodeURIComponent(result.access_token);
            res.cookie("auth_token", encodedToken, {
                httpOnly: false,
                secure: false,
                sameSite: "lax",
                path: "/",
                domain: "localhost",
                maxAge: 3600000,
            });
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
            res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
            res.setHeader("Connection", "keep-alive");
            console.log("Token original length:", result.access_token.length);
            console.log("Token codificado length:", encodedToken.length);
            console.log("Headers configurados:", res.getHeaders());
            res.status(201);
            return res.json({
                ...result,
                token_length: result.access_token.length,
                encoded_length: encodedToken.length,
                message: "Login realizado com sucesso",
            });
        }
        catch (error) {
            console.error("Erro na autenticação:", error.message);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.UnauthorizedException(error.message || "Erro na autenticação");
        }
    }
    async validate(authorization) {
        try {
            console.log("Recebendo requisição de validação");
            console.log("Authorization header:", authorization);
            if (!authorization) {
                console.log("Header de autorização não fornecido");
                throw new common_1.UnauthorizedException("Header de autorização não fornecido");
            }
            const token = authorization.replace(/^Bearer\s+/i, "").trim();
            if (!token) {
                console.log("Token não fornecido no header");
                throw new common_1.UnauthorizedException("Token não fornecido");
            }
            console.log("Token extraído, length:", token.length);
            try {
                const payload = await this.authService.validateToken(token);
                console.log("Token validado com sucesso");
                return {
                    valid: true,
                    payload,
                    redirectTo: "/interceptor",
                    setores: payload.setores || [],
                };
            }
            catch (validationError) {
                console.log("Erro na validação do token:", validationError.message);
                throw new common_1.UnauthorizedException(validationError.message || "Token inválido");
            }
        }
        catch (error) {
            console.error("Erro na validação:", error);
            throw new common_1.UnauthorizedException(error.message || "Erro na validação do token");
        }
    }
    async logout(res) {
        res.clearCookie("auth_token");
        return res.json({ message: "Logout realizado com sucesso" });
    }
    getRoles(req) {
        return req.user;
    }
    getSetores(req) {
        return req.user.groups.map((group) => group.replace(/^\/Setores\//, ""));
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("validate"),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)("logout"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("roles"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("keycloak")),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getRoles", null);
__decorate([
    (0, common_1.Get)("setores"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("keycloak")),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getSetores", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map