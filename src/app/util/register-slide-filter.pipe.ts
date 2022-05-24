import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'registerSlide'
})
export class RegisterSlideFilterPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        return items.filter(item => item.screenType === filter);
    }
}
