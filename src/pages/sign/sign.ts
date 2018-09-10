import { Component,ViewChild,ElementRef } from '@angular/core';
import { NavController,NavParams,ModalController } from 'ionic-angular';
import {Operation} from "../../bean/operation";
import {SignService} from "./sign.service";
import {ToolService} from "../../util/tool.service";
import {DetailPage} from './detail';
import {SignaturePad} from "angular2-signaturepad/signature-pad";
import {CookieService} from "angular2-cookie/core";
import {Client} from '../../bean/client'
import * as moment from 'moment'
import {Title} from "@angular/platform-browser";

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
              private cookieService:CookieService,
              private title:Title
  ) {

  }

  private ops:Operation[]=[];
  ionViewWillEnter(){
    this.title.setTitle('签名');
    this.initAuth();
    this.initNo();
  }

  private client:Client;
  private signComplete:boolean=false;
  initAuth(){
    let signid=this.navParams.data.signid;
    this.signService.getClientInfo(signid).then(
      data=>{
        console.log(data);
        let result=this.toolService.apiResult(data);
        if(result){
          this.client={...result.data}
          if(this.client.status==1){
            this.calTime();
          }
          else if(this.client.status==2){
            //签名完毕
            this.signComplete=true;
            setTimeout(()=>{
              this.signaturePad.fromDataURL(this.client.signString,{width:this.signaturePadOptions.canvasWidth,height:this.signaturePadOptions.canvasHeight});
              if(this.client.ops){
                let opArray=this.client.ops.split(',');
                for(let opa of opArray){
                  for(let o of this.ops){
                    if(opa==o.id){
                      o.done=true;
                    }
                  }
                }
              }
            },100)
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

  calTime(){
    let date=new Date();
    let time=date.getTime()-this.client.start;
    console.log(time);
    let seconds=Math.ceil(time/1000);
    this.client.clientSeconds=(this.client.clientSeconds-seconds)>0?(this.client.clientSeconds-seconds):0;
    let loop=setInterval(()=>{
      if(this.client.clientSeconds>0){
        this.client.clientSeconds--;
      }
      else{
        clearInterval(loop);
      }
    },1000)
  }

  initNo(){
    let params=this.navParams.data.ids;
    let signid=this.navParams.data.signid;

    moment.locale('zh_cn');
    let addDate=moment().add(4,'h').toDate();

    this.cookieService.put('ids',params,{expires:addDate });
    this.cookieService.put('signid',signid,{expires:addDate });
    let ids=params.split(',');
    console.log(ids);
    this.signService.getOperationNos({ids:ids}).then(
      data=>{
        let result=this.toolService.apiResult(data);
        if(result){
          this.ops=[...result.data];
          setTimeout(()=>{
            this.calSignWH();
          },0)
        }
      },
      error=>{
        this.toolService.apiException(error)
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
  @ViewChild('foot') foot:ElementRef;
  calSignWH(){
    let hAll=window.document.body.clientHeight;
    let wAll=window.document.body.clientWidth;

    let headH=this.head.nativeElement.clientHeight;
    let footH=this.foot.nativeElement.clientHeight;

    //有些不太稳定，-2
    let h=hAll-headH-footH;

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
    //console.log(this.signaturePad.toDataURL());
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    //console.log('begin drawing');
  }

  clear(){
    this.signaturePad.clear();
  }

  save(){
    if(!this.signaturePad.isEmpty()){
      let params=this.navParams.data.ids;
      let signid=this.navParams.data.signid;
      let ids=params.split(',');
      let clientinfo=navigator.userAgent;
      console.log(clientinfo);
      this.signService.saveSigns(ids,this.signaturePad.toDataURL(),signid,clientinfo).then(
        data=>{
          let result=this.toolService.apiResult(data);
          if(result&&result.status==0){
            this.signComplete=true;
            if(result.data instanceof Array){
              for(let signResult of result.data){
                for(let op of this.ops){
                  if(op.id==signResult.operationId){
                    op.done=true;
                  }
                }
              }
            }
          }
        },
        error=>{
          this.toolService.apiException(error)
        }
      )
    }
    else{
      this.toolService.toast('签名内容不能为空！')
    }

  }
}
