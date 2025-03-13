import { AuthService } from "./auth/auth.service";
import { AppService } from "./app.service";
export declare class AppController {
    private readonly authService;
    private readonly appService;
    constructor(authService: AuthService, appService: AppService);
    getHello(): string;
    getDashboard(): {
        message: string;
    };
}
