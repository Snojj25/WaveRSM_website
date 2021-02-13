import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup;
  hover: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl(
        null,
        [Validators.required],
        [UsernameExists.username(this.afs)]
      ),
      email: new FormControl(
        null,
        [Validators.email, Validators.required],
        [EmailExists.email(this.afs)]
      ),
      passwords: new FormGroup(
        {
          password: new FormControl(null, Validators.required),
          'confirm-password': new FormControl(null, Validators.required),
        },
        { validators: this.passwordMatch }
      ),
    });
  }

  // ? GETTERS ====================
  get username() {
    return this.signupForm.get('username');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('passwords.password');
  }
  get confirm_password() {
    return this.signupForm.get('passwords.confirm-password');
  }
  get passwords() {
    return this.signupForm.get('passwords');
  }
  // ? =============================

  // & VALIDATORS ====================

  passwordMatch(group: FormGroup): { [s: string]: boolean } {
    let pass = group.get('password');
    let confPass = group.get('confirm-password');
    if (pass.value !== confPass.value) {
      return { passwordMatch: true };
    }
    return null;
  }

  // & ===============================

  onSwitchMode() {
    this.router.navigate(['login']).catch((err) => {
      console.log(err);
    });
  }

  onStep2() {
    console.log("clicked 123")
    this.router.navigate(['register2']).catch((err) => {
      console.log(err);
    });
  }

  onSignUp() {
    console.log(this.signupForm);
    this.authService
      .emailSignUp(this.email.value, this.password.value, this.username.value)
      .then((result) => {
        console.log('signUp auth result: ' + result);
        this.router.navigate(['home']).catch((err) => {
          console.log('signUp navigate away error: ' + err);
        });
      })
      .catch((err) => {
        console.log('SignUp error: ' + err);
        throw Error(err);
      });
  }

  onGoogleSignIn() {
    this.authService
      .googleLogin()
      .then((res) => {
        console.log('successfull: ' + res);
      })
      .catch((err) => console.log(err));
  }
}

// & ASYNC VALIDATORS ==================
export class UsernameExists {
  static username(afs: AngularFirestore) {
    try {
      return (control: AbstractControl) => {
        console.log(control.value);
        const username = control.value.toLowerCase();

        return afs
          .collection('users', (ref) => ref.where('name', '==', username))
          .valueChanges()
          .pipe(
            debounceTime(500),
            take(1),
            map((arr) => (arr.length ? { usernameExists: true } : null))
          );
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export class EmailExists {
  static email(afs: AngularFirestore) {
    try {
      return (control: AbstractControl) => {
        console.log(control.value);
        const email = control.value.toLowerCase();

        return afs
          .collection('users', (ref) => ref.where('email', '==', email))
          .valueChanges()
          .pipe(
            debounceTime(500),
            take(1),
            map((arr) => (arr.length ? { emailExists: true } : null))
          );
      };
    } catch (error) {
      console.log(error);
    }
  }
}
