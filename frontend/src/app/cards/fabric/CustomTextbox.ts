import * as fabric from 'fabric';
import { classRegistry } from 'fabric';


export class CustomTextbox extends fabric.Textbox {
  name: string = '';
  id: string = '';
    override get type(): string {
    return 'custom-textbox';
  }

  override toObject<T extends Omit<fabric.Object & any, keyof fabric.SerializedTextboxProps>, K extends keyof T>(
    propertiesToInclude?: K[]
  ): Pick<T, K> & fabric.SerializedTextboxProps {
    return {
      ...super.toObject([...(propertiesToInclude || []), 'name', 'id'] as K[]),
      name: this.name,
      id: this.id,
    };
  }

  constructor(text: string, options?: any) {
    super(text, options);
    if (options) {
      this.name = options.name || '';
      this.id = options.id || 0;
    }
  }

  
}

classRegistry.setClass(CustomTextbox, 'custom-textbox');

