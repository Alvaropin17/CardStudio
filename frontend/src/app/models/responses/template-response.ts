import { Template } from "../template";

export interface TemplatesResponse {
    error: boolean;
    status: number;
    body: Template[];
}