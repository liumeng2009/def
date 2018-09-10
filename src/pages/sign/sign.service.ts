import {Injectable} from '@angular/core';
import {Http,Response,Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {ResponseData} from "../../bean/responseData";
import {Config} from "../../config/config";

@Injectable()
export class SignService{
  constructor(private http:Http){}
  private headers = new Headers({'Content-Type': 'application/json'});
  private getoperationurl=new Config().serverPath+'/api/operation'
  private getoperationnourl=new Config().serverPath+'/api/operation/no_list'
  private operationDetailActionUrl=new Config().serverPath+'/api/operation/getaction/'
  private clientSignUrl=new Config().serverPath+'/api/sign/clientSign'
  private saveUrl=new Config().serverPath+'/api/sign/clientsave'
  private getSignUrl=new Config().serverPath+'/api/sign/'

  getOperation(id):Promise<ResponseData>{
    return this.http.get(this.getoperationurl+'/'+id,{headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  getSign(opid): Promise<ResponseData> {
    return this.http.get(this.getSignUrl+opid,{headers:this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  getOperationAction(id:string): Promise<ResponseData> {
    return this.http.get(this.operationDetailActionUrl +id)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  getOperationNos(ids:any):Promise<ResponseData>{
    return this.http.post(this.getoperationnourl,ids,{headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  getClientInfo(signid:string):Promise<ResponseData>{
    return this.http.post(this.clientSignUrl,{signid:signid},{headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  saveSigns(ids:string[],sign:string,signid:string,clientInfo:string):Promise<ResponseData>{
    return this.http.post(this.saveUrl,{signid:signid,sign:sign,ids:ids,clientinfo:clientInfo},{headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  private extractData(res:Response){
    let body=res.json();
    //console.log(JSON.stringify(body));
    return body||{};
  }
  private handleError(error:Response|any){
    let errMsg:string;
    if(error instanceof Response){
      const body=error.json()||'';
      const err=body.err||JSON.stringify(body);
      errMsg=`${error.status} - ${error.statusText||''} ${err}`
    }
    else{
      errMsg=error.message?error.message:error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }
}
