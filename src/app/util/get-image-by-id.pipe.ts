import {Pipe, PipeTransform} from '@angular/core';
import {map} from 'rxjs/operators';
import {ImageService} from '../services/image.service';

@Pipe({
    name: 'getImageById',
    pure: true
})
export class GetImageByIdPipe implements PipeTransform {
    constructor(public imageService: ImageService) {
    }

    transform(value: string, isBlur?: boolean): any {
        return this.getMemberShipLevel(value, isBlur);
    }

    getMemberShipLevel(id, isBlur) {
        return this.imageService.findById(id, isBlur).pipe(map((res: any) => {
            if (isBlur) {
                if (res && res.body) {
                    return res.body.imageBlurURL;
                }
            } else {
                if (res && res.body) {
                    return res.body.imageURL;
                }
            }
        }));
    }
}
