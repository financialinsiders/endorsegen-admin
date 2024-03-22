import { Injectable, inject } from "@angular/core";
import {
  AngularFirestore,
} from "@angular/fire/compat/firestore";
import { Firestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  private dbPath = "/advisers";
  newBot: { 1: any };
  newLandingPage: { 1: any };
  firestore: Firestore = inject(Firestore);

  constructor(private db: AngularFirestore) {
  }
  getEndorsers(agentId) {
    return this.db.collection("endorsers").ref.where("agentId", "==", agentId);
  }
}
