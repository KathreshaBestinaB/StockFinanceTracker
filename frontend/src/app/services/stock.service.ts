import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = 'http://localhost:5000/api/stocks';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getStock(symbol: string): Observable<any> {

    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/${symbol}`, { headers });
  }
  getChartData(symbol: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/chart/${symbol}`);
  }
}