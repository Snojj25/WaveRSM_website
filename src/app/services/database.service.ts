import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Trade } from '../models/trade.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataBaseService {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {}

  userId: string;

  private photoPostsCollection = this.afs
    .collection('posts')
    .doc('photos')
    .collection('posts');
  private videoPostsCollection = this.afs
    .collection('posts')
    .doc('videos')
    .collection('posts');

  // fetchPosts() {
  //   return this.postsCollection.snapshotChanges().pipe(
  //     map(responseData => {
  //       const postsArray: Post[] = [];
  //       for (const key in responseData) {
  //         if (responseData.hasOwnProperty(key)) {
  //           postsArray.push( {
  //             id: responseData[key].payload.doc.data()["id"],
  //             title: responseData[key].payload.doc.data()["title"],
  //             description : responseData[key].payload.doc.data()["description"],
  //             imgUrl: responseData[key].payload.doc.data()["imgUrl"],
  //             dateTime: responseData[key].payload.doc.data()["dateTime"],

  getPhotoPost(id: string): Observable<Post> {
    return this.photoPostsCollection
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((postData) => {
          const dateString = moment(
            postData.payload.data()['dateTime']['seconds'] * 1000
          ).format('Do MMMM YYYY');
          return new Post(
            postData.payload.data()['id'],
            postData.payload.data()['title'],
            postData.payload.data()['description'],
            postData.payload.data()['imgUrl'],
            postData.payload.data()['symbol'],
            dateString
          );
        })
      );
  }

  getVideoPost(id: string): Observable<Post> {
    return this.videoPostsCollection
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((postData) => {
          const dateString = moment(
            postData.payload.data()['dateTime']['seconds'] * 1000
          ).format('Do MMMM YYYY');
          return new Post(
            postData.payload.data()['id'],
            postData.payload.data()['title'],
            postData.payload.data()['description'],
            postData.payload.data()['imgUrl'],
            postData.payload.data()['symbol'],
            dateString
          );
        })
      );
  }

  //? UPDATE POST
  updatePost(id: string, data: any, mode: String): Promise<void> {
    if (mode == 'photos') {
      return this.photoPostsCollection
        .doc(id)
        .update(data)
        .catch((err) => {
          console.log('update photo post error: ' + err);
          throw Error(err);
        });
    } else {
      return this.videoPostsCollection
        .doc(id)
        .update(data)
        .catch((err) => {
          console.log('update video post error: ' + err);
          throw Error(err);
        });
    }
  }

  //? UPDATE POST
  deletePost(id: string, mode: String) {
    if (mode == 'photos') {
      return this.photoPostsCollection
        .doc(id)
        .delete()
        .catch((err) => {
          console.log('delete photo post error: ' + err);
          throw Error(err);
        });
    } else {
      return this.videoPostsCollection
        .doc(id)
        .delete()
        .catch((err) => {
          console.log('delete video post error: ' + err);
          throw Error(err);
        });
    }
  }

  //& USER DATA ======================================
  //& ================================================

  updateUser(user: User, data: any) {
    return this.afs
      .doc('users/' + user.uid)
      .update(data)
      .catch((err) => {
        console.log(err);
        throw Error(err);
      });
  }

  getUserData(uid: string): Observable<User> {
    return this.afs
          .doc('users/' + uid)
          .valueChanges()
          .pipe(
            take(1),
            map((user) => {
              const userData = new User(
                user['uid'],
                user['name'],
                user['email'],
                user['password'],
                user['roles']
              );
              return userData;
            }),
            catchError((err) => {
              console.log('error in get User Data: ' + err);
              throw err;
            })
          );
  }

  // ! TRADES ============================================================================
  // ! ====== ============================================================================
  private tradesRef = this.afs.collection('trades').doc('userTrades');

  getTrades(uid: string): Observable<Trade[]> {
    const tradesCollection = this.tradesRef.collection(uid, (ref) => {
      return ref.orderBy('dateTime', 'desc');
    });
    return tradesCollection.snapshotChanges().pipe(
      map((responseData) => {
        const tradesArray: Trade[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            // const dateString = moment(
            //   responseData[key].payload.doc.data()['dateTime']['seconds'] * 1000
            // ).format('ddd, MMM Do YYYY');
            const newDate = new Date(
              responseData[key].payload.doc.data()['dateTime']['seconds'] * 1000
            );
            const trade = new Trade(
              responseData[key].payload.doc.data()['symbol'],
              responseData[key].payload.doc.data()['tradeType'],
              +responseData[key].payload.doc.data()['entry'].toFixed(5),
              +responseData[key].payload.doc.data()['exit'].toFixed(5),
              +responseData[key].payload.doc.data()['lotSize'].toFixed(2),
              +responseData[key].payload.doc.data()['profit'].toFixed(2),
              newDate
            );
            tradesArray.push(trade);
          }
        }
        return tradesArray;
      }),
      catchError((err) => {
        console.log(err);
        throw Error(err);
      })
    );
  }

  // ! ===================================================================================
  // ! ===================================================================================
}
