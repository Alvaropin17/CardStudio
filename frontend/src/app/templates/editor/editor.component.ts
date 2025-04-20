import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CanvasObject } from '../models/canvas-object';
import { v4 as uuidv4 } from 'uuid';

import * as fabric from 'fabric';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  standalone: false
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private canvas!: fabric.Canvas;

  activeObject: fabric.Object | null = null;
  canvasObjectsList: CanvasObject[] = [];


  objectName: string = '';

  selectedColor: string = '#ff0000';
  selectedFont: string = 'Arial';
  selectedFontSize: number = 20;

  onFontChange() {}

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement, {
      width: 600,
      height: 900,
      backgroundColor: '#fff'
    });

    this.canvas.on('selection:created', (e) => {
      this.activeObject = e.selected ? e.selected[0] : null;
      console.log('Objeto creado:', this.activeObject);
    });

    this.canvas.on('selection:updated', (e) => {
      this.activeObject = e.selected ? e.selected[0] : null;
      console.log('Objeto seleccionado:', this.activeObject);
    });

    this.canvas.on('selection:cleared', () => {
      this.activeObject = null;
      console.log('Ningún objeto seleccionado');
    });;

    const text = new fabric.Text('Nombre de la carta', {
      top: 50,
      left: 100,
      fontSize: 24,
      fill: '#333'
    });
  
    this.canvas.add(text);
  }




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

    this.canvasObjectsList.push({
      id,
      name: this.objectName,
      type: 'Text',
      fabricObject: text
    });
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

    this.canvasObjectsList.push({
      id,
      name: this.objectName,
      type: 'Rectangle',
      fabricObject: rect
    });
  }

  addCircle() {
    const circle = new fabric.Circle({
      left: 300,
      top: 150,
      radius: 50,
      fill: this.selectedColor
    });

    const id = uuidv4();
    circle.set({ name: this.objectName, id });

    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);

    this.canvasObjectsList.push({
      id,
      name: this.objectName,
      type: 'Circle',
      fabricObject: circle
    });
  }


  deleteActiveObject() {
    if (this.activeObject) {      
  
      const objectIndex = this.canvasObjectsList.findIndex(obj => obj.fabricObject === this.activeObject);
      if (objectIndex !== -1) {
        console.log('Objeto eliminado:', objectIndex);
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
  
}
