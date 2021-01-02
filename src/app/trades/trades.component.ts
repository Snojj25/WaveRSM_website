import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

import { Trade } from '../models/trade.model';
import { AuthService } from '../services/auth.service';
import { DataBaseService } from '../services/database.service';
import { TradesService } from "../services/trades.service";

@Component({
  selector: 'app-trades',
  templateUrl: './trades.component.html',
  styleUrls: ['./trades.component.scss'],
})
export class TradesComponent implements OnInit {
  user: firebase.User;
  trades: Trade[];
  isLoading = true;

  userSub: Subscription;
  tradesSub: Subscription;
  constructor(
    private dbService: DataBaseService,
    private authService: AuthService,
    private tradesService: TradesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
    });
    this.tradesSub = this.dbService.getTrades('LNf3ZU5MFCQTUJP77g7JRQsw5Zs2').subscribe((trades: Trade[]) => {
      this.trades = trades;
      this.isLoading = false;
    })
  }

  getDateString(date: Date) {
    // const newDate = new Date( date["seconds"] * 1000)
    const dateString = moment(date).format(
      'ddd, MMM Do YYYY'
    );
    return dateString;
  }

  onNavigate() {
    this.router.navigate(['trade-stats']).catch((err) => {
      console.log(err);
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.tradesSub.unsubscribe();
  }

  onClick() {
    console.log(this.trades[0]);
  }
}
