import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VeiculosAPI, VeiculoData } from '../models/veiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) { }

  getVehicles(): Observable<VeiculosAPI> {
    return this.http.get<VeiculosAPI>(`${this.apiUrl}/vehicles`);
  }

  getVehicleData(vin: string): Observable<VeiculoData> {
    return this.http.post<VeiculoData>(`${this.apiUrl}/vehicleData`, { vin });
  }
}
