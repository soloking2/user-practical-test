export interface Auth {
  email: string;
  password: string;
}

export interface UserLogin {
  id: number;
  token: string;
}

export class Message {
  type: string;
  title: string;
  body: string;


  constructor(obj?: any) {
    this.type = (obj && obj.type) || 'info';
    this.title = (obj && obj.title) || null;
    this.body = (obj && obj.body) || null;
  }
}
