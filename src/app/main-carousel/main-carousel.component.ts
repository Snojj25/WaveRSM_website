import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.css']
})
export class MainCarouselComponent implements OnInit {

  constructor() { }
  images: String[];
  @ViewChild("mainCarousel") mainCarousel;

  ngOnInit(): void {
    this.images = ["../../assets/trading1.png","../../assets/trading2.jpg","../../assets/trading3.jpeg","../../assets/trading4.png"]
  }

  
  
  onClick() {
    console.log("clicked");
    this.mainCarousel.pause();
  }

}
