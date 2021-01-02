export class Trade {
  public symbol: string;
  public tradeType: string;
  public entry: number;
  public exit: number;
  public lotSize: number;
  public profit: number;
  public dateTime?: Date;

  constructor(
    symbol: string,
    tradeType: string,
    entry: number,
    exit: number,
    lotSize: number,
    profit: number,
    dateTime?: Date
  ) {
    this.symbol = symbol;
    this.tradeType = tradeType;
    this.entry = entry;
    this.exit = exit;
    this.lotSize = lotSize;
    this.profit = profit;
    this.dateTime = dateTime;
  }
}

