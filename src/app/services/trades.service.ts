import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import * as moment from 'moment';

import { Trade } from '../models/trade.model';
import { AuthService } from './auth.service';
import { DataBaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class TradesService {
  user: firebase.User;

  constructor() {}

  // * LINE GRAPH ======================================================
  // * =================================================================
  // ? PROFITS ==========================
  getLineGraphprofitSeries(trades: Trade[]) {
    var profits: any[] = [];
    //?  {dateEncode: Date in ms, profit}
    var tempMap: { [key: string]: [number, number] } = {};
    trades.forEach((trade) => {
      const dateEncode = moment(trade.dateTime).format('L');
      const dateNum = trade.dateTime.getTime();

      if (!!tempMap[dateEncode]) {
        tempMap[dateEncode][1] += trade.profit;
      } else {
        //? {dateEncode: Date in ms, profit}
        tempMap[dateEncode] = [dateNum, trade.profit];
      }
    });
    // ===
    for (const key in tempMap) {
      const newDate = new Date(tempMap[key][0]);
      const profit = { name: newDate, value: tempMap[key][1] };
      profits.push(profit);
    }

    const resultSeries = [
      {
        name: 'Profit',
        series: profits,
      },
    ];
    return resultSeries;
  }

  // ? LOT SIZES  ===============================
  getLineGraphlotSizeSeries(trades: Trade[]) {
    var lotSizes: any[] = [];
    var tempMap: { [key: string]: [number, number, number] } = {};
    trades.forEach((trade) => {
      const dateEncode = moment(trade.dateTime).format('L');
      const dateNum = trade.dateTime.getTime();
      if (!!tempMap[dateEncode]) {
        tempMap[dateEncode][1] += trade.lotSize;
        tempMap[dateEncode][2] += 1;
      } else {
        tempMap[dateEncode] = [dateNum, trade.lotSize, 1];
      }
    });
    // ===
    for (const key in tempMap) {
      const newDate = new Date(tempMap[key][0]);
      const lotSize = {
        name: newDate,
        value: tempMap[key][1] / tempMap[key][2],
      };
      lotSizes.push(lotSize);
    }

    const resultSeries = [
      {
        name: 'Lot size',
        series: lotSizes,
      },
    ];
    return resultSeries;
  }

  // ? NUMBER OF TRADES =============================
  getLineGraphNumTradesSeries(trades: Trade[]) {
    var numTrades: any[] = [];
    var tempMap: { [key: string]: [number, number] } = {};
    trades.forEach((trade) => {
      const dateEncode = moment(trade.dateTime).format('L');
      const dateNum = trade.dateTime.getTime();
      if (!!tempMap[dateEncode]) {
        tempMap[dateEncode][1] += 1;
      } else {
        tempMap[dateEncode] = [dateNum, 1];
      }
    });
    // ===
    for (const key in tempMap) {
      const newDate = new Date(tempMap[key][0]);
      const numTrade = { name: newDate, value: tempMap[key][1] };
      numTrades.push(numTrade);
    }

    const resultSeries = [
      {
        name: 'num trades',
        series: numTrades,
      },
    ];
    return resultSeries;
  }

  // * PIE CHART =======================================================
  // * =================================================================

  getAdvancedPieChartData(trades: Trade[]): any {
    var symbolsProfit: any[] = [];
    var tempMap: { [key: string]: number } = {};
    trades.forEach((trade: Trade) => {
      var symbol = trade.symbol;
      var profit = trade.profit;
      if (symbol.length === 6) {
        const smb1 = symbol.substring(0, 3);
        const smb2 = symbol.substring(3);
        // First symbol
        if (!!tempMap[smb1]) {
          tempMap[smb1] += profit;
        } else {
          tempMap[smb1] = profit;
        }
        // Second symbol
        if (!!tempMap[smb2]) {
          tempMap[smb2] += profit;
        } else {
          tempMap[smb2] = profit;
        }
      }
    });

    for (const key in tempMap) {
      const smbProfit = { name: key, value: tempMap[key] };
      symbolsProfit.push(smbProfit);
    }

    return symbolsProfit;
  }
  getPositivePieChartData(trades: Trade[]): any {
    var symbolsProfit: any[] = [];
    var tempMap: { [key: string]: number } = {};
    trades.forEach((trade: Trade) => {
      var symbol = trade.symbol;
      var profit = trade.profit;
      if (symbol.length === 6 && profit >= 0) {
        const smb1 = symbol.substring(0, 3);
        const smb2 = symbol.substring(3);
        // First symbol
        if (!!tempMap[smb1]) {
          tempMap[smb1] += profit;
        } else {
          tempMap[smb1] = profit;
        }
        // Second symbol
        if (!!tempMap[smb2]) {
          tempMap[smb2] += profit;
        } else {
          tempMap[smb2] = profit;
        }
      }
    });

    for (const key in tempMap) {
      const smbProfit = { name: key, value: tempMap[key] };
      symbolsProfit.push(smbProfit);
    }

    return symbolsProfit;
  }
  getNegativePieChartData(trades: Trade[]): any {
    var symbolsProfit: any[] = [];
    var tempMap: { [key: string]: number } = {};
    trades.forEach((trade: Trade) => {
      var symbol = trade.symbol;
      var profit = trade.profit;
      if (symbol.length === 6 && profit <= 0) {
        const smb1 = symbol.substring(0, 3);
        const smb2 = symbol.substring(3);
        // First symbol
        if (!!tempMap[smb1]) {
          tempMap[smb1] += profit;
        } else {
          tempMap[smb1] = profit;
        }
        // Second symbol
        if (!!tempMap[smb2]) {
          tempMap[smb2] += profit;
        } else {
          tempMap[smb2] = profit;
        }
      }
    });

    for (const key in tempMap) {
      const smbProfit = { name: key, value: -1 * tempMap[key] };
      symbolsProfit.push(smbProfit);
    }

    return symbolsProfit;
  }

  // * BOTTOM STATS =======================================================
  // * =================================================================

  getNumberOfTrades(trades: Trade[]) {
    var totalTrades: number = 0;
    var totalPositive: number = 0;
    var totalNegative: number = 0;
    trades.forEach((trade: Trade) => {
      if (trade.profit > 0) {
        totalTrades += 1;
        totalPositive += 1;
      }
      if (trade.profit < 0) {
        totalTrades += 1;
        totalNegative += 1;
      }
    });
    return {
      total: totalTrades,
      positive: totalPositive,
      negative: totalNegative,
    };
  }

  getposNegAllProfits(trades: Trade[]) {
    var totalProfit: number = 0;
    var positiveProfit: number = 0;
    var negativeProfit: number = 0;
    trades.forEach((trade: Trade) => {
      if (trade.profit > 0) {
        totalProfit += trade.profit;
        positiveProfit += trade.profit;
      }
      if (trade.profit < 0) {
        totalProfit += trade.profit;
        negativeProfit += trade.profit;
      }
    });
    return {
      total: totalProfit,
      positive: negativeProfit,
      negative: positiveProfit,
    };
  }
}
