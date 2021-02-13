import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];

  empty = false;
  notScrolled = true;
  batch = 5;

  mode: string = 'photos';
  symbolFilter: string;


  imgSrc = 'https://www.youtube.com/embed/v64KOxKVLVg';

  constructor(
    private afs: AngularFirestore,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    protected _senitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadInitPosts();
  }

  loadInitPosts() {
    return this.getBatch('').subscribe((arr) => {
      this.posts = arr;
    });
  }

  loadNextPost() {
    const lastPost = this.posts[this.posts.length - 1].dateTime;
    this.getBatch(lastPost).subscribe((next) => {
      this.spinner.hide();
      if (next.length === 0) {
        this.empty = true;
      }
      this.posts = this.posts.concat(next);
      this.notScrolled = true;
    });
  }

  getBatch(start: any) {
    return (
      this.afs
        .collection('posts')
        // .doc(this.mode)
        .doc(this.mode)
        .collection('posts', (ref) => {
          if (this.symbolFilter != '') {
            console.log('inside filter');
            return ref
              .orderBy('dateTime', 'desc')
              .where('symbol', '==', this.symbolFilter)
              .startAfter(start)
              .limit(this.batch);
          } else {
            return ref
              .orderBy('dateTime', 'desc')
              .startAfter(start)
              .limit(this.batch);
          }
        })
        .valueChanges()
        .pipe(
          map((arr: Post[]) => {
            return arr;
          })
        )
    );
  }

  onScroll() {
    console.log('scrolled');
    if (!this.empty && this.notScrolled) {
      this.spinner.show();
      this.notScrolled = false;
      this.loadNextPost();
    }
  }

  onModeEmitted(event) {
    console.log('emitted');
    console.log(event);
    if (this.mode === 'photos') {
      this.mode = 'videos';
    } else {
      this.mode = 'photos';
    }
    this.loadInitPosts();
  }

  onSymbolFilter(event) {
    if (this.symbols.includes(event)) {
      this.symbolFilter = event;
      this.loadInitPosts();
    } else {
      this.symbolFilter = '';
      this.loadInitPosts();
    }
  }

  onNavigate(id: string, mode: string) {
    // const dateString = moment(post.dateTime['seconds'] * 1000).format(
    //   'Do MMMM YYYY'
    // );
    this.router.navigate(['post-detail'], {
      queryParams: { id: id, mode: mode },
    });
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    let arr = url.split("/");
    let videoId = arr[arr.length -1];
    const finalUrl = "https://www.youtube.com/embed/" + videoId;
    console.log(finalUrl)
    return this._senitizer.bypassSecurityTrustResourceUrl(finalUrl);
  }

  symbols = [
    'BTCUSD',
    'DSHUSD',
    'ETHUSD',
    'LTCUSD',
    'USDSGD',
    'USDBRO',
    'USDWTI',
    'XAGUSD',
    'XAUUSD',
    'XPDUSD',
    'XPTUSD',
    'CADCHF',
    'CADJPY',
    'NZDCAD',
    'NZDCHF',
    'NZDJPY',
    'NZDUSD',
    'AUDUSD',
    'AUDCAD',
    'AUDCHF',
    'AUDJPY',
    'AUDNZD',
    'USDJPY',
    'USDCAD',
    'USDCHF',
    'USDSGD',
    'USDJPY',
    'USDCAD',
    'USDCHF',
    'USDSGD',
    'GBPAUD',
    'GBPCAD',
    'GBPJPY',
    'GBPNZD',
    'GBPUSD',
    'GBPCHF',
    'EURAUD',
    'EURCAD',
    'EURCHF',
    'EURCHF',
    'EURGPB',
    'EURJPY',
    'EURNZD',
    'EURUSD',
  ];

  checkLength(string: string): string {
    const arr = string.split(' ');
    if (arr.length > 30) {
      // console.log(arr.splice(0, 30).join(" "));
      return arr.splice(0, 30).join(' ') + '...';
    } else {
      return string;
    }
  }
}
