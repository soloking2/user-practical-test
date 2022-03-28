import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'ua-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  checkPassword: string = 'password';
  showIcon: boolean = false;
  showPassword: boolean = false;
  registerForm: FormGroup;

  isSuccess: boolean = false;
  detail: any;

  register$ = this.auth.register$.pipe(
    tap((data: any) => {
      console.log(data);
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
    this.registerForm = this.fb.group({
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
      (this.registerForm?.get(controlName)?.dirty ||
        this.registerForm?.get(controlName)?.touched) &&
      this.registerForm?.get(controlName)?.invalid
    );
  }

  togglePassword() {
    this.checkPassword = this.checkPassword === 'text' ? 'password' : 'text';
    this.showIcon = !this.showIcon;
  }

  submit() {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
    }
    console.log(this.registerForm.value)
    this.auth.registerUser(this.registerForm.value);
  }
}
