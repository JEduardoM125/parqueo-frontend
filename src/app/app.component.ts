import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor, etc.

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule], // Import CommonModule for ngIf, ngFor, etc.
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ParqueoAngular';

  currentTheme: string = 'light';  // Valor inicial del tema

  ngOnInit(): void {
    this.setTheme(this.currentTheme);
  }

  // Método para cambiar el tema
  setTheme(theme: string): void {
    this.currentTheme = theme;
    document.body.setAttribute('data-bs-theme', this.currentTheme);
  }
}
