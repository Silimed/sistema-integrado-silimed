import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(credentials: {
        username: string;
        password: string;
    }): Promise<any>;
    validate(authorization: string): Promise<{
        valid: boolean;
        payload: {
            payload: string | import("jsonwebtoken").JwtPayload;
        };
        redirectTo: string;
    }>;
    getRoles(req: any): any;
}
