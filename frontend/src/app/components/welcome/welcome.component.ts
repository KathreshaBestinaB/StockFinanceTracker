import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarketNewsComponent } from '../market-news/market-news.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterLink, CommonModule, MarketNewsComponent],
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {

}