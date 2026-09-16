import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  nome = '';
  senha = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    if (!this.nome || !this.senha) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    this.authService.login(this.nome, this.senha).subscribe({
      next: (user) => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao realizar login.';
      }
    });
  }
}
