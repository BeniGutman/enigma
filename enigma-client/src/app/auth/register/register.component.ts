import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  isLoading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const userName = form.value.userName;
    const password = form.value.password;

    this.isLoading = true;

    this.authService.register(email, userName, password).subscribe(
      //Handle response data
      (resData) => {
        console.log('resData:', resData);
        this.isLoading = false;
        this.error = '';
        this.router.navigate(['auth/login']);
      },
      //Handle response error
      (errorMessage) => {
        console.log('errorMessage:', errorMessage);
        this.isLoading = false;
        this.error = errorMessage;
      }
    );

    form.resetForm();
  }
}
