import { TokenValidationResponse } from "./interfaces/keycloak.interface";
export declare class AuthService {
    loginWithKeycloak(credentials: {
        username: string;
        password: string;
    }): Promise<any>;
    private getAdminToken;
    validateToken(token: string): Promise<TokenValidationResponse>;
    getHello(): string;
}
