import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {VimeoUploadService} from './services/vimeo-upload.service';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-vimeo',
  templateUrl: './vimeo.component.html',
  styleUrls: ['./vimeo.component.scss']
})
export class VimeoComponent implements OnInit {

  public vimeoUploadForm: FormGroup;

  private data: any;
  public uploadPercent;
  // Track upload status by tracking code
  // 0 - Not started
  // 1 - File chosen
  // 2 - Wrong file type
  // 3 - Uploading
  // 4 - Upload error
  // 5 - Upload complete
  public uploadStatus: Number = 0;

  constructor(private uploadControl: VimeoUploadService ) { }

  selectFile(event): void {
    this.uploadVimeoVideo(event.target.files);
  }

  uploadVimeoVideo(files: FileList): void {
    this.uploadStatus = 1;
    if (files.length === 0) {
      console.log('No file selected!');
      return;
    }
    const file: File = files[0];
    const isAccepted = this.checkAllowedType(file.type);
    if (isAccepted) {
      this.uploadStatus = 1;
      const options = {
        token : this.getFormValue('vimeoAPI'),
        url : 'https://api.vimeo.com/me/videos',
        videoName: this.getFormValue('vimeoVideoName'),
        videoDescription: this.getFormValue('vimeoVideoDescription')
      };
      this.uploadControl.createVimeo(options, file.size)
        .pipe(
          map(data => this.data = data),
          switchMap(
            () => {
              this.uploadControl.updateVimeoLink(this.data.link);
              if (this.data.upload.size === file.size) {
                return this.uploadControl.vimeoUpload(this.data.upload.upload_link, file);
              } else {
                this.uploadStatus = 4;
              }
            }
          )
        ).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadPercent = Math.round(100 * event.loaded / event.total);
            this.uploadStatus = 3;
          } else if (event instanceof HttpResponse) {
            this.uploadStatus = 5;
            setTimeout(() => {
              this.uploadStatus = 0;
            }, 5000);
          }
        },
        (error) => {
          console.log('Upload Error:', error);
          this.uploadStatus = 4;
        }, () => {
          console.log('Upload done');
        }
      );
    } else {
      this.uploadStatus = 2;
    }
  }

  initVimeoForm() {
    this.vimeoUploadForm = new FormGroup(
      {
        vimeoAPI: new FormControl('', [Validators.required]),
        vimeoVideoName: new FormControl('', [Validators.required]),
        vimeoVideoDescription: new FormControl('', [Validators.required])
      }
    );
  }

  // HELPERS
  allowUpload(): void {
    this.uploadStatus = 0;
  }

  checkAllowedType(filetype: string): boolean {
    const allowed = ['mov', 'wmv', 'avi', 'flv', 'mp4'];
    const videoType = filetype.split('/').pop();
    return allowed.includes(videoType);
  }

  getFormValue(selector: string) {
    return this.vimeoUploadForm.get(selector).value;
  }

  ngOnInit() {
    // Init Vimeo Data Form
    this.initVimeoForm();
    // Return Vimeo Link from API response
    this.uploadControl.vimeoLinkObs.subscribe(
      data => {
        console.log(data);
      }, error => {
        throw new Error(error);
      }
    );
  }

}
