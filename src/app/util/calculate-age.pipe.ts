import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'calculateAge'
})
export class CalculateAgePipe implements PipeTransform {
    transform(value): any {
        if (value === undefined || value === null) {
            return '';
        } else {
            const date1 = moment(value);
            const date2 = moment();
            return date2.diff(date1, 'years');
        }

    }

}
