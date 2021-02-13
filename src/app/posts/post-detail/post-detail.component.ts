import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { DataBaseService } from '../../services/database.service';
import { Post } from '../../models/post.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  post: Post;
  mode: String;
  postId: string;
  editting: boolean = false;

  user: User;
  fbUserSub: Subscription;
  userSub: Subscription;
  postSub: Subscription;

  paramSub: Subscription;

  srcHeight: any;
  srcWidth: any;

  titleText: String;
  descText: String;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.srcHeight = window.innerHeight;
    this.srcWidth = window.innerWidth;
  }

  constructor(
    public authService: AuthService,
    private dbService: DataBaseService,
    private route: ActivatedRoute,
    private _location: Location,
    protected _senitizer: DomSanitizer,
    private modal: NgbModal
  ) {
    console.log("CONSTRUCTOR FUNCTION");
    this.authService = authService;
    this.paramSub = this.route.queryParams.subscribe((params) => {
      this.postId = params['id'];
      this.mode = params['mode'];
    });
    this.getScreenSize();
  }

  // ====================================
  ngOnInit(): void {
    console.log("ON INIT FUNCTION");
    this.fbUserSub = this.authService.user.subscribe(
      (fbUser: firebase.User) => {
        console.log('fbUser.uid: ' + fbUser.uid);
        this.userSub = this.dbService
          .getUserData(fbUser.uid)
          .subscribe((user: User) => {
            this.user = user;
          });
      }
    );
    // =========================
    if (this.mode === 'photos') {
      this.postSub = this.dbService
        .getPhotoPost(this.postId)
        .subscribe((post: Post) => {
          this.post = post;
          this.titleText = post.title;
          this.descText = post.description;
        });
    } else {
      this.postSub = this.dbService
        .getVideoPost(this.postId)
        .subscribe((post: Post) => {
          this.post = post;
          this.titleText = post.title;
          this.descText = post.description;
        });
    }
  }
  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.userSub.unsubscribe();
    this.fbUserSub.unsubscribe();
  }
  // =========================================

  // UPDATING AND DELETING POSTS ====================================
  onUpdatePost() {
    console.log('in updatePost');
    const data = { title: this.titleText, description: this.descText };
    this.dbService
      .updatePost(this.postId, data, this.mode)
      .then((_) => {
        console.log('Post update sucessful!');
        this._location.back();
      })
      .catch((err) => {
        console.log('error in post delete: ' + err);
      });
    this.editting = false;
  }

  onDeletePost() {
    this.dbService
      .deletePost(this.postId, this.mode)
      .then((_) => {
        console.log('Post deletion sucessful!');
      })
      .catch((err) => {
        console.log('error in post delete: ' + err);
      });
  }

  //  HELPERS ============================================================
  sanitizeUrl(url: string): SafeResourceUrl {
    let arr = url.split('/');
    let videoId = arr[arr.length - 1];
    const finalUrl = 'https://www.youtube.com/embed/' + videoId;
    console.log(finalUrl);
    return this._senitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }

  stopEditting() {
    this.editting = false;
  }

  openModal(content) {
    this.modal.open(content);
  }

  onResize(e) {
    var width = e.target.innerWidth;
    var height = e.target.innerHeight;
    this.srcWidth = width;
  }
}
