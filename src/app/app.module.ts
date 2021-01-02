import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { environment } from 'src/environments/environment';

import { PostDetailComponent } from './posts/post-detail/post-detail.component';
import { MainCarouselComponent } from './home/main-carousel/main-carousel.component';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PostsComponent } from './posts/posts.component';
import { NewFilterComponent } from './posts/new-filter/new-filter.component';
import { TradesComponent } from './trades/trades.component';
import { HomeScreenComponent } from './home/home-screen/home-screen.component';
import { HoverableDirective } from './hoverable.directive';
import { FooterComponent } from './shared/footer/footer.component';
import { TradeStatsComponent } from './trades/trade-stats/trade-stats.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainCarouselComponent,
    LoginComponent,
    RegisterComponent,
    PostsComponent,
    PostDetailComponent,
    NewFilterComponent,
    TradesComponent,
    HomeScreenComponent,
    HoverableDirective,
    FooterComponent,
    TradeStatsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    NgxChartsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
