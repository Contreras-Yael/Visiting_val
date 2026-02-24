import { Component } from '@angular/core';
import { PassService } from 'src/app/services/pass.service';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html'
})
export class ValidatorComponent {
  accessCode: string = '';
  result:any = null;
  errorMessage: string = '';

  constructor(private PassService: PassService) { }

  checkCode(){
    this.errorMessage = '';
    this.result = null;

    this.PassService.validatePass(this.accessCode).subscribe({
      next: (res) => {
        this.result = res;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Error al validar el código.';
      }
    });
  }
  confirmEntry() {
    this.PassService.usePass(this.accessCode).subscribe({
      next: () => {
        alert('Entrada confirmada. pase inválido para futuros usos.');
        this.result = null;
        this.accessCode = '';
      },
    });
  }

}
