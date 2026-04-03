import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsArticle, NewsService } from '../../services/news.service';

@Component({
  selector: 'app-market-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-news.component.html',
  styleUrls: ['./market-news.component.css']
})
export class MarketNewsComponent implements OnInit {
  articles: NewsArticle[] = [];
  displayedArticles: NewsArticle[] = [];
  loading = false;
  error = '';
  topStories: NewsArticle[] = [];
  visibleCount = 3;

  //visibleCount = 9;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.fetchGeneralNews();
  }

  fetchGeneralNews(): void {
    this.loading = true;
    this.error = '';
    this.articles = [];
    this.displayedArticles = [];

    this.newsService.getGeneralNews().subscribe({
      next: (res) => {
  this.articles = res.articles || [];

  // First 2 as top stories
  this.topStories = this.articles.slice(0, 2);

  this.updateDisplayedArticles();
  this.loading = false;
},
      error: () => {
        this.error = 'Failed to load market news';
        this.loading = false;
      }
    });
  }

  updateDisplayedArticles(): void {
  this.displayedArticles = this.articles.slice(2, 2 + this.visibleCount);
}

  loadMore(): void {
  this.visibleCount += 3;
  this.updateDisplayedArticles();
}

showLess(): void {
  this.visibleCount = 3;
  this.updateDisplayedArticles();
}

  get hasMore(): boolean {
    return this.visibleCount < this.articles.length;
  }
}