import { Deck } from "../deck";

export interface UniqueCardImageResponse {
    error: boolean;
    status: number;
    body: Deck;
}