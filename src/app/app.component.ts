import { Component, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreModule } from '@angular/fire/firestore';
import { FirebaseAppModule } from '@angular/fire/app';
import { CommonModule } from '@angular/common';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    standalone : true,
    imports    : [RouterOutlet, FirestoreModule, FirebaseAppModule, CommonModule],
})
export class AppComponent
{
    firestore: Firestore = inject(Firestore)
    advisers$: Observable<any[]>;
    /**
     * Constructor
     */
    constructor()
    {
        const aCollection = collection(this.firestore, 'advisers')
        this.advisers$ = collectionData(aCollection);
        this.advisers$.subscribe(data=> {
          console.log(data);
        })
  }
}
