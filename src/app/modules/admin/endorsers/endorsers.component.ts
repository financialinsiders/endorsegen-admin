import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';

@Component({
    selector: 'endorsers',
    standalone: true,
    templateUrl: './endorsers.component.html',
    imports: [CommonModule],
    encapsulation: ViewEncapsulation.None,
})
export class EndorsersComponent {
    endorsers: any[] = [];
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
