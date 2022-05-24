import {Component, Input, OnInit} from '@angular/core';
import {CometChatService} from '../../../../services/comet-chat.service';

@Component({
  selector: 'app-ongoing-call',
  templateUrl: './ongoing-call.component.html'
})
export class OngoingCallComponent implements OnInit {
  @Input()
  private call: any;
  public name: string;
  public avatar: string;

  constructor(private chat: CometChatService) {}

  public ngOnInit() {
    if (this.call.callInitiator.uid === this.chat.getSignedIn()) {
      this.name = this.call.callReceiver.name;
      this.avatar = this.call.callReceiver.avatar;
    } else {
      this.name = this.call.callInitiator.name;
      this.avatar = this.call.callInitiator.avatar;
    }
  }
}
