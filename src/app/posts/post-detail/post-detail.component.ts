import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataBaseService } from 'src/app/services/database.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  post: Post;
  mode: String;
  id: string;

  postSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private dbService: DataBaseService,
    protected _senitizer: DomSanitizer
  ) {
    this.id = this.route.snapshot.queryParams.id;
    this.mode = this.route.snapshot.queryParams.mode;
  }

  onScrolled() {
    console.log('Scrolled');
  }

  ngOnInit(): void {
    console.log("mode: "+ this.mode)
    if (this.mode === 'photos') {
      console.log("inside photos")
      this.postSub = this.dbService.getPhotoPost(this.id).subscribe((post: Post) => {
        this.post = post;
      });
    } else {
      console.log("inside videos")
      this.postSub = this.dbService.getVideoPost(this.id).subscribe((post: Post) => {
        this.post = post;
      });
    }
  }
  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    let arr = url.split("/");
    let videoId = arr[arr.length -1];
    const finalUrl = "https://www.youtube.com/embed/" + videoId;
    console.log(finalUrl)
    return this._senitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }

  onTest() {
    console.log(this.mode);
  }
}
