import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  isLogged: boolean = false;

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
      if (userData) {
        this.isLogged = true;
      }
  }
}
