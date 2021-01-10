import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ModalService {

  constructor(private modalService: NgbModal) { }

  open(content, options) {
    return this.modalService.open(content, options);
  }

}
