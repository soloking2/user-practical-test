import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Message } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  currentMessage$ = new BehaviorSubject<any>(null);

  constructor() { }

  setMessage(message: Message) {
    this.clearMessage();
    setTimeout(() => {
      this.currentMessage$.next(message);

    }, 350);

    setTimeout(() => {
      this.clearMessage()
    }, 10000);


  }

  clearMessage() {
    this.currentMessage$.next(null);
  }
}
