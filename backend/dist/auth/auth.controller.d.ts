import { AuthService } from "./auth.service";
import { TokenValidationResponse } from "./interfaces/keycloak.interface";
import { Response } from "express";
interface LoginCredentials {
    username: string;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(credentials: LoginCredentials, res: Response): Promise<Response<any, Record<string, any>>>;
    validate(authorization: string): Promise<{
        valid: boolean;
        payload: TokenValidationResponse;
        redirectTo: string;
        setores: string[];
    }>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
    getRoles(req: any): any;
    getSetores(req: any): any;
}
export {};
