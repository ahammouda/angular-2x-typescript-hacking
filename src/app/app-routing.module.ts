import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { D3SampleComponent } from './d3-sample/d3-sample.component';
import { D3SimComponent } from './d3-sim/d3-sim.component';
import { D3DrawComponent } from './d3-draw/d3-draw.component';
// import { D3FramesComponent } from './d3-frames/d3-frames.component';


const routes: Routes = [
  { path: '', redirectTo: '/d3-draw', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'd3-examples', component: D3SampleComponent },
  { path: 'd3-sim',  component: D3SimComponent },
  { path: 'd3-draw', component: D3DrawComponent },
  // { path: 'd3-frames', component: D3FramesComponent }
];

@NgModule({
  // Why does this ordering change whether this all works or not?
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule { }
