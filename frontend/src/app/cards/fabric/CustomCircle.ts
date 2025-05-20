import * as fabric from 'fabric';
import { classRegistry } from 'fabric';


export class CustomCircle extends fabric.Circle {
    name: string = '';
    id: string = '';
    override get type(): string {
        return 'custom-circle';
    }

    override toObject<T extends Omit<fabric.Object & any, keyof fabric.SerializedCircleProps>, K extends keyof T>(
        propertiesToInclude?: K[]
    ): Pick<T, K> & fabric.SerializedCircleProps {
        return {
            ...super.toObject([...(propertiesToInclude || []), 'name', 'id'] as K[]),
            name: this.name,
            id: this.id,
            type: 'custom-circle'
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

classRegistry.setClass(CustomCircle, 'custom-circle');