import { Strategy } from "passport-jwt";
import { HttpService } from "@nestjs/axios";
declare const KeycloakStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithoutRequest] | [opt: import("passport-jwt").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class KeycloakStrategy extends KeycloakStrategy_base {
    private readonly httpService;
    constructor(httpService: HttpService);
    validate(payload: any): Promise<{
        userId: any;
        username: any;
        roles: any;
    }>;
}
export {};
