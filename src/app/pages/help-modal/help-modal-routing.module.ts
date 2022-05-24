import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {HelpModalComponent} from './help-modal.component';

const routes: Routes = [
    {path: '', component: HelpModalComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HelpModalRoutingModule {
}
