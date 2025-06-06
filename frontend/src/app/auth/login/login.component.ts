import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  
  loginForm: FormGroup;
  message: string | null = null;

  constructor(private fb: FormBuilder,private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { user, password } = this.loginForm.value;

    this.authService.login(user, password).subscribe({
      next: () => {
        this.router.navigate(['profile']);
      },
      error: (error) => {
        this.message = `Error: ${error.message}`;
      }
    });
  }
 
  
}
