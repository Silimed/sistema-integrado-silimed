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
let ApplicationsController = class ApplicationsController {
    async getAuthorizedApplications(req) {
        try {
            console.log("=== Início do processamento de aplicações autorizadas ===");
            console.log("Headers da requisição:", req.headers);
            console.log("Token recebido:", req.headers.authorization);
            if (!req.headers.authorization) {
                console.log("Token não encontrado no header");
                throw new common_1.UnauthorizedException("Token não fornecido");
            }
            console.log("Dados completos do usuário:", JSON.stringify(req.user, null, 2));
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
            console.log("Todas as aplicações disponíveis:", applications_interface_1.applications);
            const authorizedApps = applications_interface_1.applications.filter((app) => {
                const hasAccess = app.setoresPermitidos.some((setor) => userSetores.includes(setor));
                console.log(`Verificando acesso à aplicação ${app.name}:`, {
                    setoresPermitidos: app.setoresPermitidos,
                    userSetores,
                    hasAccess,
                });
                return hasAccess;
            });
            console.log("Aplicações autorizadas final:", JSON.stringify(authorizedApps, null, 2));
            console.log("=== Fim do processamento de aplicações autorizadas ===");
            return authorizedApps;
        }
        catch (error) {
            console.error("Erro ao processar aplicações:", error);
            throw error;
        }
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("keycloak")),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "getAuthorizedApplications", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, common_1.Controller)("applications")
], ApplicationsController);
//# sourceMappingURL=applications.controller.js.map