import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from './prikaz-slike.service';

@Component({
  selector: 'app-prikaz-slike',
  templateUrl: './prikaz-slike.component.html',
  styleUrls: ['./prikaz-slike.component.css']
})
export class PrikazSlikeComponent implements OnInit {

  imagePreview : any;

  constructor(
      private domSanitizer : DomSanitizer,
      private imageService : ImageService,  
  ) { }

  ngOnInit(): void {
    //1. salji zahtjev za sliku pr3eko servisa konzumiramo onaj api i dobnijamno value
    //2.prociytamo value i pozovemo

    this.imageService.getImagePreview().subscribe(response => {
      //ove 2 vrojednosti citamo iz servisa sto dobijemo
      const imageType = response.type; 
      const imageValue = response.value;
      this.imagePreview = this.domSanitizer
        .bypassSecurityTrustResourceUrl(`data:${imageType};base64, ${imageValue}`);
    });
  }
}
