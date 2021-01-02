import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.scss'],
})
export class MainCarouselComponent implements OnInit {
  hover: boolean = false;
  srcHeight: any;
  srcWidth: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.srcHeight = window.innerHeight;
    this.srcWidth = window.innerWidth;
  }

  onResize(e) {
    var width = e.target.innerWidth;
    var height = e.target.innerHeight;
    this.srcWidth = width;
  }

  constructor(
    private authService: AuthService,
  ) {
    this.getScreenSize();
  }

  images: String[];
  posts: Post[];
  @ViewChild('mainCarousel') mainCarousel;

  ngOnInit(): void {
    this.images = [
      '../../assets/trading1.png',
      '../../assets/trading2.jpg',
      '../../assets/trading3.jpeg',
      '../../assets/trading4.png',
    ];
  }

  onClick(idx: Number) {
    console.log('clicked');
    this.mainCarousel.select('ngb-slide-' + idx);
  }

  onSlide(slideEvent: NgbSlideEvent) {
    //  console.log(slideEvent.current);
  }

  onFetchPosts() {
    console.log('clicked');
    // this.dbService.fetchPosts().subscribe(postsArray => {
    //   console.log(postsArray);
    // })
    this.authService.user.subscribe((user) => {
      console.log(user);
    });
  }
}
