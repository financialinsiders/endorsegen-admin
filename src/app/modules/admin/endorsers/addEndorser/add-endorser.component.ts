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
import { VideoRecorderComponent } from 'app/layout/common/video-recorder/video-recorder.component';
import { VideoTeleprompterComponent } from 'app/layout/common/video-teleprompter/video-teleprompter.component';

import { CommonModule } from '@angular/common';
import { OpenaiService } from '../../services/openai.service';
interface Entry {
    label: string;
    value: string;
}
@Component({
    selector: 'add-endorser',
    templateUrl: './add-endorser.component.html',
    styleUrls: ['./add-endorser.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatIconModule,
        FormsModule,
        CommonModule,
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
        VideoRecorderComponent,
    ],
})
export class AddEndorserComponent implements OnInit {
    verticalStepperForm: UntypedFormGroup;
    @ViewChild('video') videoElementRef: ElementRef;
    @ViewChild('recordedVideo') recordVideoElementRef: ElementRef;
    @ViewChild('teleprompter') teleprompter: VideoTeleprompterComponent;
    @ViewChild('videorecorder') videoRecorder: VideoRecorderComponent;
    videoRecorderState: string;
    recording: boolean = false;
    points = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    surveyList: Entry[] = [
        {
            label: 'Window service',
            value: 'window',
        },
        {
            label: 'Door service',
            value: 'door',
        },
        {
            label: 'Roof service',
            value: 'roof',
        },
        {
            label: 'Other service',
            value: 'other',
        },
    ];
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private openaiService: OpenaiService
    ) {}
    ngOnInit(): void {
        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                email: ['', Validators.required],
                phoneNumber: ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                videoPoint: ['', Validators.required],
                leadPoint: ['', Validators.required],
            }),
            step3: this._formBuilder.group({
                surveyOption: ['', Validators.required],
            }),
            step4: this._formBuilder.group({
                emailPrompt: ['', [Validators.required]],
                emailSubject: ['', [Validators.required]],
                emailBody: ['', [Validators.required]],
            }),
            step5: this._formBuilder.group({
                video: ['', [Validators.required]],
            }),
            step6: this._formBuilder.group({
                byEmail: this._formBuilder.group({
                    companyNews: [true],
                    featuredProducts: [false],
                    messages: [true],
                }),
                pushNotifications: ['everything', Validators.required],
            }),
        });
    }

    onRecordedVideoStateChange(newState: string) {
        this.videoRecorderState = newState;
        switch (newState) {
            case 'RECORDING_STARTED':
                this.teleprompter.playOrPauseScript();
                this.recording = true;
                break;
            case 'RECORDING_STOPPED':
                this.teleprompter.stopScrollScript();
                break;

            case 'RECORDING_COMPLETE':
                this.recording = false;
                this.verticalStepperForm
                    .get('step1')
                    .get('video')
                    .patchValue(this.recording);
                break;
        }
    }
    async generateEmail() {
        this.verticalStepperForm
            .get('step4')
            .get('emailBody')
            .setValue(
                await this.openaiService.generateText(
                    this.verticalStepperForm.get('step4').value
                        .emailPrompt as string
                )
            );
    }
}
