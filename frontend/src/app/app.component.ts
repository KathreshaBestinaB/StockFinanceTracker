import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  tickerData: any[] = [];
  showNavbar = false;
  showTicker = false;
  tickerInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.updateLayout(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateLayout(event.urlAfterRedirects);
      });
  }

  updateLayout(url: string) {
    const isPublicPage =
      url === '/' ||
      url === '/login' ||
      url === '/register';

    const loggedIn = this.authService.isLoggedIn();

    this.showNavbar = !isPublicPage && loggedIn;
    this.showTicker = true;

    if (this.showTicker && !this.tickerInterval) {
      this.startTicker();
    }

    if (!this.showTicker && this.tickerInterval) {
      clearInterval(this.tickerInterval);
      this.tickerInterval = null;
      this.tickerData = [];
    }
  }

  startTicker() {
    this.loadTicker();

    this.tickerInterval = setInterval(() => {
      if (this.authService.isLoggedIn()) {
        this.loadTicker();
      }
    }, 15000);
  }

  loadTicker() {
    this.http.get('http://localhost:5000/api/stocks/ticker')
      .subscribe({
        next: (res: any) => {
          const data = res?.data || [];
          this.tickerData = [...data, ...data];
          console.log('Ticker count:', res?.count);
        },
        error: (err) => {
          console.log('Ticker error:', err);
        }
      });
  }

  logout() {
    this.authService.logout();
    this.showNavbar = false;
    this.showTicker = true;

    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
      this.tickerInterval = null;
    }

    this.tickerData = [];
    this.router.navigate(['/login']);
  }
}