import {Injectable} from '@angular/core';
import {ToastController,Events} from "ionic-angular/index";
import {ResponseData} from "../bean/responseData";

@Injectable()
export class ToolService{
  constructor(
    public toastCtrl:ToastController,
    public events:Events
  ){}

  apiResult(data:ResponseData){
    if(data.status==10003||data.status==10001){
      this.toast(data.message+'即将跳转到登录页面！');
      this.events.publish('user:logout');
    }
    else if(data.status==0){
      return data;
    }
    else{
      this.toast(data.message)
    }
  }

  apiException(error:any){
    if(error=='0 -  {"isTrusted":true}'){
      this.toast('网络错误，请重新尝试操作！')
    }
    else{
      this.toast(error);
    }
  }

  toast(msg){
    const toast = this.toastCtrl.create({
      message:msg,
      duration: 3000,
      position:'bottom',
      showCloseButton: true,
      closeButtonText: '关闭'
    });
    toast.present();
  }

}
