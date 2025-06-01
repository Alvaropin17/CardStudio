import { Template } from "../template";

export interface UniqueTemplateResponse {
    error: boolean;
    status: number;
    body: Template;
}