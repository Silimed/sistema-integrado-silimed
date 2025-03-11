import { AuthService } from "./auth/auth.service";
export declare class AppController {
    private readonly authService;
    constructor(authService: AuthService);
    getHello(): string;
    getDashboard(): {
        message: string;
    };
}
