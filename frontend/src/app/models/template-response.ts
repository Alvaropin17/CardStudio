import { Template } from "./template";

export interface TemplateResponse {
    error: boolean;
    status: number;
    body: Template[];
}