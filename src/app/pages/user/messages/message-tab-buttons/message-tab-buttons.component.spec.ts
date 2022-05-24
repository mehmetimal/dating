import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTabButtonsComponent } from './message-tab-buttons.component';

describe('MessageTabButtonsComponent', () => {
  let component: MessageTabButtonsComponent;
  let fixture: ComponentFixture<MessageTabButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageTabButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTabButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
