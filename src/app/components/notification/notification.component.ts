import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/shared/messages.service';

@Component({
  selector: 'ua-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger('slideUpDown', [
      state('in', style({ height: '*' })),
      transition('* => void', [
        style({ height: '*' }),
        animate('300ms', style({ height: 0 })),
      ]),
      transition('void => *', [
        style({ height: 0 }),
        animate('300ms', style({ height: '*' })),
      ]),
    ]),
    trigger('slideInOut', [
      state(
        'in',
        style({
          width: '280px',

        })
      ),
      state(
        'out',
        style({
          width: '0',

        })
      ),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnInit {
  constructor(public messageSrc: MessagesService) {

  }

  ngOnInit(): void {}
}
