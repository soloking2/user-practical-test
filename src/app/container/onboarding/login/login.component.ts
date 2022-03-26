import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  validPattern = "/^[A-Za-z0-9_@./#&+-]*$/";
  // validPattern = '/^[a-zA-Z0-9_]*$/';

  isSuccess: boolean = false;
  detail: any;

  // login$ = this.auth.loginSuccess$.pipe(
  //   tap((data: any) => {
  //     this.detail = data.detail;
  //     this.isSuccess = true;
  //   })
  // );
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
          Validators.pattern('/^[a-zA-Z0-9_@./#&+-]*$'),
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

  submit() {}
}
