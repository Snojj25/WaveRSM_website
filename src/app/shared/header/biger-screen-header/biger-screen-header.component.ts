import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-biger-screen-header',
  templateUrl: './biger-screen-header.component.html',
  styleUrls: ['./biger-screen-header.component.scss'],
})
export class BigerScreenHeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private router: Router) {}
  @Input() activeId: String;

  user: firebase.User;
  userSub: Subscription;

  // ===================
  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }
  
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  // ===================

  logOut() {
    this.authService
      .signOut()
      .then((_) => {
        this.router.navigate(['home']).catch((err) => {
          console.log('signOut navigate away error: ' + err);
          throw Error(err);
        });
      })
      .catch((err) => {
        console.log('signOut error: ' + err);
        throw Error(err);
      });
  }
}
