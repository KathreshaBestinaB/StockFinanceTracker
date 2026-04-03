import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarketNewsComponent } from '../market-news/market-news.component';
import { TrendingComponent } from '../trending/trending.component';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink, CommonModule, MarketNewsComponent, TrendingComponent],
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {

}