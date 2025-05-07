import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../../services/template.service';
import { CsvDataService } from '../../services/csv-data.service';
import { Template } from '../../models/template';
import { CsvDataset } from '../../models/csv-dataset';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  templates: any[] = [];
  csvDatasets: any[] = [];

  constructor(private templateService: TemplateService, private csvService: CsvDataService) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    console.log(userData);
    if (userData) {
      this.user = JSON.parse(userData);
      this.loadUserData(this.user.id);
    } else {
      // Redirigir al login o mostrar error si no hay usuario
      console.error('Usuario no logueado');
    }
  }

  loadUserData(userId: number): void {
    this.csvService.getAllCsvById(userId).subscribe({
      next: (data) => this.csvDatasets = data.body,
      error: (err) => console.error('Error al obtener CSV datasets:', err)
    });

    this.templateService.getAllTemplatesById(userId).subscribe({
      next: (data) => this.templates = data.body,
      error: (err) => console.error('Error al obtener templates:', err)
    });
  }
}
