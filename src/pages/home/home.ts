import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {SignPage} from "../sign/sign";
import {CookieService} from "angular2-cookie/core";
import {ToolService} from "../../util/tool.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              private cookieService:CookieService,
              private toolService:ToolService
  ) {

  }
  private showGoSign:boolean=false;
  ionViewWillEnter(){
    let ids=this.cookieService.get('ids');
    if(ids==null){

    }
    else{
      this.showGoSign=true;
    }
  }


  goSign(){
    let ids=this.cookieService.get('ids');
    if(ids==null){
      this.toolService.toast('未选择工单，请扫描二维码重试！');
    }
    else{
      this.navCtrl.push(SignPage,{
        ids:ids
      })
    }
  }
}
