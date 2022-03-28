import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UserData } from 'src/app/models/user';
import { UsersService } from '../users.service';

@Component({
  selector: 'ua-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  form: FormGroup;
  id: number;
  successMessage!: string;

  add$ = this.userSrv.add$.pipe(
    tap((res) => {
      if (res) {
        this.successMessage = 'Successfully Added!';
      }
    })
  );
  fetch$ = this.userSrv.getValue$.pipe(
    tap((res) => {
      const data = res.data
      this.form.patchValue({
        name: data.first_name
      });
    })
  );
  edit$ = this.userSrv.edit$.pipe(
    tap((res) => {
      if (res) {
        this.successMessage = 'Successfully Edited Investment';
      }
    })
  );
  constructor(
    private fb: FormBuilder,
    public userSrv: UsersService,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = +params.get('id');
    });
    if (this.id) {
      this.fetch(this.id);
    }
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      job: ['', Validators.required],

    });
  }

  controlIsError(controlName): boolean {
    return (
      (this.form?.get(controlName)?.dirty ||
        this.form?.get(controlName)?.touched) &&
      this.form?.get(controlName)?.invalid
    );
  }

  fetch(id: number) {
    this.userSrv.getValue(id);
  }

  initiate() {
    console.log(this.form.value)
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return false;
    } else {
      if (this.id) {
        const data: UserData = {
          ...this.form.value,
          id: this.id,
        };
        this.userSrv.initiateEdit(data);
      } else {
        this.userSrv.add(this.form.value);
      }
      return true;
    }
  }
}
