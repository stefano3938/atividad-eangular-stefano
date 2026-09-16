import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { map, debounceTime, filter, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../../services/auth';
import { VehicleService } from '../../services/vehicle';
import { Veiculo, VeiculoData } from '../../models/veiculo.model';

@Component({
  selector: 'app-dashboard',
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  isSidebarOpen = false;
  
  veiculos: Veiculo[] = [];
  selectedVeiculoId: string | number = '';
  selectedVeiculo: Veiculo | null = null;
  
  vinSearch = '';
  vinSearchSubject = new Subject<string>();
  searchSubscription!: Subscription;
  
  veiculoData: VeiculoData | null = null;
  searchError = '';

  constructor(
    private authService: AuthService,
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.vehicleService.getVehicles().pipe(
      map(response => response.vehicles)
    ).subscribe(data => {
      this.veiculos = data;
      if (this.veiculos.length > 0) {
        this.selectedVeiculoId = this.veiculos[0].id;
        this.onVeiculoChange();
      }
    });

    this.searchSubscription = this.vinSearchSubject.pipe(
      debounceTime(500),
      filter(vin => vin.length > 5), // filter out very short inputs
      distinctUntilChanged()
    ).subscribe(vin => {
      this.searchVin(vin);
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onVeiculoChange() {
    this.selectedVeiculo = this.veiculos.find(v => v.id == this.selectedVeiculoId) || null;
  }

  onVinInput(value: string) {
    this.vinSearchSubject.next(value);
  }

  searchVin(vin: string) {
    this.searchError = '';
    this.veiculoData = null;
    this.vehicleService.getVehicleData(vin).subscribe({
      next: (data) => {
        this.veiculoData = data;
      },
      error: (err) => {
        this.searchError = 'Veículo não encontrado.';
      }
    });
  }
}
