import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ApartmentService } from '../apartment/apartment.service';
import { AuthService } from '../auth/services/auth.service';
import { RoomShowcaseModel } from '../models/roomshowcase';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  @Input()
  public soba: RoomShowcaseModel = new RoomShowcaseModel(0, "", "", "", "", .2, "", .1, true);

  ngOnInit(): void {
    this.soba.imgLinks.forEach((baseContent: string) => {
      this.soba.imagePreviews.push(
        this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image;base64, ${baseContent}`));
    });
  }

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private domSanitizer: DomSanitizer,
    private apartmentService: ApartmentService,
  ) { }

  setSelected(pid: number) {
    this.apartmentService.setSelected(pid);
  }

  public toggle_like(): void { //we can like each card
    if (this.authService.isAuthenticated.getValue()) {
      if (this.soba.liked)
        this.apartmentService.deleteFavorite(this.soba.pid).subscribe(data => {
          console.log("UDJE! :D");
        }, error => {
          console.log(error);
        });
      else this.apartmentService.addFavorite(this.soba.pid).subscribe(data => {
        console.log("UDJE! :D");
      }, error => {
        console.log(error);
      });
      this.soba.liked = !this.soba.liked;
    } else this.toastr.info("Please log in to like selected " + this.soba.property);
  }
}