import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GeneratorComponent } from './components/generator/generator.component';
import { ValidatorComponent } from './components/validator/validator.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'user', component: UserComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'generator', component: GeneratorComponent },
  { path: 'validator', component: ValidatorComponent },
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' }
  //{ path 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
