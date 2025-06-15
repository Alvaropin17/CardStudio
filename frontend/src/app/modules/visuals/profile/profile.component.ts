import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  modifyForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  isOpen = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.modifyForm = this.fb.group({
      name: [''],
      password: ['', Validators.minLength(8)],
      email: ['', [Validators.email]],
    });
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.user = JSON.parse(userData);
  }

  updateProfile(): void {

    const rawValues = this.modifyForm.value;

    const filteredValues = Object.keys(rawValues).reduce((acc: any, key) => {
      const value = rawValues[key];
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    const updatedData = {
      id: this.user.id,
      ...filteredValues
    };

    this.userService.updateUser(this.user.id, updatedData).subscribe({
      next: (response) => {
        this.successMessage = 'Perfil actualizado correctamente';
        this.errorMessage = '';
        localStorage.setItem('user', JSON.stringify(response.body));
        this.user = response.body;
        this.modifyForm.reset();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al actualizar el perfil';
        this.successMessage = '';
      }
    });
  }

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }
}
