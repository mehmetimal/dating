import {Component, Input, OnInit} from '@angular/core';
import {JhiEventManager} from '../../../services/event-manager.service';

@Component({
  selector: 'app-news-sidemenu',
  templateUrl: './news-sidemenu.component.html',
  styleUrls: ['./news-sidemenu.component.scss']
})
export class NewsSidemenuComponent implements OnInit {
  @Input() title;
  @Input() popularNewsCard;
  @Input() archiveCard;

  constructor(private eventManager: JhiEventManager) { }

  ngOnInit() {
  }

  searchNews() {
    this.eventManager.broadcast({
      name: 'search-news'
    });
  }

  clickArchiveItem(e) {
    let parentNode = e.target.parentNode;
    if (parentNode.tagName === 'A') {
      parentNode = parentNode.parentNode;
    }
    if (e && e.target) {
      const icon = parentNode.querySelector('i');
      const button = parentNode.querySelector('a');
      if (button.classList.contains('active')) {
        button.className = button.className.replace('active', ' ');
      } else {
        button.className += ' active';
      }
      if (icon.classList.contains('fa-angle-right')) {
        icon.className = icon.className.replace('fa-angle-right', ' fa-angle-down');
      } else {
        icon.className = icon.className.replace('fa-angle-down', ' fa-angle-right');
      }
    }
  }

}
