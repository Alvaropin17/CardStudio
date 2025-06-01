import { CardImage } from "../card-image";

export interface UniqueCardImageResponse {
    error: boolean;
    status: number;
    body: CardImage;
}