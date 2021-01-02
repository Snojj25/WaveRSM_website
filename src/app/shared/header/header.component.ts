import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() activeId: String;
  
  user: firebase.User;
  userSub: Subscription;
  isMenuCollapsed = true;

  constructor(private authService: AuthService, private router: Router) { }

  // @ViewChild("navUl", {"static": true}) navUl;

  ngOnInit(): void {
  this.userSub = this.authService.user.subscribe(user => {
    this.user = user;
  })
  }

  onClick() {
    console.log(this.user);
  }

  logOut() {
    this.authService.signOut().then(_ => {
      this.router.navigate(["home"]).catch(err => {
        console.log("signOut navigate away error: " + err);
      })
    }).catch(err => {
      console.log("signOut error: " + err);
      throw Error(err);
    });
  }
  
  ngOnDestroy(): void {
    this.userSub.unsubscribe;
  }

  navigateTo() {
    console.log("navigated")
    this.router.navigate(["posts"])
  }
}
