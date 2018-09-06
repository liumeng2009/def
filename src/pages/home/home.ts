import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {SignPage} from "../sign/sign";
import {CookieService} from "angular2-cookie/core";
import {ToolService} from "../../util/tool.service";
import {SignService} from "../sign/sign.service";
import {Client} from '../../bean/client';
import {AboutPage} from "../about/about";
import {Title} from "@angular/platform-browser";
import {WorkerPage} from "../worker/worker";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              private cookieService:CookieService,
              private toolService:ToolService,
              private navParams:NavParams,
              private signService:SignService,
              private title:Title
  ) {

  }
  private showGoSign:boolean=false;
  ionViewWillEnter(){
    this.title.setTitle('一些小程序');
    let ids=this.cookieService.get('ids');
    let signid=this.cookieService.get('signid');
    if(ids==null||signid==null){

    }
    else{
      this.showGoSign=true;
    }
    this.initAuth();
  }


  goSign(){
    let ids=this.cookieService.get('ids');
    let signid=this.cookieService.get('signid');
    if(ids==null){
      this.toolService.toast('未选择工单，请扫描二维码重试！');
    }
    else{
      this.navCtrl.push(SignPage,{
        signid:signid,
        ids:ids
      })
    }
  }

  private client:Client;
  private signComplete:boolean=false;
  initAuth(){
    let signid=this.cookieService.get('signid');
    if(signid==null){
      return;
    }
    this.signService.getClientInfo(signid).then(
      data=>{
        let result=this.toolService.apiResult(data);
        if(result){
          this.client={...result.data}
          if(this.client.status==1){
            this.calTime();
          }
          else if(this.client.status==2){
            this.signComplete=true;
          }
          else{

          }

        }
      },
      error=>{
        this.toolService.apiException(error)
      }
    )
  }

  private loop;
  calTime(){
    let date=new Date();
    let time=date.getTime()-this.client.start;
    console.log(time);
    let seconds=Math.ceil(time/1000);
    this.client.clientSeconds=(this.client.clientSeconds-seconds)>0?(this.client.clientSeconds-seconds):0;
    this.loop=setInterval(()=>{
      if(this.client.clientSeconds>0){
        this.client.clientSeconds--;
      }
      else{
        clearInterval(this.loop);
      }
    },1000)
  }

  ionViewWillLeave(){
    clearInterval(this.loop)
  }

  private aboutPage=AboutPage
  private workerPage=WorkerPage


}
