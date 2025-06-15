import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplatesService } from '../../../services/templates.service';
import { CsvDatasetsService } from '../../../services/csv-datasets.service';
import { DecksService } from '../../../services/decks.service';

import { CsvDataset } from '../../../models/csv-dataset';
import { Template } from '../../../models/template';
import { Deck } from '../../../models/deck';

import { jsPDF } from 'jspdf';



import * as fabric from 'fabric';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-deck-generator',
  standalone: false,
  templateUrl: './deck-generator.component.html',
  styleUrl: './deck-generator.component.scss',
})
export class DeckGeneratorComponent implements OnInit, OnDestroy {

  @ViewChild('folderInput') folderInput!: ElementRef<HTMLInputElement>;


  user: any;
  template!: Template;
  csvDataset!: CsvDataset;
  imageRepository = new Map<string, File>();


  private deckImages: Array<{ base64: string }> = [];
  private canvas!: fabric.Canvas;
  private templateId!: number;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplatesService,
    private csvService: CsvDatasetsService,
    private decksService: DecksService
  ) { }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  async ngOnInit(): Promise<void> {
    try {
      this.templateId = +this.route.snapshot.params['templateId'];
      const userData = localStorage.getItem('user');
      if (!userData) {
        this.router.navigate(['/auth/login']);
        return;
      }
      this.user = JSON.parse(userData);
      await this.getTemplateAndCsvData();

    } catch (error) {
      console.error('Error en ngOnInit:', error);
    }
  }

  async generateDeck(saveAsPdf: boolean): Promise<void> {
    try {
      this.isLoading = true;
      this.initCanvas();
      await this.generateAllCards();

    } catch (error) {
      console.error('Error:', error);
    }
    this.isLoading = false;
    if (saveAsPdf === true) {
      await this.downloadCardsAsPDF();
    } else {
      await this.downloadAllCardsAsZip();
    }
    this.deckImages = [];

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
        requestAnimationFrame(() => resolve());
      });
    });
  }


  private async generateAllCards(): Promise<void> {
    for (const row of this.csvDataset.data) {
      await this.loadCanvasTemplate();
      await this.delay(100);
      await this.replaceMarkers(row);
      await this.delay(100);
      await this.replaceImageMarkers(row);
      await this.delay(100);
      await this.saveCurrentCard();
      this.resetCanvas();
    }
  }



  private async replaceMarkers(rowData: Record<string, string>): Promise<void> {

    const textboxObjects = this.canvas.getObjects().filter(obj =>
      obj.type === 'textbox') as fabric.Textbox[];
    for (const textObj of textboxObjects) {
      const matchingHeader = this.csvDataset?.headers.find(
        header => header.toLowerCase() === textObj.name!.toLowerCase().trim()
      );

      if (matchingHeader && rowData[matchingHeader]) {
        textObj.set('text', rowData[matchingHeader]);
      }

    }
    this.canvas.requestRenderAll();
  }


  private async saveCurrentCard(): Promise<void> {

    this.canvas.requestRenderAll();

    await new Promise(resolve => requestAnimationFrame(resolve));

    const imageData = this.canvas.toDataURL({
      format: 'png',
      quality: 0.8,
      multiplier: 1
    });

    this.deckImages.push({ base64: imageData });
    console.log('Datos de imagen generada:', this.deckImages);
    /*
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `card_${this.deckImages.length}.png`;
        link.click();
    */
  }

  private async downloadAllCardsAsZip(): Promise<void> {
    const zip = new JSZip();

    this.deckImages.forEach((image, index) => {
      const base64Data = image.base64.split(',')[1];
      zip.file(`card_${index + 1}.png`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'deck_cards.zip');
  }

  private async downloadCardsAsPDF() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const cardWidth = 60;  // Tamaño de cada carta (en mm)
    const cardHeight = 88;
    const marginX = 10;    // Márgenes para espaciar
    const marginY = 10;

    const cardsPerRow = 3;
    const cardsPerCol = 3;
    const cardsPerPage = cardsPerRow * cardsPerCol;

    for (let i = 0; i < this.deckImages.length; i++) {
      const pageIndex = Math.floor(i / cardsPerPage);
      const posInPage = i % cardsPerPage;

      const row = Math.floor(posInPage / cardsPerRow);
      const col = posInPage % cardsPerRow;

      const x = marginX + col * (cardWidth + marginX);
      const y = marginY + row * (cardHeight + marginY);

      if (i !== 0 && posInPage === 0) {
        doc.addPage(); // Nueva página si es necesario
      }

      doc.addImage(
        this.deckImages[i].base64,
        'PNG',
        x,
        y,
        cardWidth,
        cardHeight
      );
    }

    doc.save('deck_cards.pdf');
  }


  private resetCanvas(): void {
    this.canvas.clear();
    this.canvas.requestRenderAll();
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


  //--------------------Images--------------------

  triggerFolderInput() {
    this.folderInput.nativeElement.click();
  }

  async handleFolderSelection(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    this.imageRepository.clear();


    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
        this.imageRepository.set(fileNameWithoutExt.toLowerCase(), file);
      }
    }
    alert(`Se cargaron ${this.imageRepository.size} imágenes`);

  }

  private async replaceImageMarkers(rowData: Record<string, string>): Promise<void> {
    const imageObjects = this.canvas.getObjects().filter(obj =>
      obj.type === 'image') as fabric.FabricImage[];

    console.log('Objetos de imagen en el canvas:', imageObjects);

    for (const imgObj of imageObjects) {
      const matchingHeader = this.csvDataset?.headers.find(
        header => header.toLowerCase() === imgObj.name!.toLowerCase().trim()
      );
      console.log('Header encontrado:', matchingHeader, 'para imagen:', imgObj.name);
      if (matchingHeader && rowData[matchingHeader]) {
        const imageNameInCsv = rowData[matchingHeader].toLowerCase();
        const imageFile = this.imageRepository.get(imageNameInCsv);
        if (imageFile) {
          await this.replaceCanvasImage(imgObj, imageFile);
        }
      }
    }
  }

  private async replaceCanvasImage(oldImage: fabric.FabricImage, newImageFile: File): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const imageUrl = URL.createObjectURL(newImageFile);

      try {

        const newImg = await fabric.FabricImage.fromURL(imageUrl);

        const originalScaledWidth = oldImage.getScaledWidth();
        const originalScaledHeight = oldImage.getScaledHeight();

        const scaleX = originalScaledWidth / newImg.width!;
        const scaleY = originalScaledHeight / newImg.height!;

        newImg.set({
          left: oldImage.left,
          top: oldImage.top,
          scaleX: scaleX,
          scaleY: scaleY,
          angle: oldImage.angle,
          originX: oldImage.originX,
          originY: oldImage.originY,
          name: oldImage.name,
          id: oldImage.id,
          selectable: false
        });

        this.canvas.remove(oldImage);
        this.canvas.add(newImg);
        this.canvas.requestRenderAll();
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(imageUrl);
      }
    });
  }



  //----------------------------Support----------------------------------------

  async loadImageFromFile(file: File): Promise<void> {
    const imageUrl = URL.createObjectURL(file);

    try {
      const img = await fabric.FabricImage.fromURL(imageUrl);

      img.set({
        name: file.name,
        left: Math.random() * 300,
        top: Math.random() * 300,
        scaleX: 0.5,
        scaleY: 0.5,
        angle: 0,
        opacity: 1,
        selectable: true,
        hasControls: true,
        lockScalingFlip: true,
        cornerStyle: 'circle',
        transparentCorners: false
      });

      this.canvas.add(img);
      this.canvas.requestRenderAll();

    } catch (error) {
      console.error('Error al cargar la imagen:', error);
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }

  private debugImageData(imageData: string): void {
    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      document.body.appendChild(img);
    };

    console.log('Datos de imagen:', {
      preview: imageData.substring(0, 50) + '...',
      sizeBytes: Math.round(imageData.length * 0.75)
    });
  }
  //----------------------------Future backend support----------------------------------------
  async sendDeckToBackend(deckName: string): Promise<void> {
    if (this.deckImages.length === 0) {
      throw new Error("No hay cartas para enviar");
    }

    const deckData = {
      name: deckName,
      cards: this.deckImages
    }

    this.decksService.createDeck(this.user.id, deckData).subscribe({
      next: (response) => {
        console.log('Deck creado exitosamente:', response);
        alert('Deck creado exitosamente');
        this.router.navigate(['/cards/manager']);
      },
      error: (error) => {
        console.error('Error al crear el deck:', error);
        alert('Error al crear el deck: ' + (error.error?.message || 'Error desconocido'));
      }
    });
  }

  //TODO: boton para eliminar las imagenes de this.imageRepository
}