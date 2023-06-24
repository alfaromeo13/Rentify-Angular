import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isActive:boolean=false;
  showParagraph :boolean=false;
  title: string = 'rentify-frontend';

  handleClick():void {
    this.isActive=!this.isActive;
    this.showParagraph=!this.showParagraph;
    console.log('Clicked!')
  }
}