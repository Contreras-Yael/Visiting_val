import { Component, OnInit } from '@angular/core';
//import {llave} from '..//';
//import { PassService } from './pass.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
  login_sess: string= '';
  errorMessage: string = '';

 //constructor() { }

 ngOnInit(): void {
   this.authService.login(this.login_sess).subscribe({
     next: (res) => {
       console.log('Login exitoso:', res);
     },
     error: (err) => {
       this.errorMessage = err.error.message || 'Error al iniciar sesión.';
       console.error('Error de login:', err);
     }
   });
 }

}


