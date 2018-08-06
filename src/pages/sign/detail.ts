import {Component} from '@angular/core';
import {NavParams,ViewController} from 'ionic-angular'
import {Operation} from "../../bean/operation";
import {ToolService} from "../../util/tool.service";
import {SignService} from "../sign/sign.service";
import * as moment from 'moment'


@Component({
  templateUrl:'detail.html',
  selector:'detail'
})

export class DetailPage {
  constructor(private navParams:NavParams,
              private signService:SignService,
              private toolService:ToolService,
              private viewCtrl:ViewController) {

  }
  private operation:Operation;
  ionViewWillEnter(){
    let id=this.navParams.get('id');
    this.getData(id).then(()=>{
      this.getActions(id).then(()=>{
        this.formatData();
      }).catch(()=>{})
      console.log(this.operation)
    }).catch(()=>{});
    this.getSign(id).then(()=>{}).catch(()=>{})
  }

  getData(id){
    return new Promise((resolve, reject)=>{
      this.signService.getOperation(id).then(
        data=>{
          let result=this.toolService.apiResult(data);
          if(result&&result.status==0){
            this.operation={...result.data};
            resolve();
          }
          else{
            this.toolService.toast(result.message);
            reject();
          }
        },
        error=>{
          this.toolService.apiException(error)
          reject();
        }
      )
    })
  }

  private sign:string;
  getSign(id){
    return new Promise((resolve, reject)=>{
      this.signService.getSign(id).then(
        data=>{
          console.log(data);
          let result=this.toolService.apiResult(data);
          if(result&&result.status==0){
            this.sign=result.data;
            resolve();
          }
          else{
            this.toolService.toast(data.message)
            reject()
          }
        },
        error=>{
          this.toolService.apiException(error)
          reject()
        }
      )
    })
  }

  getActions(id){
    return new Promise((resolve,reject)=>{
      this.signService.getOperationAction(id).then(
        data=>{
          console.log(data);
          let result=this.toolService.apiResult(data);
          if(result&&result.status==0){
            this.operation.actions=result.data.actions;
            resolve();
          }
          else{
            this.toolService.toast(result.message);
            reject()
          }
        },
        error=>{
          this.toolService.apiException(error)
          reject();
        }
      )
    })
  }

  formatData(){
    if(this.operation.actions){
      for(let action of this.operation.actions){
        moment.locale('zh_cn');
        if(action.call_time){
          action.call_time_date=moment(action.call_time).format();
          action.call_time_date_show=moment(action.call_time).format('MM月DD日 HH时mm分');
        }
        if(action.start_time){
          action.start_time_date=moment(action.start_time).format();
          action.start_time_date_old=action.start_time_date;
          action.start_time_date_show=moment(action.start_time).format('MM月DD日 HH时mm分');
        }
        else{
          action.start_time_date=null
          action.start_time_date_old=null
          action.start_time_date_show='未开始'
        }
        if(action.end_time){
          action.end_time_date=moment(action.end_time).format();
          action.end_time_date_old=action.end_time_date;
          action.end_time_date_show=moment(action.end_time).format('MM月DD日 HH时mm分');
        }
        else{
          action.end_time_date=null
          action.end_time_date_old=null
          action.end_time_date_show='未结束'
        }
      }
    }
  }

  doRefresh(e){
    let id=this.navParams.get('id');
    this.getData(id).then(()=>{
      this.getActions(id).then(()=>{
        this.formatData();
        e.complete();
      }).catch(()=>{
        e.complete()
      })
    }).catch(()=>{
      e.complete()
    });
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}


