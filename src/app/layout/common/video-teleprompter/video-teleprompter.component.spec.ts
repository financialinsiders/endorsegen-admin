import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoTeleprompterComponent } from './video-teleprompter.component';

describe('VideoTeleprompterComponent', () => {
  let component: VideoTeleprompterComponent;
  let fixture: ComponentFixture<VideoTeleprompterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoTeleprompterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoTeleprompterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
