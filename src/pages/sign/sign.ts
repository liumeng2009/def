import { Component } from '@angular/core';
import {Location} from '@angular/common'
import { NavController,NavParams } from 'ionic-angular';
import {Operation} from "../../bean/operation";
import {SignService} from "./sign.service";
import {ToolService} from "../../util/tool.service";

@Component({
  selector: 'sign',
  templateUrl: 'sign.html'
})
export class SignPage {

  constructor(public navCtrl: NavController,
              private location:Location,
              private signService:SignService,
              private toolService:ToolService,
              private navParams:NavParams
  ) {

  }

  private ops:Operation[]=[];
  ionViewWillEnter(){
    this.initNo();
  }

  initNo(){
    let params=this.navParams.data.ids;
    let ids=params.split(',');
    console.log(ids);
    this.signService.getOperationNos({ids:ids}).then(
      data=>{
        let result=this.toolService.apiResult(data);
        if(result&&result.status==0){
          this.ops=[...result.data];
          console.log(this.ops);
        }
      },
      error=>{
        this.toolService.toast(error)
      }
    )
  }

}
