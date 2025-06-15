import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  isLogged: boolean = false;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(logged => {
      this.isLogged = logged;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}