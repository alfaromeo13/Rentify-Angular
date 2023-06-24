import { EventEmitter } from "@angular/core";
import { Output } from "@angular/core";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { saveAs } from 'file-saver' ;
import { TestService } from "./test.component.service";

@Component({
  selector:'app-test',
  templateUrl:'test.component.html',
  styleUrls:['test.component.css'],
})
export class TestComponent implements OnInit {

  documentUploadForm?: FormGroup;
  documents: any[] = [];

  @ViewChild('fileName') fileNameSpanElement!: ElementRef;

  constructor(private testService: TestService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.preview();
  }

  onFileSelected(element: any): void {
    console.log(element);
    const files = element.target.files;
    if (files) {
      const file = files[0]; //
      this.documentUploadForm?.get('file')?.setValue(file);
      this.fileNameSpanElement.nativeElement.innerText = file?.name || 'File is not selected...';
    }
  }

  upload() {
    let formData = new FormData();
    formData.append('file', this.documentUploadForm?.get('file')!.value);

    this.testService.upload(formData).subscribe(response => {
      const httpStatus = response.status;
      // const body = response.body;

      if (httpStatus === 204) {
        console.log('SUCCESS!');
      }
    });
  }

  download(id: number) {
    this.testService.download(id).subscribe(response => {
      const body = response.body; // byte[] (JAVA)
      const headers = response.headers;

      const fileName = headers.get('FILE-NAME');
      const blob = new Blob([body]);
      saveAs(blob, fileName);
    });
  }

  private initializeForm(): void {
    this.documentUploadForm = new UntypedFormGroup({
      file: new UntypedFormControl(null)
    });
  }

  private preview(): void {
    this.testService.getAll().subscribe(data => {
      this.documents = data;
    });
  }
}