import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FirestoreService } from '../services/firestore.service';
import { TranslocoModule } from '@ngneat/transloco';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'endorsers',
    standalone: true,
    templateUrl: './endorsers.component.html',
    imports: [TranslocoModule, CommonModule,MatIconModule, MatButtonModule, MatRippleModule, MatMenuModule, MatTabsModule, MatButtonToggleModule, FormsModule, MatFormFieldModule, TextFieldModule, ReactiveFormsModule ],
    encapsulation: ViewEncapsulation.None,
})
export class EndorsersComponent {
    endorsers: any[] = [];
    selectedProject: string = 'Sort By:';
    constructor(private firestoreService: FirestoreService) {}
    ngOnInit(): void {
        const agentId = '493';
        this.firestoreService.getEndorsers(agentId).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const endorser = doc.data();
            this.endorsers.push(endorser);
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });;
    }
}
