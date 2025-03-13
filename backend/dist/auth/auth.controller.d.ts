import { AuthService } from "./auth.service";
import { Response } from "express";
import { LoginCredentials } from "./interfaces/login-credentials.interface";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(credentials: LoginCredentials, res: Response): Promise<Response<any, Record<string, any>>>;
    validateToken(authHeader: string): Promise<{
        valid: boolean;
        message: string;
        payload?: undefined;
        setores?: undefined;
    } | {
        valid: boolean;
        payload: {
            sub: string;
            email: string | undefined;
            name: string | undefined;
            groups: string[] | undefined;
            roles: string[];
        };
        setores: string[];
        message?: undefined;
    }>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
    getRoles(req: any): any;
    getSetores(req: any): any;
}
