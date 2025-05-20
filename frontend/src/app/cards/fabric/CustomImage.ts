import * as fabric from 'fabric';
import { classRegistry } from 'fabric';


export class CustomImage extends fabric.FabricImage {
    name: string = '';
    id: string = '';
    override get type(): string {
        return 'custom-image';
    }

    override toObject<T extends Omit<fabric.Object & any, keyof fabric.SerializedImageProps>, K extends keyof T>(
        propertiesToInclude?: K[]
    ): Pick<T, K> & fabric.SerializedImageProps {
        return {
            ...super.toObject([...(propertiesToInclude || []), 'name', 'id'] as K[]),
            name: this.name,
            id: this.id,
        };
    }

    constructor(element: HTMLImageElement | HTMLCanvasElement, options?: any) {
        super(element, options);
        if (options) {
            this.name = options.name || '';
            this.id = options.id || 0;
        }
    }


    
}

classRegistry.setClass(CustomImage, 'custom-image');