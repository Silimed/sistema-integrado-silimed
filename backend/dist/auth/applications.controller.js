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
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const applications_interface_1 = require("./interfaces/applications.interface");
const auth_service_1 = require("./auth.service");
const jwt = require("jsonwebtoken");
let ApplicationsController = class ApplicationsController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async getAuthorizedApplications(authHeader) {
        try {
            console.log("=== Início do processamento de aplicações autorizadas ===");
            console.log("Header de autorização:", authHeader ? "Presente" : "Ausente");
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                console.log("Token não encontrado no header");
                throw new common_1.UnauthorizedException("Token não fornecido");
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                console.log("Token vazio após split");
                throw new common_1.UnauthorizedException("Token inválido");
            }
            console.log("Token extraído do header, comprimento:", token.length);
            let userGroups = [];
            let userSetores = [];
            try {
                const validationResult = await this.authService.validateToken(token);
                userGroups = validationResult.payload.groups || [];
                userSetores = userGroups.map((group) => {
                    const setor = group.replace(/^\/Setores\//, "");
                    console.log(`Processando grupo do usuário: ${group} -> setor: ${setor}`);
                    return setor;
                });
            }
            catch (validationError) {
                console.error("Erro na validação do token pelo serviço:", validationError);
                const decodedToken = jwt.decode(token);
                if (!decodedToken) {
                    console.log("Fallback: Token inválido ou malformado");
                    throw new common_1.UnauthorizedException("Token inválido ou malformado");
                }
                const currentTime = Math.floor(Date.now() / 1000);
                if (decodedToken.exp && decodedToken.exp < currentTime) {
                    console.log("Fallback: Token expirado");
                    throw new common_1.UnauthorizedException("Token expirado");
                }
                userGroups = decodedToken.groups || [];
                userSetores = userGroups.map((group) => {
                    const setor = group.replace(/^\/Setores\//, "");
                    console.log(`Processando grupo do usuário: ${group} -> setor: ${setor}`);
                    return setor;
                });
            }
            console.log("Setores do usuário processados:", userSetores);
            const isTI = userSetores.some((setor) => setor.toLowerCase() === "ti" ||
                setor.toLowerCase() === "desenvolvimento");
            console.log("Usuário é do setor de TI:", isTI);
            if (isTI) {
                console.log("Usuário é do setor de TI - Retornando todas as aplicações");
                return applications_interface_1.applications;
            }
            if (!userSetores.length) {
                console.log("ATENÇÃO: Usuário não possui setores associados");
                return [];
            }
            console.log("Todas as aplicações disponíveis:", applications_interface_1.applications.length);
            const authorizedApps = applications_interface_1.applications.filter((app) => {
                const hasAccess = app.setoresPermitidos.some((setor) => userSetores.includes(setor));
                console.log(`Verificando acesso à aplicação ${app.name}:`, {
                    setoresPermitidos: app.setoresPermitidos,
                    userSetores,
                    hasAccess,
                });
                return hasAccess;
            });
            console.log("Aplicações autorizadas final:", authorizedApps.length);
            console.log("=== Fim do processamento de aplicações autorizadas ===");
            return authorizedApps;
        }
        catch (error) {
            console.error("Erro ao processar aplicações:", error);
            throw error;
        }
    }
    async getAuthorizedApplicationsWithGuard(req) {
        try {
            console.log("=== Início do processamento de aplicações com guard ===");
            console.log("Dados do usuário:", req.user ? "Presente" : "Ausente");
            if (!req.user) {
                console.log("Usuário não encontrado na requisição");
                throw new common_1.UnauthorizedException("Usuário não autenticado");
            }
            const userSetores = (req.user.groups || []).map((group) => {
                const setor = group.replace(/^\/Setores\//, "");
                console.log(`Processando grupo do usuário: ${group} -> setor: ${setor}`);
                return setor;
            });
            console.log("Setores do usuário processados:", userSetores);
            const isTI = userSetores.some((setor) => setor.toLowerCase() === "ti" ||
                setor.toLowerCase() === "desenvolvimento");
            console.log("Usuário é do setor de TI:", isTI);
            if (isTI) {
                console.log("Usuário é do setor de TI - Retornando todas as aplicações");
                return applications_interface_1.applications;
            }
            if (!userSetores.length) {
                console.log("ATENÇÃO: Usuário não possui setores associados");
                return [];
            }
            const authorizedApps = applications_interface_1.applications.filter((app) => {
                const hasAccess = app.setoresPermitidos.some((setor) => userSetores.includes(setor));
                console.log(`Verificando acesso à aplicação ${app.name}:`, {
                    setoresPermitidos: app.setoresPermitidos,
                    userSetores,
                    hasAccess,
                });
                return hasAccess;
            });
            console.log("Aplicações autorizadas final:", authorizedApps.length);
            console.log("=== Fim do processamento de aplicações com guard ===");
            return authorizedApps;
        }
        catch (error) {
            console.error("Erro ao processar aplicações com guard:", error);
            throw error;
        }
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)("authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "getAuthorizedApplications", null);
__decorate([
    (0, common_1.Get)("guard"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("keycloak")),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "getAuthorizedApplicationsWithGuard", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, common_1.Controller)("applications"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], ApplicationsController);
//# sourceMappingURL=applications.controller.js.map