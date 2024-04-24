import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import { UploadAwsService } from '../../../modules/admin/services/upload-aws.service';
import gifshots from 'gifshot';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, map, take, timer } from 'rxjs';


@Component({
  selector: 'app-video-recorder',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './video-recorder.component.html',
  styleUrl: './video-recorder.component.scss',
})
export class VideoRecorderComponent { 
  
  @Input() agentId: string;
  @ViewChild('video') videoElementRef: ElementRef;
  @ViewChild('recordedVideo') recordVideoElementRef: ElementRef;
  @Output() recordingStateChanged = new EventEmitter<string>();

  // @ViewChild('teleprompter') teleprompter: VideoTeleprompterComponent;

  stream: MediaStream;
  recorder: MediaRecorder;
  recording: boolean = false;
  videoRecorderState: string;
  constructor(private uploadAwsService: UploadAwsService) { }  // Injecting the service
  countdown$: Observable<number>;
  


  async readyRecording() {
    this.videoRecorderState = 'READY_FOR_RECORDING';
    this.recordingStateChanged.emit(this.videoRecorderState);
    const mediaDevices = navigator.mediaDevices;
    if (mediaDevices && mediaDevices.getUserMedia) {
        try {
            this.stream = await mediaDevices.getUserMedia({ video: true });
            this.videoElementRef.nativeElement.srcObject = this.stream;
            this.videoElementRef.nativeElement.play();
            this.recorder = new MediaRecorder(this.stream);
            this.recorder.ondataavailable = (event) => {
                const recordedVideo = URL.createObjectURL(event.data);
                console.log(recordedVideo);
                this.recordVideoElementRef.nativeElement.src =
                    recordedVideo['Location'];
                    console.log(recordedVideo['Location']);
                this.recording = false;
            };
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    } else {
        console.warn('getUserMedia not supported on your browser');
    }
}

startRecording() {
  this.countdown$ = timer(0, 1000).pipe(
      map((i) => {
          let count = 3 - i;
          if (count === 0) {
              this.videoRecorderState = 'RECORDING_STARTED';
              this.recordingStateChanged.emit(this.videoRecorderState);
              this.recorder.start();
              this.recording = true;
              //this.teleprompter.playOrPauseScript();
          }
          return count;
      }),
      take(4)
  );
}

stopRecording() {
 // this.teleprompter.stopScrollScript();
 // this.verticalStepperForm //PARAENT COMPONENT this needs to change.
   //   .get('video')
    //  .patchValue(this.recording);
      this.videoRecorderState = 'RECORDING_STOPPED';
      this.recorder.ondataavailable = (event) => {
      const recordedVideo = URL.createObjectURL(event.data);
     
      this.uploadAwsService.fileUpload(
          '491',
          'videos',
          recordedVideo,
          '',
          ''
      );
  };

  this.videoRecorderState = 'RECORDING_COMPLETE';
  this.recordingStateChanged.emit(this.videoRecorderState);
  if (this.recording) {
      this.recorder.stop();
  }
}

}
