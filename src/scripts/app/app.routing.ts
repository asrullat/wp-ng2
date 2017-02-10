import {RouterModule, Routes} from '@angular/router';

import {TestComponent} from './test/test.component';

const routes: Routes = [
    {path: 'test', component: TestComponent},
    {path: '', redirectTo: '/test', pathMatch: 'full'},
];

export const routing = RouterModule.forRoot(routes);
