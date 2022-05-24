import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSidemenuComponent } from './news-sidemenu.component';

describe('NewsSidemenuComponent', () => {
  let component: NewsSidemenuComponent;
  let fixture: ComponentFixture<NewsSidemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsSidemenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsSidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
