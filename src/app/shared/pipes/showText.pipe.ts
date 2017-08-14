import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'showText'})
export class ShowTextPipe implements PipeTransform {
    transform(value, show) {
        if (show) {
            return value;
        }
        return '';
    }
}