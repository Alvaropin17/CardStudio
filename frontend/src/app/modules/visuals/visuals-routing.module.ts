import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { InstructionsComponent } from './instructions/instructions.component';

const routes: Routes = [
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'instructions',
        component: InstructionsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VisualsRoutingModule { }