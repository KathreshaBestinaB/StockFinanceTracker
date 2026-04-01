import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  api = "http://localhost:5000/api/portfolio";

  constructor(private http: HttpClient) {}

  addStock(data: any): Observable<any> {

    const token = localStorage.getItem("token");

    return this.http.post<any>(
      this.api,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getPortfolio(): Observable<any[]> {

    const token = localStorage.getItem("token");

    return this.http.get<any[]>(
      this.api,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getSummary(): Observable<any> {

    const token = localStorage.getItem("token");

    return this.http.get<any>(
      this.api + "/summary",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  deleteStock(id: string): Observable<any> {

    const token = localStorage.getItem("token");

    return this.http.delete<any>(
      this.api + "/" + id,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}