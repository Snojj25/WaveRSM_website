import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverable]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HoverableDirective {
  private elRef: ElementRef;

  constructor(elRef: ElementRef, private renderer: Renderer2) {
    this.elRef = elRef;
  }

  @Input('styles') styles: string[];

  onMouseEnter() {
    this.renderer.setStyle(this.elRef.nativeElement, 'cursor', 'pointer');
    if (this.styles) {
      for (let i = 0; i < this.styles.length; i++) {
        const element = this.styles[i];
        this.renderer.addClass(this.elRef.nativeElement, element);
      }
    }
  }

  onMouseLeave() {
    this.renderer.setStyle(this.elRef.nativeElement, "cursor", "defult")
    if (this.styles) {
      for (let i = 0; i < this.styles.length; i++) {
        const element = this.styles[i];
        this.renderer.removeClass(this.elRef.nativeElement, element);
      }
    }
  }
}
