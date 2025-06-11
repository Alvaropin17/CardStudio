import { User } from "../user";

export interface UserResponse {
    error: boolean;
    status: number;
    body: User;
}