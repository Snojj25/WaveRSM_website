import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { auth } from 'firebase';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeScreenComponent } from './home/home-screen/home-screen.component';
import { MainCarouselComponent } from './home/main-carousel/main-carousel.component';
import { PostDetailComponent } from './posts/post-detail/post-detail.component';
import { PostsComponent } from './posts/posts.component';
import { TradeStatsComponent } from './trades/trade-stats/trade-stats.component';
import { TradesComponent } from './trades/trades.component';
import { CanReadGuard } from './guards/can-read.guard'

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeScreenComponent },
  { path: 'main-carousel', component: MainCarouselComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'post-detail', component: PostDetailComponent, canActivate: [CanReadGuard] },
  { path: 'trades', component: TradesComponent },
  { path: 'trade-stats', component: TradeStatsComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
