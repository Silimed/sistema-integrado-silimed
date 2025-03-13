export interface Application {
    id: string;
    name: string;
    description: string;
    url: string;
    icon: string;
    setoresPermitidos: string[];
}
export declare const applications: Application[];
