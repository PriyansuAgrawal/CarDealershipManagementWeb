import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appFileSizeValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FileSizeValidatorDirective,
      multi: true
    }
  ]
})
export class FileSizeValidatorDirective implements Validator {
  @Input('appFileSizeValidator') maxSize = 5 * 1024 * 1024; // Default 5MB

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const file = control.value as File;
    const fileSize = file.size;

    return fileSize <= this.maxSize ? null : { fileSize: { actual: fileSize, max: this.maxSize } };
  }
}
