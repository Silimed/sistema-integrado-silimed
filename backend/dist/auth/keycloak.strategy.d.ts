import { Strategy } from "passport-jwt";
interface KeycloakPayload {
    sub: string;
    preferred_username: string;
    realm_access?: {
        roles?: string[];
    };
    groups?: string[];
    resource_access?: {
        [key: string]: {
            roles?: string[];
            groups?: string[];
        };
    };
}
declare const KeycloakStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class KeycloakStrategy extends KeycloakStrategy_base {
    constructor();
    validate(payload: KeycloakPayload): Promise<{
        userId: string;
        username: string;
        roles: string[];
        groups: string[];
        realm_access: {
            roles: string[];
            groups: string[];
        };
    }>;
}
export {};
