import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient) {}
  //title = 'Frontend';
  isToggled=false;

  //auth_token = "123456789"; // Reemplaza con tu token real

  toggleSidebar(){
    const wrapper = document.getElementById('wrapper');
    if(wrapper) {
      wrapper.classList.toggle('toggled');
      this.isToggled = wrapper.classList.contains('toggled');
    }
  }
// Método para probar el interceptor
  getuser() {
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${this.auth_token}`,
    //   'Content-Type': 'application/json'
    // });
    //,{ headers: headers }
    this.http.get('http://localhost:3000/api/user').subscribe((res: any) => {
      console.log(res);
    });
  }
}
