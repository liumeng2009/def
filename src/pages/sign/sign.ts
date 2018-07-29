import { Component,ViewChild,ElementRef } from '@angular/core';
import { NavController,NavParams,ModalController } from 'ionic-angular';
import {Operation} from "../../bean/operation";
import {SignService} from "./sign.service";
import {ToolService} from "../../util/tool.service";
import {DetailPage} from './detail';
import {SignaturePad} from "angular2-signaturepad/signature-pad";
import {CookieService} from "angular2-cookie/core";
import {Client} from '../../bean/client'

@Component({
  selector: 'sign',
  templateUrl: 'sign.html'
})
export class SignPage {

  constructor(public navCtrl: NavController,
              private signService:SignService,
              private toolService:ToolService,
              private navParams:NavParams,
              private modalCtrl:ModalController,
              private cookieService:CookieService
  ) {

  }

  private ops:Operation[]=[];
  ionViewWillEnter(){
    this.initAuth();
    this.initNo();
  }

  private client:Client;
  initAuth(){
    let userAgent=window.navigator.userAgent;
    this.signService.getClientInfo(userAgent).then(
      data=>{
        console.log(data);
        let result=this.toolService.apiResult(data);
        if(result&&result.status==0){
          this.client={...result.data}
          this.cookieService.put('OptUserId',this.client.userId);
        }
        else{
          this.toolService.toast(result.message)
        }
      },
      error=>{
        this.toolService.toast(error)
      }
    )
  }

  getAuth(){
    let userId=this.cookieService.get('OptUserId');
  }

  initNo(){
    let params=this.navParams.data.ids;
    this.cookieService.put('ids',params);
    let ids=params.split(',');
    console.log(ids);
    this.signService.getOperationNos({ids:ids}).then(
      data=>{
        let result=this.toolService.apiResult(data);
        if(result&&result.status==0){
          this.ops=[...result.data];
          setTimeout(()=>{
            this.calSignWH();
          },0)

        }
      },
      error=>{
        this.toolService.toast(error)
      }
    )
  }

  private infoModal;
  modal(id){
    this.infoModal=this.modalCtrl.create(DetailPage,{id:id});
    this.infoModal.present();
  }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  private signaturePadOptions:any = {
    canvasWidth: 500,
    canvasHeight: 300
  }
  @ViewChild('head') head:ElementRef;
  @ViewChild('idList') idList:ElementRef;

  calSignWH(){
    let hAll=window.document.body.clientHeight;
    let wAll=window.document.body.clientWidth;

    let headH=this.head.nativeElement.clientHeight;
    let idListH=this.idList.nativeElement.clientHeight;


    //有些不太稳定，-2
    let h=hAll-headH-idListH-4;

    //this.signaturePadOptions.canvasWidth=wAll;
    //this.signaturePadOptions.canvasHeight=h;

    //console.log(h);
    this.signaturePad.set('canvasWidth',wAll)
    this.signaturePad.set('canvasHeight',h)

    this.signaturePadOptions.canvasWidth=wAll;
    this.signaturePadOptions.canvasHeight=h;

  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL());
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  clear(){
    this.signaturePad.clear();
  }

}
