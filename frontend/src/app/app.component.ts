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
  showTicker = true;

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

    this.loadTicker(); // fetch only once per browser session
  }

  updateLayout(url: string) {
    const isPublicPage =
      url === '/' ||
      url === '/login' ||
      url === '/register';

    const loggedIn = this.authService.isLoggedIn();

    this.showNavbar = !isPublicPage && loggedIn;
    this.showTicker = true;
  }

  loadTicker() {
    const cachedTicker = sessionStorage.getItem('tickerData');

    if (cachedTicker) {
      this.tickerData = JSON.parse(cachedTicker);
      return;
    }

    const symbols = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN'];
    let temp: any[] = [];

    symbols.forEach(symbol => {
      this.http.get(`http://localhost:5000/api/stocks/${symbol}`)
        .subscribe((res: any) => {
          temp.push({
            symbol: res.symbol,
            price: Number(res.close),
            change: Number(res.change)
          });

          if (temp.length === symbols.length) {
            this.tickerData = [...temp, ...temp];
            sessionStorage.setItem('tickerData', JSON.stringify(this.tickerData));
          }
        });
    });
  }

  logout() {
    this.authService.logout();
    this.showNavbar = false;
    this.showTicker = false;
    this.router.navigate(['/login']);
  }
}