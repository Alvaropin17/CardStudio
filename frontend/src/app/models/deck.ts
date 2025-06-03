import { Types } from 'mongoose';

export interface Deck {
  userId: number;
  name: string;
  fileIds: Types.ObjectId[];
}