import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaItemComponent } from './media-item.component';

describe('ResultListItemComponent', () => {
  let component: MediaItemComponent;
  let fixture: ComponentFixture<MediaItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
