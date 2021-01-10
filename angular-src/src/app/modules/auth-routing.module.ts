import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';

const routes: Route[] = [
    {path:'', component: LoginComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { };