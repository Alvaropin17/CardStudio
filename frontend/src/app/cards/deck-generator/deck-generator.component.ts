import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from '../../services/template.service';
import { CsvDataService } from '../../services/csv-data.service';

import * as fabric from 'fabric';
import { CsvDataset } from '../../models/csv-dataset';
import { Template } from '../../models/template';

import { CustomTextbox } from '../fabric/CustomTextbox';



@Component({
  selector: 'app-deck-generator',
  templateUrl: './deck-generator.component.html',
  styleUrl: './deck-generator.component.scss',
  standalone: false,
})
export class DeckGeneratorComponent implements OnInit, OnDestroy {

  user: any;
  template!: Template;
  csvDataset!: CsvDataset;

  private canvas!: fabric.Canvas;
  private templateId!: number;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplateService,
    private csvService: CsvDataService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.templateId = +this.route.snapshot.params['templateId'];
      const userData = localStorage.getItem('user');
      if (!userData) {
        alert('Usuario no logueado');
        this.router.navigate(['/auth/login']);
        return;
      }

      this.user = JSON.parse(userData);
      await this.getTemplateAndCsvData(); // Espera aquí
      await this.initGenerationFlow(); // Luego inicia la generación
    } catch (error) {
      console.error('Error en ngOnInit:', error);
    }
  }
  async initGenerationFlow(): Promise<void> {
    try {

      // 2. Inicializar canvas
      this.initCanvas();

      // 3. Generar cartas
      await this.generateAllCards();

      alert('Cartas generadas con éxito');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private initCanvas(): void {
    this.canvas = new fabric.Canvas('generation-canvas', {
      width: 600,
      height: 900,
      backgroundColor: '#fff'
    });
  }

  private async loadCanvasTemplate(): Promise<void> {
    return new Promise((resolve) => {
      this.canvas.loadFromJSON(this.template.canvas_json, () => {
        this.canvas.requestRenderAll();
        // Espera un frame de animación para asegurar el renderizado
        requestAnimationFrame(() => resolve());
      });
    });
  }


  private async generateAllCards(): Promise<void> {
    for (const row of this.csvDataset.data) {
      await this.loadCanvasTemplate();
      this.replaceMarkers(row);
      await this.saveCurrentCard();
      this.resetCanvas();
    }
  }

  private replaceMarkers(rowData: Record<string, string>): void {

    this.canvas.getObjects().forEach((obj) => {
      if ((obj.type === 'text' || obj.type === 'custom-textbox')) {
        const textObj = obj as CustomTextbox;
        console.log('Reemplazando texto para:', textObj);

        const matchingHeader = this.csvDataset?.headers.find(
          header => header.toLowerCase() === textObj.name.toLowerCase().trim()
        );

        console.log('Encabezado coincidente:', matchingHeader);

        // 2. Si encontramos coincidencia, usar el valor correspondiente
        if (matchingHeader && rowData[matchingHeader]) {
          textObj.set('text', rowData[matchingHeader]);
        }

      }
    });
    this.canvas.requestRenderAll();
  }

  private async saveCurrentCard(): Promise<void> {
    // Asegura un último renderizado
    this.canvas.requestRenderAll();

    // Espera un frame de animación
    await new Promise(resolve => requestAnimationFrame(resolve));

    const imageData = this.canvas.toDataURL({
      format: 'png',
      quality: 0.8,
      multiplier: 1
    });

    // Debug mejorado
    this.debugImageData(imageData);
  }

  private debugImageData(imageData: string): void {
    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      console.log('Dimensiones reales de la imagen:', img.width, 'x', img.height);
      document.body.appendChild(img); // Muestra la imagen en pantalla para debug
    };

    console.log('Datos de imagen:', {
      preview: imageData.substring(0, 50) + '...',
      sizeBytes: Math.round(imageData.length * 0.75)
    });
  }

  private resetCanvas(): void {
    this.canvas.clear();
  }

  private async getTemplateAndCsvData(): Promise<void> {
    try {
      const templateResponse = await this.templateService.getTemplateById(
        this.user.id,
        this.templateId
      ).toPromise();

      if (!templateResponse?.body) {
        throw new Error('No se pudo obtener el template');
      }

      this.template = templateResponse.body;

      if (!this.template.csv_id) {
        throw new Error('El template no tiene CSV asociado');
      }

      const csvResponse = await this.csvService.getCsvById(
        this.user.id,
        this.template.csv_id
      ).toPromise();

      if (!csvResponse?.body) {
        throw new Error('No se pudo obtener el CSV');
      }

      this.csvDataset = csvResponse.body;

    } catch (error) {
      console.error('Error en getTemplateAndCsvData:', error);
      alert(error instanceof Error ? error.message : 'Error desconocido');
      this.router.navigate(['/cards/manager']);
      throw error;
    }
  }

  ngOnDestroy(): void {
    if (this.canvas) {
      this.canvas.dispose();
    }
  }
}