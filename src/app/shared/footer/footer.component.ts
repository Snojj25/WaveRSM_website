import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  srcHeight: any;
  srcWidth: any;

  isCollapsed: boolean = true;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.srcHeight = window.innerHeight;
    this.srcWidth = window.innerWidth;
  }

  constructor() {
    this.getScreenSize();
  }

  ngOnInit(): void {}

  onResize(e) {
    var width = e.target.innerWidth;
    var height = e.target.innerHeight;
    this.srcWidth = width;
    // if (width >= 1200) {
    //   console.log('xl');
    // } else if (width >= 992) {
    //   console.log('lg');
    // } else if (width >= 768) {
    //   console.log('md');
    // } else if (width >= 576) {
    //   console.log('sm');
    // } else {
    //   console.log('xs');
    // }
  }
}
