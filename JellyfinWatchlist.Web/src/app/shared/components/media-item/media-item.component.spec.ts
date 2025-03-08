import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultListItemComponent } from './media-item.component';

describe('ResultListItemComponent', () => {
  let component: ResultListItemComponent;
  let fixture: ComponentFixture<ResultListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
