import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { DataBaseService } from '../services/database.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private dbService: DataBaseService
  ) {
    this.user = this.afAuth.authState.pipe(
      take(1),
      map((user) => {
        if (user) {
          return user;
        } else {
          return null;
        }
      })
    );
  }

  // ? =====================================
  private setUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      'users/' + user.uid
    );
    return userRef.set(user);
  }

  // ? =====================================

  // Google signup/login ========================
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider).then((credential) => {
      console.log(credential.user);
      const data = {
        uid: credential.user.uid,
        email: credential.user.uid,
        name: credential.user.displayName,
      };
      this.setUserData(data);
    });
  }

  // ======================================================
  emailSignUp(email: string, password: string, userName: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const userData: User = {
          uid: user.user.uid,
          username: userName,
          email: email,
          password: password,
        };
        return this.setUserData(userData);
      })
      .catch((err) => {
        console.log('error code: creating new user');
        console.log(err);
      });
  }
  // ==============================================
  emailLogin(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // ==============================================
  signOut() {
    return this.afAuth.signOut();
  }

  // ? =====================================
}
