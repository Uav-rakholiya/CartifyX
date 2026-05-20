import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule],
    template: `<h2>Login</h2>`
})
export class LoginComponent { }

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule],
    template: `<h2>Register</h2>`
})
export class RegisterComponent { }
