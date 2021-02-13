import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-small-screen-header',
  templateUrl: './small-screen-header.component.html',
  styleUrls: ['./small-screen-header.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'initial',
        style({
          transform: 'scale(0)',
          transformOrigin: 'top right',
          borderRadius: '100%',
        })
      ),
      state(
        'final',
        style({
          transform: 'scale(1)',
          borderRadius: '0%',
        })
      ),
      transition('initial=>final', animate('600ms ease-in')),
      transition('final=>initial', animate('600ms ease-out')),
    ]),
  ],
})
export class SmallScreenHeaderComponent implements OnInit {
  @ViewChild('fullNav') fullNav: ElementRef;
  @ViewChild('hamBtn') hamBtn: ElementRef;
  @Input() activeId: String;

  user: firebase.User;
  userSub: Subscription;

  faTimes = faTimes;

  isOpen: boolean = false;
  currentState = 'initial';

  constructor(private renderer: Renderer2, private authService: AuthService, private router: Router) {}

  changeState() {
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  showNav() {
    // Body overflow hidden
    if (this.isOpen) {
      this.renderer.removeClass(this.fullNav.nativeElement, 'open');
      this.renderer.removeClass(this.hamBtn.nativeElement, 'open');
    } else {
      this.renderer.addClass(this.fullNav.nativeElement, 'open');
      this.renderer.addClass(this.hamBtn.nativeElement, 'open');
    }
    this.isOpen = !this.isOpen;
  }

  logOut() {
    this.authService
      .signOut()
      .then((_) => {
        this.router.navigate(['home']).catch((err) => {
          console.log('signOut navigate away error: ' + err);
        });
      })
      .catch((err) => {
        console.log('signOut error: ' + err);
        throw Error(err);
      });
  }
}
