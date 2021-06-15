import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log('in login component');
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const userName = form.value.userName;
    const password = form.value.password;

    this.isLoading = true;

    this.authService.login(userName, password).subscribe(
      //Handle response data
      (resData) => {
        console.log(resData);
        this.isLoading = false;
      },
      //Handle response error
      (errorMessage) => {
        console.log(errorMessage);
        this.isLoading = false;
        this.error = errorMessage;
      }
    );

    form.resetForm();
  }
}
