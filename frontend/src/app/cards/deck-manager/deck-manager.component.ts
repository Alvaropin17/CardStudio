import { Component } from '@angular/core';
import { TemplateService } from '../../services/template.service';
import { CsvDataService } from '../../services/csv-data.service';

@Component({
  selector: 'app-deck-manager',
  standalone: false,
  templateUrl: './deck-manager.component.html',
  styleUrl: './deck-manager.component.scss'
})
export class DeckManagerComponent {

  user: any;
  templates: any[] = [];
  csvDatasets: any[] = [];

  selectedTemplate: any = null;
  selectedCsv: any = null;
  isAssigning = false;

  constructor(private templateService: TemplateService, private csvService: CsvDataService) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.loadUserData(this.user.id);
    } else {
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

  onSelectTemplate(template: any): void {
    this.selectedTemplate = template;
  }

  onSelectCsv(csv: any): void {
    this.selectedCsv = csv;
  }

  deleteTemplate(templateId: number): void {
    this.templateService.deleteTemplate(this.user.id, templateId).subscribe({
      next: () => {
        this.templates = this.templates.filter(template => template.id !== templateId);
        alert('Template deleted successfully');
      },
      error: (err) => console.error('Error deleting template:', err)
    });

  }

  deleteCSV(csvId: number): void {
    this.csvService.deleteCsv(this.user.id, csvId).subscribe({
      next: () => {
        this.csvDatasets = this.csvDatasets.filter(csv => csv.id !== csvId);
        alert('CSV deleted successfully');
      },
      error: (err) => console.error('Error deleting CSV:', err)
    });
  }

  assingCsvToTemplate(templateId: number): void {
  
  }


}
