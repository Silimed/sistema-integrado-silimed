export interface KeycloakPayload {
    sub: string;
    preferred_username: string;
    email?: string;
    name?: string;
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
export interface TokenValidationResponse {
    payload: KeycloakPayload;
    groups: string[];
    realm_access: {
        roles: string[];
        groups: string[];
    };
    setores: string[];
}
