import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { DataBaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent implements OnInit, OnDestroy {
  user: User;
  userSub: Subscription;

  constructor(
    private authService: AuthService,
    private dbService: DataBaseService
  ) {
    // this.authService = authService;
    // this.userId = authService.userUid;
  }

  // =======================
  ngOnInit(): void {
    this.authService.user.toPromise().then((fbUser: firebase.User) => {
      this.userSub = this.dbService
        .getUserData(fbUser.uid)
        .subscribe((user: User) => {
          this.user = user;
        });
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  // =======================
}
