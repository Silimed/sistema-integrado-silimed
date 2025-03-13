import { Application } from "./interfaces/applications.interface";
export declare class ApplicationsController {
    getAuthorizedApplications(req: any): Promise<Application[]>;
}
