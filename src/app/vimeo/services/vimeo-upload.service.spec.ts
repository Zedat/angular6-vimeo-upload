import { TestBed, inject } from '@angular/core/testing';

import { VimeoUploadService } from './vimeo-upload.service';

describe('VimeoUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VimeoUploadService]
    });
  });

  it('should be created', inject([VimeoUploadService], (service: VimeoUploadService) => {
    expect(service).toBeTruthy();
  }));
});
