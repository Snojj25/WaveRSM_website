import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Trade } from 'src/app/models/trade.model';
import { AuthService } from 'src/app/services/auth.service';
import { DataBaseService } from 'src/app/services/database.service';
import { TradesService } from 'src/app/services/trades.service';

@Component({
  selector: 'app-trade-stats',
  templateUrl: './trade-stats.component.html',
  styleUrls: ['./trade-stats.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TradeStatsComponent implements OnInit {
  isLoading = true;
  trades: Trade[];
  user: firebase.User;

  scrHeight: any;
  scrWidth: any;

  legendPosition: string;

  profitSeries: any[];
  lotSizeSeries: any[];
  numTradesSeries: any[];
  viewMain: number[];
  viewSide: number[];

  pieChartData: any[];
  piePosData: any[];
  pieNegData: any[];

  totalTrades: number;
  positiveTrades: number;
  negativeTrades: number;
  totalProfit: number;
  positiveProfit: number;
  negativeProfit: number;

  userSub: Subscription;
  tradeSub: Subscription;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    this.legendPosition = 'right';
  }

  colorScheme = {
    domain: [
      'red',
      'green',
      'yellow',
      'pink',
      'orange',
      'blue',
      'purple',
      'brown',
    ],
  };

  constructor(
    private tradeService: TradesService,
    private dbService: DataBaseService,
    private authService: AuthService
  ) {
    this.getScreenSize();
    var width = this.scrWidth;
    var height = this.scrHeight;
    if (width >= 1200) {
      this.viewMain = [0.6 * width, 0.8 * height];
      this.viewSide = [0.3 * width, 0.4 * height];
      console.log('xl');
    } else if (width >= 992) {
      this.viewMain = [0.9 * width, 0.8 * height];
      this.viewSide = [0.45 * width, 0.4 * height];
      console.log('lg');
    } else {
      this.viewMain = [0.9 * width, 0.8 * height];
      this.viewSide = [0.9 * width, 0.4 * height];
      console.log('md');
    }
  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
    });
    this.tradeSub = this.dbService
      .getTrades('LNf3ZU5MFCQTUJP77g7JRQsw5Zs2')
      .subscribe((trades: Trade[]) => {
        // ? LINE CHART DATA ==============
        this.profitSeries = this.tradeService.getLineGraphprofitSeries(trades);
        this.lotSizeSeries = this.tradeService.getLineGraphlotSizeSeries(
          trades
        );
        this.numTradesSeries = this.tradeService.getLineGraphNumTradesSeries(
          trades
        );
        // ? PIE CHART DATA ===============
        this.pieChartData = this.tradeService.getAdvancedPieChartData(trades);
        this.piePosData = this.tradeService.getPositivePieChartData(trades);
        this.pieNegData = this.tradeService.getNegativePieChartData(trades);
        // ? BOTTOM STATS =================
        var numTradesMap = this.tradeService.getNumberOfTrades(trades);
        this.totalTrades = Math.round(numTradesMap['total'] * 100) / 100;
        this.positiveTrades = Math.round(numTradesMap['positive'] * 100) / 100;
        this.negativeTrades = Math.round(numTradesMap['negative'] * 100) / 100;
        var profitsMap = this.tradeService.getposNegAllProfits(trades);
        this.totalProfit = Math.round(profitsMap['total'] * 100) / 100;
        this.positiveProfit = Math.round(profitsMap['positive'] * 100) / 100;
        this.negativeProfit = Math.round(profitsMap['negative'] * 100) / 100;

        this.isLoading = false;
      });

    // =============
  }

  onTest() {}

  maxYValue(arr: []) {
    var max = -1 * 10 ** 9;
    arr.forEach((element) => {
      const val = element['value'];
      max = Math.max(max, val);
    });
    return 1.5 * max;
  }

  formatTooltipNeg(c): string {
    return '-' + (c['value'] as number).toFixed(2) + '€';
  }

  formatTooltip(c): string {
    return (c['value'] as number).toFixed(2) + '€';
  }

  onResize(e) {
    var width = e.target.innerWidth;
    var height = e.target.innerHeight;
    // console.log(width);
    // console.log(height);
    if (width >= 1200) {
      this.viewMain = [0.6 * width, 0.8 * height];
      this.viewSide = [0.3 * width, 0.4 * height];
      console.log('xl');
    } else if (width >= 992) {
      this.viewMain = [0.9 * width, 0.8 * height];
      this.viewSide = [0.45 * width, 0.4 * height];
      console.log('lg');
    } else if (width >= 768) {
      this.viewMain = [0.9 * width, 0.8 * height];
      this.viewSide = [0.9 * width, 0.4 * height];
      console.log('md');
    } else if (width >= 576) {
      this.legendPosition = 'below';
      this.viewMain = [0.9 * width, 0.8 * height];
      this.viewSide = [0.9 * width, 0.4 * height];
      console.log('sm');
    } else {
      this.viewMain = [0.9 * width, 0.8 * height];
      this.viewSide = [0.9 * width, 0.4 * height];
      console.log('xs');
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.tradeSub.unsubscribe();
  }
}
