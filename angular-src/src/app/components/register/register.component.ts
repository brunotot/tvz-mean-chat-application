import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  errorMessage: string = null;
  signupForm: FormGroup;
  errorEmitter: Subject<string> = new Subject<string>();

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, Validators.minLength(5)]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(5)]),
      'confirmPassword': new FormControl(null, [Validators.required, Validators.minLength(5)]),
      'firstName': new FormControl(null, [Validators.required]),
      'lastName': new FormControl(null, [Validators.required])
    }, this.passwordsMatchValidator);
    this.errorEmitter.subscribe((error: string) => this.errorMessage = error);
  }

  private passwordsMatchValidator(form: FormGroup) {
    if (form.get('password') && form.get('confirmPassword')) {
      return form.get('password').value === form.get('confirmPassword').value ? null : { 
        mismatch: true 
      };
    }
    return null;
  }

  onRegister() {
    let newUser = this.signupForm.value;
    delete newUser["confirmPassword"];
    this.userService.register(newUser).subscribe(
      (res: any) => this.router.navigate(['/login']),
      (error) => this.errorEmitter.next(error.error.message)
    );
  }

}
