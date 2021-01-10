import { Component, ElementRef, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-open-image-modal',
  templateUrl: './open-image-modal.component.html',
  styleUrls: ['./open-image-modal.component.css']
})
export class OpenImageModalComponent implements OnInit {

  imageBlobUrl: string;
  @ViewChild('content') content: ElementRef;
  ref: any;

  constructor(public domSanitizer: DomSanitizer) { }

  @Output() open = new EventEmitter<string>();

  ngOnInit(): void {
  }
  
}
