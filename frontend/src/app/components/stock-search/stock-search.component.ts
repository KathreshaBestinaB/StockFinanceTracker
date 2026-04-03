import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { WatchlistService } from '../../services/watchlist.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { StockNewsComponent } from '../stock-news/stock-news.component';

Chart.register(...registerables);

@Component({
  selector: 'app-stock-search',
  standalone: true,
  imports: [FormsModule, CommonModule, StockNewsComponent],
  templateUrl: './stock-search.component.html'
})
export class StockSearchComponent {

  symbol = '';
  stock: any = null;
  quantity = 1;

  suggestions: any[] = [];
  chart: any;

  constructor(
    private http: HttpClient,
    private portfolioService: PortfolioService,
    private watchlistService: WatchlistService
  ) {}

  fetchSuggestions() {
    if (!this.symbol || this.symbol.trim().length < 1) {
      this.suggestions = [];
      return;
    }

    this.http
      .get(`http://localhost:5000/api/stocks/search/${this.symbol}`)
      .subscribe({
        next: (res: any) => {
          this.suggestions = res?.data ? res.data.slice(0, 8) : [];
        },
        error: (err) => {
          console.log('Suggestion error:', err);
          this.suggestions = [];
        }
      });
  }

  selectSuggestion(item: any) {
    this.symbol = item.symbol;
    this.suggestions = [];
    this.searchStock();
  }

  searchStock() {
    if (!this.symbol) return;

    this.suggestions = [];

    this.http.get(`http://localhost:5000/api/stocks/${this.symbol}`).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);

        this.stock = {
          symbol: res.symbol,
          name: res.name,
          price: Number(res.close),
          change: Number(res.change),
          percent_change: Number(res.percent_change),
          exchange: res.exchange,
          market_open: res.is_market_open
        };

        console.log('Mapped Stock:', this.stock);

        this.loadChartData(this.stock.symbol);
      },
      error: (err) => {
        console.log('Search error:', err);
        alert('Stock not found');
      }
    });
  }

  loadChartData(symbol: string) {
    this.http
      .get(`http://localhost:5000/api/stocks/chart/${symbol}`)
      .subscribe({
        next: (res: any) => {
          console.log('Chart Data:', res);

          const values = res?.values ? [...res.values].reverse() : [];
          const labels = values.map((item: any) => item.datetime);
          const prices = values.map((item: any) => Number(item.close));

          this.renderChart(labels, prices);
        },
        error: (err) => {
          console.log('Chart error:', err);
        }
      });
  }

  renderChart(labels: string[], prices: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('stockChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Closing Price',
            data: prices,
            borderWidth: 2,
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  addToPortfolio() {
    if (!this.stock) {
      alert('Search a stock first');
      return;
    }

    const data = {
      symbol: this.stock.symbol,
      buyPrice: Number(this.stock.price),
      quantity: Number(this.quantity)
    };

    console.log('Sending to backend:', data);

    this.portfolioService.addStock(data).subscribe({
      next: (res: any) => {
        console.log('Add response:', res);
        alert('Stock added to portfolio');
      },
      error: (err) => {
        console.log('Add error:', err);
        alert('Error adding stock');
      }
    });
  }

  addToWatchlist() {
    if (!this.stock) {
      alert('Search a stock first');
      return;
    }

    const data = {
      symbol: this.stock.symbol,
      companyName: this.stock.name
    };

    console.log('Sending watchlist data:', data);

    this.watchlistService.addToWatchlist(data).subscribe({
      next: (res: any) => {
        console.log('Watchlist response:', res);
        alert('Added to watchlist');
      },
      error: (err) => {
        console.log('Watchlist error:', err);

        if (err?.error?.message) {
          alert(err.error.message);
        } else {
          alert('Error adding to watchlist');
        }
      }
    });
  }
}