import { AbstractControl, ValidatorFn} from '@angular/forms';

export function textValidatorFactory(): ValidatorFn {
    return (c: AbstractControl) => {
        let valid = /([A-Za-z]){3,}/gi.test(c.value);
        if (valid) {
            return null;
        }
        return {
            invalidText: true
        };
    };
}
