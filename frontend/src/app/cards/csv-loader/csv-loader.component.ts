import { Component } from '@angular/core';
import * as Papa from 'papaparse';
import { CsvDataset } from '../../models/csv-dataset';
import { CsvDataService } from '../../services/csv-data.service';



@Component({
  selector: 'app-csv-loader',
  standalone: false,
  templateUrl: './csv-loader.component.html',
  styleUrls: ['./csv-loader.component.scss']
})
export class CsvLoaderComponent {

  constructor(private csvService: CsvDataService) { }

  file: File | null = null;
  headers: string[] = [];
  data: Array<{ [key: string]: string }> = [];
  dataset: CsvDataset | null = null;
  name: string = ''; 


  onFileSelected(event: any): void {
    this.file = event.target.files[0];
    this.dataset = null; 
  }

  processCsv(): void {
    if (!this.file) return;

    Papa.parse(this.file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData = result.data as Array<{ [key: string]: string }>;
        if (parsedData.length > 0) {
          this.headers = Object.keys(parsedData[0]);
          this.data = parsedData;

          this.dataset = {
            name: this.name || this.file!.name.replace('.csv', ''),
            headers: this.headers,
            data: this.data
          };

          console.log('Dataset creado:', this.dataset);
        }
      },
      error: (error) => {
        console.error('Error al procesar el CSV:', error);
      }
    });
  }

  saveCsv(): void {
    const user = localStorage.getItem('user');
    if (!user || !this.dataset) return;

    const parsedUser = JSON.parse(user);
    const userId = parsedUser.id;

    const datasetToSave: CsvDataset = {
      ...this.dataset,
      user_id: userId
    };

    this.csvService.createCsv(userId, datasetToSave).subscribe({
      next: (res) => {
        console.log('CSV guardado correctamente:', res);
        alert('Dataset guardado con éxito ✅');
      },
      error: (err) => {
        console.error('Error al guardar dataset:', err);
        alert('Error al guardar el dataset ❌');
      }
    });
  }

}
