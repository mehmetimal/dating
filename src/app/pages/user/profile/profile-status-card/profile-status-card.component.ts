import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-profile-status-card',
  templateUrl: './profile-status-card.component.html',
  styleUrls: ['./profile-status-card.component.scss']
})
export class ProfileStatusCardComponent implements OnInit {

  @Input() status: string;
  public notEditable = true;
  public statusEdit = false;
  public readMore = false;

  constructor(public userService: UserService) {
  }

  ngOnInit() {
  }

  statusEditable() {
    if (this.notEditable) {
      this.notEditable = false;
      if (!this.statusEdit) {
        this.statusEdit = true;
      } else {
        this.statusEdit = false;
      }
    } else {
    }
    this.readMore = !this.statusEdit;
  }

  statusEditCancel() {
    this.statusEdit = false;
    this.notEditable = true;
  }

  statusEditSave(newStatus) {
    this.userService.updateStatusText(newStatus)
        .subscribe(data => {
          this.statusEdit = false;
          if (data.response && data.response.status) {
            this.status = data.response.status;
          } else if (data.response && !data.response.status) {
            this.status = null;
          }
        });
    this.notEditable = true;
  }

  clickReadMore(isReadMore) {
    this.readMore = isReadMore;
  }
}
