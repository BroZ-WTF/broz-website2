import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public loginDialogRef: MatDialogRef<LoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loginForm = this.formBuilder.group({
      'login_name': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  submit() {
    this.loginDialogRef.close(this.loginForm.value);
  }

  close() {
    this.loginDialogRef.close(null);
  }
}
