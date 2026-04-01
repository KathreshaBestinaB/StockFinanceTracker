import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html'
})
export class PortfolioComponent implements OnInit, OnDestroy {

  portfolio: any[] = [];
  summary: any = {
    totalInvestment: 0,
    totalCurrentValue: 0,
    profitLoss: 0
  };

  loading = true;
  lastUpdated: Date | null = null;
  refreshInterval: any;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.loadData();

    // 🔄 auto refresh every 15 sec
    this.refreshInterval = setInterval(() => {
      this.loadData();
    }, 15000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadData() {
    this.loading = true;

    this.portfolioService.getPortfolio().subscribe({
      next: (res) => {
        this.portfolio = res;
        this.lastUpdated = new Date();
        this.loading = false;
        console.log('Portfolio:', res);
      },
      error: (err) => {
        console.log('Portfolio error:', err);
        this.loading = false;
      }
    });

    this.portfolioService.getSummary().subscribe({
      next: (res) => {
        this.summary = res;
        console.log('Summary:', res);
      },
      error: (err) => {
        console.log('Summary error:', err);
      }
    });
  }

  deleteStock(id: string) {
    if (!confirm('Delete this stock?')) return;

    this.portfolioService.deleteStock(id).subscribe({
      next: () => {
        console.log('Stock deleted');
        this.loadData();
      },
      error: (err) => {
        console.log('Delete error', err);
      }
    });
  }
}