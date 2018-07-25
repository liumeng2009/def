import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpModule} from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {SignPage} from "../pages/sign/sign";
import {ToolService} from "../util/tool.service";
import {SignService} from "../pages/sign/sign.service";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{},{
      links:[
        {component:SignPage,name:'TabsPage',segment:'sign/:ids'}
      ]
    }),




  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SignService,
    ToolService
  ]
})
export class AppModule {}
