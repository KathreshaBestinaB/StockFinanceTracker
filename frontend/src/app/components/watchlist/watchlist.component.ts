import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchlistService } from '../../services/watchlist.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './watchlist.component.html'
})
export class WatchlistComponent implements OnInit {

  watchlist: any[] = [];

  constructor(private watchlistService: WatchlistService) {}

  ngOnInit() {
    this.loadWatchlist();
  }

  loadWatchlist() {
    this.watchlistService.getWatchlist().subscribe({
      next: (res) => {
        this.watchlist = res;
        console.log('Watchlist:', res);
      },
      error: (err) => {
        console.log('Watchlist error:', err);
      }
    });
  }

  removeFromWatchlist(id: string) {
    if (!confirm('Remove this stock from watchlist?')) return;

    this.watchlistService.deleteFromWatchlist(id).subscribe({
      next: () => {
        this.loadWatchlist();
      },
      error: (err) => {
        console.log('Delete watchlist error:', err);
      }
    });
  }
}