import {Component} from '@angular/core'
import {Title} from "@angular/platform-browser";

@Component({
  selector:'about-page',
  templateUrl:'about.html'
})

export class AboutPage{
  constructor(
    private title:Title
  ){
    this.title.setTitle('关于我们')
  }
}
