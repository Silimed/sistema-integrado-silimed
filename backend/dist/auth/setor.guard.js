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
exports.SetorGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let SetorGuard = class SetorGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const setoresPermitidos = this.reflector.get("setores", context.getHandler());
        if (!setoresPermitidos) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userGroups = [
            ...(user.groups || []),
            ...(user.realm_access?.groups || []),
            ...(user.resource_access?.["NestJS"]?.groups || []),
        ].map((group) => group.toLowerCase());
        const setoresFormatados = setoresPermitidos.map((setor) => `/setores/${setor}`.toLowerCase());
        return setoresFormatados.some((setor) => userGroups.includes(setor));
    }
};
exports.SetorGuard = SetorGuard;
exports.SetorGuard = SetorGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], SetorGuard);
//# sourceMappingURL=setor.guard.js.map