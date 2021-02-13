import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hover: boolean;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }

  // ? GETTERS ====================

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // ? ============================

  onSwitchMode() {
    this.router.navigate(['register']).catch((err) => {
      console.log(err);
    });
  }

  onClick() {
    console.log(this.password);
  }

  onSubmit() {
    // console.log(this.loginForm);
    this.authService
      .emailLogin(this.email.value, this.password.value)
      .then((res) => {
        console.log('Auth result: ' + res);
        this.router.navigate(['home']).catch((err) => {
          console.log('login navigate away error: ' + err);
        });
      })
      .catch((err) => {
        console.log('login error: ' + err);
        throw Error(err);
      });
  }
}
