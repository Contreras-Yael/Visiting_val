import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PassService } from 'src/app/services/pass.service';
//import {llave} from '..//';
//import { PassService } from './pass.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
  login_data = { email: '', password: '' };

 constructor( private passService: PassService, private router: Router){}

  entrar(){
    this.passService.login(this.login_data).subscribe(res => {
      localStorage.setItem('token', res.token);
      this.router.navigate(['/dashboard']);
    });
  }
}
