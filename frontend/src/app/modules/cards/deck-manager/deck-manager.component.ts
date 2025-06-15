import { Component } from '@angular/core';
import { TemplatesService } from '../../../services/templates.service';
import { CsvDatasetsService } from '../../../services/csv-datasets.service';
import { Router } from '@angular/router';

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

  generateDeck: boolean = false;

  constructor(private templateService: TemplatesService, private csvService: CsvDatasetsService, private router: Router) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.user = JSON.parse(userData);
    this.loadUserData(this.user.id);
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

  assingCsvToTemplate(): void {
    if (this.selectedCsv) {
      this.templateService.assignCsvToTemplate(this.user.id, this.selectedTemplate.id, this.selectedCsv.id).subscribe({
        next: () => {
          alert('CSV assigned to template successfully');
          this.selectedCsv = null;
          this.selectedTemplate = null;
        },
        error: (err) => {
          console.error('Error assigning CSV to template:', err);
        }
      });
    } else {
      alert('Please select a CSV to assign.');
    }

  }

}
