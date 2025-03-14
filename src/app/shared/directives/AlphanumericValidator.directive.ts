import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appAlphanumericValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: AlphanumericValidatorDirective,
      multi: true
    }
  ]
})
export class AlphanumericValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const valid = /^[a-zA-Z0-9]*$/.test(control.value);
    return valid ? null : { alphanumeric: { value: control.value } };
  }
}
