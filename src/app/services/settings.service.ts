import { Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  @Output() homeScreen = new BehaviorSubject<boolean>(true);

  constructor() { }



}
