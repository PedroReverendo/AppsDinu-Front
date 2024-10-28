import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  usuario: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Obtener datos del usuario del localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.usuario = JSON.parse(userData);
    }
  }

  cerrarSesion() {
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }
}
