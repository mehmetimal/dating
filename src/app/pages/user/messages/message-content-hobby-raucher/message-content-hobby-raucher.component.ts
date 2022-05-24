import {Component, Inject, Injector, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {HobbyAnswerType} from '../../../../model/hobby-answer-type.enum';
import {UserService} from '../../../../services/user.service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-message-content-hobby-raucher',
  templateUrl: './message-content-hobby-raucher.component.html'
})
export class MessageContentHobbyRaucherComponent implements OnInit {

  @Input() msg;
  socket: Socket;

  public JA = HobbyAnswerType.JA;
  public NEIN = HobbyAnswerType.NEIN;
  public VIELLEICHT = HobbyAnswerType.VIELLEICHT;
  public VIDEOCHATZEIGEN = HobbyAnswerType.VIDEOCHATZEIGEN;
  public KEINEANGABE = HobbyAnswerType.KEINEANGABE;

  constructor(public userService: UserService,
              private injector: Injector,
              @Inject(PLATFORM_ID) private platformId: any,
  ) {

    if (isPlatformBrowser(this.platformId)) {
      this.socket = this.injector.get<Socket>(Socket);
    }
  }

  ngOnInit() {
  }

  answerRaucherQuestion(param) {
    this.userService.updateUserHobby('RAUCHER', param).subscribe(value => {
      this.notifyUserProfileHobbies();
    });
  }

  notifyUserProfileHobbies() {
    this.socket.emit('hobbiesChangedEvent');
  }

}
