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
  userUid: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.user = this.afAuth.authState.pipe(
      take(1),
      map((user) => {
        if (user) {
          this.userUid = user.uid;
          return user;
        } else {
          return null;
        }
      })
    );
  }




  // ? =====================================================

  private setUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      'users/' + user.uid
    );
    return userRef.set(user);
  }

  // TODO  UPDATE USER DATA

  // ? =====================================================

  // * =====================================================

  // Google signup/login ========================
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }
  // Google signup/login ========================

  private async oAuthLogin(provider) {
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
  async emailSignUp(email: string, password: string, userName: string) {
    try {
      const user = await this.afAuth
        .createUserWithEmailAndPassword(email, password);
      const userData: User = {
        uid: user.user.uid,
        username: userName,
        email: email,
        password: password,
        roles: {
          subscriber: true,
        },
      };
      return await this.setUserData(userData);
    } catch (err) {
      console.log('error code: creating new user');
      console.log(err);
    }
  }
  // ==============================================
  async emailLogin(email: string, password: string) {
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
  
  // * =====================================================

  // ! =====================================================-

  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
      if ( user.roles[role] ) {
        return true
      }
    }
    return false
  }

  allowSubscriber(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber']
    return this.checkAuthorization(user, allowed)
  }

  allowEditor(user: User): boolean {
    const allowed = ['admin', 'editor']
    return this.checkAuthorization(user, allowed)
  }

  allowAdmin(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }
  
  // ! =====================================================
}
