import { Component} from '@angular/core';
import { PassService } from 'src/app/services/pass.service';
@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
})
export class GeneratorComponent{
  guestName: string = '';
  generatedCode: string = '';
  loading: boolean = false;

  constructor(private passService: PassService) { }

  onGenerate() {
    if (!this.guestName)
      return alert('Pon un nombre.');

      this.loading = true;
      this.passService.createPass(this.guestName, 'Host_Admin').subscribe({
        next: (res) => {
          this.generatedCode = res.pass.accessCode;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });

    }
  }
