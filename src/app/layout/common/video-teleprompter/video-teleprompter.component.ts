import { CommonModule } from '@angular/common';
import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-video-teleprompter',
    templateUrl: './video-teleprompter.component.html',
    styleUrls: ['./video-teleprompter.component.scss'],
    standalone: true,
    imports: [FormsModule, CommonModule]
})
export class VideoTeleprompterComponent {
    @Input() script: string;
    @ViewChild('teleprompterContainer') teleprompterContainer: ElementRef;
    @ViewChild('scc') speedControllerContainer: ElementRef;
    scrollSpeed: number = 3;
    isPlayingScript = false;
    scrollEvent;
    currentScrollTopOffset = 0;
    maxScroll = 0;
    resetScrollTop = false;
    isFreshPlay = true;

    currentSectionIndex: number = 0;
    animationPlayer: any;

    changeSpeed() {
        this.speedControllerContainer.nativeElement.classList.add(
            'expand-width'
        );
    }

    closeSpeedController() {
        this.speedControllerContainer.nativeElement.classList.add(
            'expand-width'
        );
    }

    start() {
        this.isFreshPlay = true;
        this.playOrPauseScript();
    }

    playOrPauseScript() {
        this.speedControllerContainer.nativeElement.classList.remove(
            'expand-width'
        );
        this.isPlayingScript = !this.isPlayingScript;

        if (this.isPlayingScript) {
            if (this.isFreshPlay) this.resetScrollTop = true;
            this.playScript();
        } else {
            this.isFreshPlay = false;
            this.pauseScript();
        }
    }

    playScript() {
        let element = this.teleprompterContainer.nativeElement;
        this.maxScroll = element.scrollHeight - element.offsetHeight;
        if (this.resetScrollTop == true) {
            element.scrollTop = 0;
            this.currentScrollTopOffset = 0;
            this.startScroll(element);
            return;
        }

        this.startScroll(element);
    }

    pauseScript() {
        let element = this.teleprompterContainer.nativeElement;
        if (this.scrollEvent) clearInterval(this.scrollEvent);
        if (element.scrollTop < this.maxScroll) {
            this.resetScrollTop = false;
        }
    }

    startScroll(element) {
        this.scrollEvent = setInterval(() => {
            if (element.scrollTop < this.maxScroll) {
                this.currentScrollTopOffset += this.scrollSpeed;
                element.scrollTop = this.currentScrollTopOffset;
            } else {
                this.stopScrollScript();
            }
        }, 120);
    }

    stopScrollScript() {
        if (this.scrollEvent) clearInterval(this.scrollEvent);
        this.currentScrollTopOffset = 0;
        this.teleprompterContainer.nativeElement.scrollTop = 0;
        this.isPlayingScript = false;
        this.resetScrollTop = true;
        this.isFreshPlay = true;
    }

    forwardScrollScript() {
        if (this.maxScroll == 0)
            this.maxScroll =
                this.teleprompterContainer.nativeElement.scrollHeight -
                this.teleprompterContainer.nativeElement.offsetHeight;

        if (this.currentScrollTopOffset < this.maxScroll) {
            if (this.scrollEvent) clearInterval(this.scrollEvent);
            this.currentScrollTopOffset = this.currentScrollTopOffset + 50;
            if (this.isPlayingScript) {
                this.startScroll(this.teleprompterContainer.nativeElement);
            } else {
                let element = this.teleprompterContainer.nativeElement;
                element.scrollTop = this.currentScrollTopOffset;
            }
        } else {
            console.log('currentScrollTopOffset > maxScroll');
        }
    }

    backwardScrollScript() {
        if (this.currentScrollTopOffset > 0) {
            if (this.scrollEvent) clearInterval(this.scrollEvent);
            this.currentScrollTopOffset = this.currentScrollTopOffset - 80;
            if (this.isPlayingScript) {
                this.startScroll(this.teleprompterContainer.nativeElement);
            } else {
                let element = this.teleprompterContainer.nativeElement;
                element.scrollTop = this.currentScrollTopOffset;
            }
        } else {
            this.isFreshPlay = true;
            console.log('currentScrollTopOffset is 0');
        }
    }
}
