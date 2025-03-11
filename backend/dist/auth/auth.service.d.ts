import * as jwt from "jsonwebtoken";
export declare class AuthService {
    loginWithKeycloak(credentials: {
        username: string;
        password: string;
    }): Promise<any>;
    validateToken(token: string): Promise<{
        payload: string | jwt.JwtPayload;
    }>;
    getHello(): string;
}
