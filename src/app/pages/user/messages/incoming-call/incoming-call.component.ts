import {Component, Input} from '@angular/core';
import {CometChatService} from '../../../../services/comet-chat.service';

@Component({
  selector: 'app-incoming-call',
  templateUrl: './incoming-call.component.html',
  styleUrls: ['./incoming-call.component.scss']
})
export class IncomingCallComponent {

  @Input()
  public call: any;

  constructor(private chat: CometChatService) {
  }

  public accept(): void {
    this.chat.accept(this.call.sessionId).subscribe();
  }

  public reject(): void {
    this.chat.reject(this.call.sessionId).subscribe();
  }

}
