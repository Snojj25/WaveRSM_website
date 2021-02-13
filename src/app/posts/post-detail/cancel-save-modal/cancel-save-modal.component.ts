import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cancel-save-modal',
  templateUrl: './cancel-save-modal.component.html',
  styleUrls: ['./cancel-save-modal.component.scss']
})
export class CancelSaveModalComponent {

  @Output() editting = new EventEmitter<boolean>();
  @Output() updatePost = new EventEmitter<boolean>();

  constructor(private modal: NgbModal, private activeModal: NgbActiveModal) {}

  openModal(content) {
    this.modal.open(content);
  }

  saveModal() {
    this.updatePost.next(true);
  }

  dissmissModal() {
    console.log('dissmiss Modal');
    this.activeModal.dismiss();
  }

  stopEditting() {
    this.editting.next(false);
  }

}
