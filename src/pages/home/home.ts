import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {SignPage} from "../sign/sign";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  goSign(){
    this.navCtrl.push(SignPage)
  }
}
