import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() activeId: String;
  
  srcHeight: any;
  srcWidth: any;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.srcHeight = window.innerHeight;
    this.srcWidth = window.innerWidth;
  }

  constructor() {
    this.getScreenSize();
   }

  ngOnInit(): void {
  }

  onResize(e) {
    var width = e.target.innerWidth;
    var height = e.target.innerHeight;
    this.srcWidth = width;
    this.srcHeight = height
  }
}
