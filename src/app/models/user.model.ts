
// ===============================

export interface Roles { 
  subscriber?: boolean;
  editor?: boolean;
  admin?: boolean;
}

export class User {
  public uid: string;
  public username: string;
  public email: string;
  public password: string;
  public roles: Roles;

  constructor(uid: string, username: string, email: string, password: string, roles: Roles) {
    this.uid = uid;
    this.username = username;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }
}
