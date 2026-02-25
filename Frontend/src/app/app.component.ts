import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //title = 'Frontend';
  isToggled=false;

  toggleSidebar(){
    const wrapper = document.getElementById('wrapper');
    if(wrapper) {
      wrapper.classList.toggle('toggled');
      this.isToggled = wrapper.classList.contains('toggled');
    }
  }

}
