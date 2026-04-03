import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsArticle, NewsService } from '../../services/news.service';

@Component({
  selector: 'app-stock-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-news.component.html',
  styleUrls: ['./stock-news.component.css']
})
export class StockNewsComponent implements OnChanges {
  @Input() symbol: string = '';

  articles: NewsArticle[] = [];
  loading = false;
  error = '';

  constructor(private newsService: NewsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['symbol'] && this.symbol) {
      this.fetchNews();
    }
  }

  fetchNews(): void {
    this.loading = true;
    this.error = '';
    this.articles = [];

    this.newsService.getNewsBySymbol(this.symbol).subscribe({
      next: (res) => {
        this.articles = res.articles;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load news';
        this.loading = false;
      }
    });
  }
}