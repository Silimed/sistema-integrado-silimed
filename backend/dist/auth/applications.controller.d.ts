import { Application } from "./interfaces/applications.interface";
import { AuthService } from "./auth.service";
export declare class ApplicationsController {
    private readonly authService;
    constructor(authService: AuthService);
    getAuthorizedApplications(authHeader: string): Promise<Application[]>;
    getAuthorizedApplicationsWithGuard(req: any): Promise<Application[]>;
}
