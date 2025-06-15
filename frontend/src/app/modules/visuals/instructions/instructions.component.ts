import { Component } from '@angular/core';

@Component({
  selector: 'app-instructions',
  standalone: false,
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.scss'
})
export class InstructionsComponent {

accordionStates: boolean[] = [false, false, false, false, false]; // Un elemento por cada acordeón

isAccordionOpen(index: number): boolean {
  return this.accordionStates[index];
}

toggleAccordion(index: number) {
  this.accordionStates[index] = !this.accordionStates[index];
}

}
