import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UserLogin } from 'src/app/models/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'ua-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  checkPassword: string = 'password';
  showIcon: boolean = false;
  showPassword: boolean = false;
  loginForm: FormGroup;


  isSuccess: boolean = false;
  detail: any;

  login$ = this.auth.login$.pipe(
    tap((data: UserLogin) => {
      if(data) {
        this.loginForm.reset()
      }
    })
  );
  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^[A-Za-z0-9_@./#%&+-]*$/),
        ],
      ],
    });
  }

  returnHome() {}

  isControlError(controlName: string): boolean {
    return (
      (this.loginForm?.get(controlName)?.dirty ||
        this.loginForm?.get(controlName)?.touched) &&
      this.loginForm?.get(controlName)?.invalid
    );
  }

  togglePassword() {
    this.checkPassword = this.checkPassword === 'text' ? 'password' : 'text';
    this.showIcon = !this.showIcon;
  }

  submit() {
    if(!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
    }
    this.auth.loginUser(this.loginForm.value)
  }
}
