import * as fabric from 'fabric';
import { classRegistry } from 'fabric';


export class CustomRect extends fabric.Rect {
    name: string = '';
    id: string = '';
    override get type(): string {
        return 'custom-rect';
    }


    override toObject<T extends Omit<fabric.Object & any, keyof fabric.SerializedRectProps>, K extends keyof T>(
        propertiesToInclude?: K[]
    ): Pick<T, K> & fabric.SerializedRectProps {
        return {
            ...super.toObject([...(propertiesToInclude || []), 'name', 'id'] as K[]),
            name: this.name,
            id: this.id,
        };
    }

    constructor(options?: any) {
        super(options);
        if (options) {
            this.name = options.name || '';
            this.id = options.id || 0;
        }
    }

    
}

classRegistry.setClass(CustomRect);

