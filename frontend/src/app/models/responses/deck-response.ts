import { Deck } from "../deck";

export interface CardImageResponse {
    error: boolean;
    status: number;
    body: Deck[];
}