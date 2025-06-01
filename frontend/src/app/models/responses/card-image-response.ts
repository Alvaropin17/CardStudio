import { CardImage } from "../card-image";

export interface CardImageResponse {
    error: boolean;
    status: number;
    body: CardImage[];
}