import { Directive, forwardRef } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';

// factory function
import { textValidatorFactory } from '../validators/text.validator';

@Directive({
    selector: '[validateText][ngModel], [validateText][formControl], [validateText][formControlName]',
    providers: [{
        provide: NG_VALIDATORS, useExisting: forwardRef( () => TextValidator), multi: true
    }]
})
export class TextValidator implements Validator {
    constructor() {
    }

    validate(c: AbstractControl) {
        let valid = /^[a-z]+$/i.test(c.value);
        console.log("valid: ", valid);
        if (valid) {
            return null;
        }
        return {
            invalidText: true
        };
    }
}