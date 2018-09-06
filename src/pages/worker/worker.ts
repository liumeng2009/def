import {Component} from '@angular/core'
import {Title} from "@angular/platform-browser";
import {WorkerService} from "./worker.service";
import {ToolService} from "../../util/tool.service";
import * as moment from 'moment'
import {Worker} from '../../bean/worker'

@Component({
  selector:'worker-page',
  templateUrl:'worker.html'
})

export class WorkerPage{
  constructor(
    private title:Title,
    private workerService:WorkerService,
    private toolService:ToolService
  ){
    this.title.setTitle('工程师的状态');
  }

  private workers:Worker[]=[];
  ionViewWillEnter(){
    let stamp=moment().valueOf();
    this.workerService.getDoingWhere(stamp).then(
      data=>{
        let result=this.toolService.apiResult(data)
        if(result){
          console.log(result);
          this.workers=[...result.data]
          console.log(this.workers);
        }
      },
      error=>{
        this.toolService.apiException(error)
      }
    )
  }
  doRefresh(e){
    let stamp=moment().valueOf();
    this.workerService.getDoingWhere(stamp).then(
      data=>{
        e.complete()
        let result=this.toolService.apiResult(data)
        if(result){
          console.log(result);
          this.workers=[...result.data]
          console.log(this.workers);
        }
      },
      error=>{
        e.complete()
        this.toolService.apiException(error)
      }
    )
  }

}
