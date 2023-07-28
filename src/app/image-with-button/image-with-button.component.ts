import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-image-with-button',
  templateUrl: './image-with-button.component.html',
  styleUrls: ['./image-with-button.component.css']
})
export class ImageWithButtonComponent implements OnInit {

  @Input() imageUrl: string;
  @Output() deleteImage = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onDeleteImage() {
    // Call this method when the delete button is clicked
    this.deleteImage.emit();
  }
}