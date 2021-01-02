export class User {
  public uid: string;
  public username: string;
  public email: string;
  public password: string;

  constructor(uid: string, username: string, email: string, password: string) {
    this.uid = uid;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
