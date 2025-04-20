import * as fabric from 'fabric';

export interface CanvasObject {
    id: string;
    name: string;
    type: string;
    fabricObject: fabric.Object;
}
