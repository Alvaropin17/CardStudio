import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement, {
      width: 600,
      height: 900,
      backgroundColor: '#fff'
    });

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
      fontSize: 20
    });
    this.canvas.add(text);
    this.canvas.setActiveObject(text);
  }

  addRectangle() {
    const rect = new fabric.Rect({
      left: 100,
      top: 150,
      fill: 'skyblue',
      width: 200,
      height: 100
    });
    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
  }

  clearCanvas() {
    this.canvas.clear();
    this.canvas.backgroundColor = '#fff';
    this.canvas.renderAll();
  }
}
