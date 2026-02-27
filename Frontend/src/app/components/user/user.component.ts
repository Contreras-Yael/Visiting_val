import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
//import { PassService } from 'src/app/services/pass.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  //styleUrls: ['./user.component.scss']
})

export class UserComponent {
  login_data = { email: '', password: '' };
  usuario: string = '';
  clave: string = '';

 constructor( private http: HttpClient, private router: Router){}

  entrar(){
    const datos = {email: this.usuario, password: this.clave};

    this.http.post('http://localhost:3000/api/login', datos).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en el login', err);
      }
    });
  }
}
