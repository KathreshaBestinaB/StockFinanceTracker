import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css']
})
export class TrendingComponent implements OnInit {

  stocks: any[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchTrending();
  }

  fetchTrending() {
    this.loading = true;

    this.http.get<any>('http://localhost:5000/api/stocks/trending')
      .subscribe(res => {
        this.stocks = res.stocks;
        this.loading = false;
      });
  }
}