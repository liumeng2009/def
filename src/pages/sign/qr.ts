import {Component} from '@angular/core';
import {NavParams,ViewController} from 'ionic-angular'
import {Operation} from "../../bean/operation";
import {ToolService} from "../../util/tool.service";
import {SignService} from "../sign/sign.service";


@Component({
  templateUrl:'qr.html',
  selector:'qr'
})

export class QrPage {
  constructor(private navParams:NavParams,
              private signService:SignService,
              private toolService:ToolService,
              private viewCtrl:ViewController) {

  }

  private steam;
  ionViewWillEnter() {
    let t=this;
    var video = document.getElementById("video"), canvas, context;

    try {

      canvas = document.createElement("canvas");

      canvas.width = 600;

      canvas.height = 600;

      context = canvas.getContext("2d");

    } catch (e) {
      alert("not support canvas!");
      return;
    }

    navigator.getUserMedia = navigator.getUserMedia

    if (navigator.getUserMedia)

      navigator.getUserMedia(
        {"video": true},

        function (stream) {

/*          if (video.mozSrcObject !== undefined)video.mozSrcObject = stream;

          else video.src = ((window.URL || window.webkitURL || window.mozURL || window.msURL) && window.URL.createObjectURL(stream)) || stream;

          video.play();*/

          t.steam=stream;

        },

        function (error) {
          alert(error.name)
          alert(error.message)


          alert("请检查是否开启摄像头");

          let flag = false;

        }
      );

    else alert("Native device media streaming (getUserMedia) not supported in this browser");


  }






}


