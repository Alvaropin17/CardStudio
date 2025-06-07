import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CanvasObject } from '../models/canvas-object';
import { v4 as uuidv4 } from 'uuid';
import { TemplatesService } from '../../services/templates.service';
import { Template } from '../../models/template';

import * as fabric from 'fabric';



@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  standalone: false
})
export class EditorComponent implements AfterViewInit {



  constructor(

    private templateService: TemplatesService,
    private route: ActivatedRoute,

  ) { }

  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private canvas!: fabric.Canvas;

  activeObject: fabric.Object | null = null;

  importedJson: string = '';
  importedJsonId: string | null = '';

  elementCounter: number = 1;

  objectName: string = 'Element';
  newName: string = '';


  canvasObjectsList: CanvasObject[] = [];


  templateToSave: Template | null = null;
  templateName: string = '';


  selectedColor: string = '#ff0000';
  selectedFont: string = 'Arial';
  selectedFontSize: number = 20;

  selectedFontFamily: string = 'Arial, sans-serif';

  updateObjectName() {
    this.elementCounter++;
    this.objectName = 'Element ' + this.elementCounter;
  }

  onFontChange() { }

  ngOnInit(): void {

    this.importedJsonId = this.route.snapshot.paramMap.get('id');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (this.importedJsonId && user?.id) {
      this.templateService.getTemplateById(user.id, +this.importedJsonId).subscribe({
        next: (templateResponse) => {

          this.importedJson = templateResponse.body.canvas_json;
          this.loadCanvasFromJson();
        },
        error: (err) => {
          console.error('Error al cargar template:', err);
        }
      });
    }
    this.extendFabricSerialization();
  }

  extendFabricSerialization() {
  fabric.FabricObject.prototype.toObject = (function (toObject) {
    return function (this: any, ...args: any[]) {
      return {
        ...toObject.call(this, ...args),
        id: this.id,
        name: this.name
      };
    };
  })(fabric.Object.prototype.toObject);
}

  ngAfterViewInit(): void {

    if (this.importedJson && this.canvas) {
      this.canvas.loadFromJSON(this.importedJson, () => {
        this.canvas.renderAll();
        console.log('Template cargado en el canvas');
      });
    }

    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement, {
      width: 600,
      height: 900,
      backgroundColor: '#fff'
    });

    this.canvas.on('selection:created', (e) => {
      this.activeObject = e.selected ? e.selected[0] : null;
      this.updateNewNameFromActiveObject(); // <-- sincroniza el nombre
    });

    this.canvas.on('selection:updated', (e) => {
      this.activeObject = e.selected ? e.selected[0] : null;
      this.updateNewNameFromActiveObject(); // <-- sincroniza el nombre
    });

    this.canvas.on('selection:cleared', () => {
      this.activeObject = null;
    });;

    this.canvas.renderAll();

  }

  updateNewNameFromActiveObject() {
    this.newName = (this.activeObject as any)?.name || '';
  }

  //------------------------------------TOOLBAR------------------------------------


  addText() {
    const text = new fabric.Textbox('Texto nuevo', {
      left: 50,
      top: 50,
      width: 200,
      fill: this.selectedColor,
      fontFamily: this.selectedFont,
      fontSize: this.selectedFontSize
    });

    const id = uuidv4();
    text.set({ name: this.objectName, id });

    this.canvas.add(text);
    this.canvas.setActiveObject(text);

    this.canvasObjectsList.unshift({
      id,
      name: this.objectName,
      type: 'Text',
      fabricObject: text
    });

    this.updateObjectName();

  }

  addRectangle() {
    const rect = new fabric.Rect({
      left: 100,
      top: 150,
      fill: this.selectedColor,
      width: 200,
      height: 100
    });

    const id = uuidv4();
    rect.set({ name: this.objectName, id });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);

    this.canvasObjectsList.unshift({
      id,
      name: this.objectName,
      type: 'Rectangle',
      fabricObject: rect
    });

    this.updateObjectName();

  }

  addCircle() {
    const circle = new fabric.Circle({
      left: 300,
      top: 150,
      radius: 50,
      fill: this.selectedColor,
    });

    const id = uuidv4();
    circle.name = this.objectName;
    circle.id = id;
    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);

    this.canvasObjectsList.unshift({
      id,
      name: this.objectName,
      type: 'Circle',
      fabricObject: circle
    });

    this.updateObjectName();

  }

  addCanvasBorder() {
    const border = new fabric.Rect({
      left: 0.5,
      top: 0.5,
      width: this.canvas.getWidth() - 3,
      height: this.canvas.getHeight() - 3,
      fill: 'transparent',
      stroke: 'black',
      strokeUniform: true,
      strokeWidth: 2,
      selectable: true,
      evented: true,
      name: 'Border',
    });


    const id = uuidv4();
    border.set({ name: this.objectName, id });

    this.canvas.add(border);
    this.canvas.setActiveObject(border);

    this.canvasObjectsList.unshift({
      id,
      name: this.objectName,
      type: 'Border',
      fabricObject: border
    });

    this.updateObjectName();
  }


  async loadImage(imagePath: string): Promise<void> {
    try {
      const img = await fabric.FabricImage.fromURL(`images/${imagePath}`);

      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
        hasControls: true,
        lockScalingFlip: true,
        cornerStyle: 'circle',
        transparentCorners: false
      });

      img.setControlsVisibility({
        mt: true, // middle top
        mb: true, // middle bottom
        ml: true, // middle left
        mr: true, // middle right
        tl: true, // top left
        tr: true, // top right
        bl: true, // bottom left
        br: true  // bottom right
      });

      const id = uuidv4();
      img.set({ name: this.objectName, id });

      this.canvas.add(img);
      this.canvas.setActiveObject(img);

      this.canvasObjectsList.unshift({
        id: id,
        name: this.objectName,
        type: 'Image',
        fabricObject: img
      });

      this.updateObjectName();

      this.canvas.renderAll();
    } catch (error) {
      console.error('Error al cargar imagen:', error);
    }
  }

  deleteActiveObject() {
    if (this.activeObject) {

      const objectIndex = this.canvasObjectsList.findIndex(obj => obj.fabricObject === this.activeObject);
      if (objectIndex !== -1) {
        this.canvasObjectsList.splice(objectIndex, 1);
      }

      this.canvas.remove(this.activeObject);

      this.activeObject = null;

      this.canvas.renderAll();
    }
  }

  clearCanvas() {
    this.canvas.clear();
    this.canvas.backgroundColor = '#fff';
    this.canvas.renderAll();

    this.canvasObjectsList = [];
  }

  //------------------------------------LIST ------------------------------------


  selectObjectFromList(object: CanvasObject) {
    const fabricObject = object.fabricObject;
    if (fabricObject) {
      this.canvas.setActiveObject(fabricObject);
      this.activeObject = fabricObject;
      this.canvas.renderAll();
    }
  }

  private redrawCanvas(): void {
    this.canvas.clear();
    this.canvas.backgroundColor = '#fff';

    const reversedList: CanvasObject[] = [...this.canvasObjectsList].reverse();

    reversedList.forEach(obj => {
      this.canvas.add(obj.fabricObject);
    });

    if (this.activeObject) {
      this.canvas.setActiveObject(this.activeObject);
    }

    this.canvas.renderAll();
  }

  // Move object up or down in the list

  moveUp(): void {
    if (!this.activeObject) return;

    const index = this.canvasObjectsList.findIndex(
      obj => obj.fabricObject === this.activeObject
    );

    if (index > 0) {
      [this.canvasObjectsList[index], this.canvasObjectsList[index - 1]] =
        [this.canvasObjectsList[index - 1], this.canvasObjectsList[index]];
      this.redrawCanvas();
    }
  }

  moveDown(): void {
    if (!this.activeObject) return;

    const index = this.canvasObjectsList.findIndex(
      obj => obj.fabricObject === this.activeObject
    );

    if (index < this.canvasObjectsList.length - 1) {
      [this.canvasObjectsList[index], this.canvasObjectsList[index + 1]] =
        [this.canvasObjectsList[index + 1], this.canvasObjectsList[index]];
      this.redrawCanvas();
    }
  }

  bringToFront(): void {
    if (!this.activeObject) return;

    const index = this.canvasObjectsList.findIndex(
      obj => obj.fabricObject === this.activeObject
    );

    if (index !== 0) {
      const [movedObject] = this.canvasObjectsList.splice(index, 1);
      this.canvasObjectsList.unshift(movedObject);
      this.redrawCanvas();
    }
  }

  sendToBack(): void {
    if (!this.activeObject) return;

    const index = this.canvasObjectsList.findIndex(
      obj => obj.fabricObject === this.activeObject
    );

    if (index !== this.canvasObjectsList.length - 1) {
      const [movedObject] = this.canvasObjectsList.splice(index, 1);
      this.canvasObjectsList.push(movedObject);
      this.redrawCanvas();
    }
  }

  //------------------------------------CANVAS SAVE AND EXPORT------------------------------------

  exportCanvasAsJson(saveInDatabase: boolean): void {
    this.templateToSave = null;
    const canvasJson = JSON.stringify((this.canvas as any).toJSON(['name', 'id']));

    if(!saveInDatabase){
      navigator.clipboard?.writeText(canvasJson);
      return;
    }

    this.templateToSave = {
      user_id: 0,
      name: '',
      canvas_json: canvasJson
    };

  }

  saveCanvas(): void {
    const user = localStorage.getItem('user');
    if (!user || !this.templateToSave) return;

    const parsedUser = JSON.parse(user);
    const userId = parsedUser.id;

    this.templateToSave.name = this.templateName;
    this.templateToSave.user_id = userId;

    if (this.importedJson && this.importedJsonId !== null) {
      this.templateService.updateTemplate(userId, +this.importedJsonId, this.templateToSave).subscribe({
        next: (res) => {
          console.log('Plantilla actualizada correctamente:', res);
          alert('Plantilla actualizada con éxito ✅');
        },
        error: (err) => {
          console.error('Error al actualizar plantilla:', err);
          alert('Error al actualizar la plantilla ❌');
        }
      });
    } else {
      this.templateService.createTemplate(userId, this.templateToSave).subscribe({
        next: (res) => {
          console.log('Plantilla guardada correctamente:', res);
          alert('Plantilla guardada con éxito ✅');
        }
        , error: (err) => {
          console.error('Error al guardar plantilla:', err);
          alert('Error al guardar la plantilla ❌');
        }
      });
    }

    this.templateToSave = null;

  }

  async loadCanvasFromJson(): Promise<void> {
    if (this.canvas && this.importedJson) {
      this.canvas.loadFromJSON(this.importedJson, async () => {

        this.canvas.requestRenderAll();
        await new Promise(resolve => requestAnimationFrame(resolve));

        this.canvasObjectsList = [];
        this.canvas.getObjects().forEach((obj: any) => {
          const id = obj.id || uuidv4();
          obj.set({ id });

          this.canvasObjectsList.unshift({
            id,
            name: obj.name || 'Sin nombre',
            type: obj.type,
            fabricObject: obj
          });
        });


      });
    }
  }

  saveImage(): void {
  this.canvas.requestRenderAll();

  requestAnimationFrame(() => {
    const imageData = this.canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });

    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'carta.png';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
  /*
      // Ejemplo: descargar el JSON como archivo
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'canvas-design.json';
      link.click();
      URL.revokeObjectURL(url);
    
  */
  /*exportCanvasAsImage() {
  const dataURL = this.canvas.toDataURL({
    format: 'png',
    quality: 1.0
  });

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'canvas.png';
  link.click();
}
*/

  //------------------------------------FOLDER INPUT------------------------------------





 

  //------------------------------------ELEMENT PROPERTIES------------------------------------

  //----------Gets----------

  getActiveObjectName(): string {
    return (this.activeObject && (this.activeObject as any).name) || 'Sin nombre';
  }

  isTextObject(): boolean {
    return this.activeObject?.type === 'textbox' || this.activeObject?.type === 'text';
  }

  getTextProperty(prop: string): any {
    if (!this.isTextObject()) return null;
    return (this.activeObject as fabric.Text).get(prop);
  }

  getObjectColor(): string {
    return this.activeObject?.fill?.toString() || '#000000';
  }

  parseFloatNumber(value: string | number): number {
    return parseFloat(value as string);
  }


  //----------Sets----------

  setNewName() {
    if (this.activeObject && this.newName.trim() !== '') {
      (this.activeObject as any).name = this.newName;

      // Actualizamos también en la lista
      const found = this.canvasObjectsList.find(obj => obj.fabricObject === this.activeObject);
      if (found) {
        found.name = this.newName;
      }

      this.canvas.renderAll();
    }
  }

  setTextProperty(prop: string, value: any): void {
    if (!this.isTextObject()) return;

    (this.activeObject as fabric.Text).set(prop, value);
    if (prop === 'fontSize') {
      (this.activeObject as fabric.Text).initDimensions();
    }
    this.canvas.requestRenderAll();
  }

  updateProperty(property: string, value: any): void {
    if (!this.activeObject) return;

    // Conversión segura a número para propiedades de posición
    if (property === 'left' || property === 'top' || property === 'angle') {
      value = Number(value);
      if (isNaN(value)) return; // Validación adicional
    }

    this.activeObject.set(property, value);

    // Actualización especial para propiedades que afectan el layout
    if (this.isTextObject() && (property === 'fontSize' || property === 'text')) {
      (this.activeObject as fabric.Text).initDimensions();
    }

    // Forzar actualización visual
    this.activeObject.setCoords(); // <-- Esto es clave para actualizar posición
    this.canvas.requestRenderAll();
  }

}


