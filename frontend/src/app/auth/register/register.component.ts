import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      password: ['']
    });
  }

  onSubmit(): void {
    const { name, email, password } = this.registerForm.value;

    this.authService.register(name, password, email).subscribe({
      next: () => {
        this.message = 'Registro exitoso 🎉';
        this.registerForm.reset();
      },
      error: (err: Error) => {
        this.message = err.message;
      }
    });
  }
}
