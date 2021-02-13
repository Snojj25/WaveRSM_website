import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { DataBaseService } from '../services/database.service';

@Injectable({
  providedIn: 'root',
})
export class CanReadGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private dbService: DataBaseService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      return this.dbService.getUserData(this.authService.userUid).pipe(
      take(1),
      map((user) => {
        if (user && this.authService.allowSubscriber(user)) {
          console.log("guard allowed access");
          return true;
        } else {
          console.error('can-read guard blocked acces');
          return false;
        }
      })
    );
  }
}
