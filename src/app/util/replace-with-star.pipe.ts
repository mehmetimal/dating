import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'replaceWithStar'
})
export class ReplaceWithStarPipe implements PipeTransform {
    transform(value: string): any {
        if (value === undefined || value === null) {
            return '';
        } else {
            let l = value.length;
            if (l < 5) {
                l = 5;
            }
            return value.substring(0, 2) + '*'.repeat(l - 2);
        }

    }

}
