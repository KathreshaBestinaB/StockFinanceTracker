import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  api = "http://localhost:5000/api/watchlist";

  constructor(private http: HttpClient) {}

  addToWatchlist(data: any): Observable<any> {
    const token = localStorage.getItem("token");

    return this.http.post<any>(this.api, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getWatchlist(): Observable<any[]> {
    const token = localStorage.getItem("token");

    return this.http.get<any[]>(this.api, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  deleteFromWatchlist(id: string): Observable<any> {
    const token = localStorage.getItem("token");

    return this.http.delete<any>(`${this.api}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}