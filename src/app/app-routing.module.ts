import { HomeComponent } from './components/home/home.component';
import { ProjectorComponent } from './components/projector/projector.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: "full"
    },
    {
        path: 'projector',
        component: ProjectorComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
