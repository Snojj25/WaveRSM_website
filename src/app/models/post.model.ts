
export class Post {
  public id: string;
  public title: string;
  public description: string;
  public imgUrl: string;
  public symbol: string;
  public dateTime?: string;

  constructor(
    id: string,
    title: string,
    description: string,
    imgUrl: string,
    symbol: string,
    dateTime?: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.imgUrl = imgUrl;
    this.symbol = symbol;
    this.dateTime = dateTime;
  }
}
