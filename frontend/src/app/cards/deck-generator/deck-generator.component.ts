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
    this.templateId = +this.route.snapshot.params['templateId'];
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      alert('Usuario no logueado');
      this.router.navigate(['/auth/login']);
    }
    this.getTemplateAndCsvData();
  }

  async initGenerationFlow(): Promise<void> {
    try {

      // 2. Inicializar canvas
      this.initCanvas();
      await this.loadCanvasTemplate();

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
    this.canvas.loadFromJSON(this.template.canvas_json, () => {
      setTimeout(() => {
        this.canvas.renderAll();
      }, 100);
    });
  }


  private async generateAllCards(): Promise<void> {
    for (const row of this.csvDataset.data) {
      this.replaceMarkers(row);
      await this.saveCurrentCard(this.template.id!, row);
      this.resetCanvas();
    }
  }

  private replaceMarkers(rowData: Record<string, string>): void {
    this.canvas.getObjects().forEach((obj) => {
      if ((obj.type === 'text' || obj.type === 'custom-text')) {
        const textObj = obj as CustomTextbox;

        const matchingHeader = this.csvDataset?.headers.find(
          header => header.toLowerCase() === textObj.name.toLowerCase().trim()
        );

        // 2. Si encontramos coincidencia, usar el valor correspondiente
        if (matchingHeader && rowData[matchingHeader]) {
          textObj.set('text', rowData[matchingHeader]);
        }

      }
    });
    this.canvas.renderAll();
  }

  private async saveCurrentCard(templateId: number, rowData: any): Promise<void> {
    const imageData = this.canvas.toDataURL({
      format: 'png',
      quality: 0.8,
      multiplier: 1
    });

    // Console.log básico
    console.log('DataURL completo:', imageData);

    // Versión más informativa
    console.group('Canvas Image Data');
    console.log('Tipo:', imageData.substring(0, 30) + '...'); // Muestra el inicio
    console.log('Longitud:', imageData.length, 'caracteres');
    console.log('Tamaño aproximado:', Math.round(imageData.length * 0.75), 'bytes (base64 -> binario)');
    console.groupEnd();

    // Para inspeccionar en navegador (crea un enlace descargable)
    console.log('%cPreview:', 'font-weight:bold');
    console.log('Puedes pegar este DataURL en la barra de direcciones para previsualizar:');
    console.log(imageData);

    // Opcional: Crear un enlace descargable en la consola

  }

  private resetCanvas(): void {
    this.canvas.clear();
    this.canvas.loadFromJSON(this.template.canvas_json);
  }

private async getTemplateAndCsvData(): Promise<void> {
  try {
    // 1. Obtener template
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

    // 3. Obtener CSV
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
    throw error; // Re-lanzamos para manejo adicional si es necesario
  }
}

  ngOnDestroy(): void {
    if (this.canvas) {
      this.canvas.dispose();
    }
  }
}