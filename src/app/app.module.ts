import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpModule} from '@angular/http';

import { SignaturePadModule } from 'angular2-signaturepad';
import {CookieService} from 'angular2-cookie/core'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {SignPage} from "../pages/sign/sign";
import {DetailPage} from "../pages/sign/detail";
import {ToolService} from "../util/tool.service";
import {SignService} from "../pages/sign/sign.service";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignPage,
    DetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{},{
      links:[
        {component:HomePage,name:'HomePage',segment:'home'},
        {component:SignPage,name:'TabsPage',segment:'sign/:signid/:ids',defaultHistory:[HomePage]}
      ]
    }),
    SignaturePadModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignPage,
    DetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SignService,
    ToolService,
    CookieService
  ]
})
export class AppModule {}
