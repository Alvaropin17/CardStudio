import { Component } from '@angular/core';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-csv-loader',
  standalone: false,
  templateUrl: './csv-loader.component.html',
  styleUrl: './csv-loader.component.scss'
})
export class CsvLoaderComponent {

  csvData: any[] = [];

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          this.csvData = result.data;
          console.log('CSV cargado:', this.csvData);
        },
        error: (error) => {
          console.error('Error al leer el CSV:', error);
        }
      });
    }
  }

}
