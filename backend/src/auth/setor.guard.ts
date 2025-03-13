import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class SetorGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const setoresPermitidos = this.reflector.get<string[]>(
      "setores",
      context.getHandler()
    );
    if (!setoresPermitidos) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar grupos em todas as possíveis localizações
    const userGroups = [
      ...(user.groups || []),
      ...(user.realm_access?.groups || []),
      ...(user.resource_access?.["NestJS"]?.groups || []),
    ].map((group) => group.toLowerCase());

    // Mapear os nomes dos setores para o formato que vem do Keycloak
    const setoresFormatados = setoresPermitidos.map((setor) =>
      `/setores/${setor}`.toLowerCase()
    );

    return setoresFormatados.some((setor) => userGroups.includes(setor));
  }
}
