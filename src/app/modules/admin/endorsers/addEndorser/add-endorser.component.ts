import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { UploadAwsService } from '../../services/upload-aws.service';
import { VideoTeleprompterComponent } from 'app/layout/common/video-teleprompter/video-teleprompter.component';

@Component({
    selector: 'add-endorser',
    templateUrl: './add-endorser.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        VideoTeleprompterComponent,
    ],
})
export class AddEndorserComponent implements OnInit {
    verticalStepperForm: UntypedFormGroup;
    @ViewChild('video') videoElementRef: ElementRef;
    @ViewChild('recordedVideo') recordVideoElementRef: ElementRef;
    @ViewChild('teleprompter') teleprompter: VideoTeleprompterComponent;

    stream: MediaStream;
    recorder: MediaRecorder;
    recording: boolean = false;
    videoRecorderState: string;
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private uploadAwsService: UploadAwsService
    ) {}
    ngOnInit(): void {
        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                video: ['', [Validators.required]],
            }),
            step2: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                userName: ['', Validators.required],
                about: [''],
            }),
            step3: this._formBuilder.group({
                byEmail: this._formBuilder.group({
                    companyNews: [true],
                    featuredProducts: [false],
                    messages: [true],
                }),
                pushNotifications: ['everything', Validators.required],
            }),
        });
    }
    async startRecording() {
        this.videoRecorderState = 'RECORDING_STARTED';
        const mediaDevices = navigator.mediaDevices;
        if (mediaDevices && mediaDevices.getUserMedia) {
            try {
                this.stream = await mediaDevices.getUserMedia({ video: true });
                this.videoElementRef.nativeElement.srcObject = this.stream;
                this.videoElementRef.nativeElement.play();
                this.recorder = new MediaRecorder(this.stream);
                this.recorder.ondataavailable = (event) => {
                    const recordedVideo = URL.createObjectURL(event.data);
                    this.recordVideoElementRef.nativeElement.src =
                        recordedVideo;
                    this.recording = false;
                };
                this.recorder.start();
                this.recording = true;
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
            this.teleprompter.playOrPauseScript();
        } else {
            console.warn('getUserMedia not supported on your browser');
        }
    }

    stopRecording() {
        this.teleprompter.stopScrollScript();
        this.verticalStepperForm
            .get('step1')
            .get('video')
            .patchValue(this.recording);
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
        if (this.recording) {
            this.recorder.stop();
        }
    }
}
