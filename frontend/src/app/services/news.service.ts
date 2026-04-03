import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NewsArticle {
  title: string;
  description: string;
  source: string;
  published_at: string;
  url: string;
  image_url: string;
  sentiment: string;
}

export interface NewsResponse {
  symbol: string;
  articles: NewsArticle[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'http://localhost:5000/api/news';

  constructor(private http: HttpClient) {}

  getGeneralNews(): Observable<{ articles: NewsArticle[] }> {
  return this.http.get<{ articles: NewsArticle[] }>(this.apiUrl);
}
  getNewsBySymbol(symbol: string): Observable<NewsResponse> {
    return this.http.get<NewsResponse>(`${this.apiUrl}/${symbol}`);
  }
}