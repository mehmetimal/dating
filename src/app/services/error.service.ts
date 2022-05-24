import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    constructor() {
    }

    validateBackendErrors(form: FormGroup, error: any) {
        const errors: any[] = error.error.errors;
        errors.forEach(value => {
            if (value.msg === 'required') {
                form.controls[value.param].setErrors({required: true});
                form.controls[value.param].markAsDirty();
            } else if (value.msg === 'email') {
                form.controls[value.param].setErrors({email: true});
                form.controls[value.param].markAsDirty();
            } else if(value.msg === 'maxlength') {
                form.controls[value.param].setErrors({maxlength: true});
                form.controls[value.param].markAsDirty();
            } else if (value.msg === 'birthday') {
                form.controls['day'].setErrors({'incorrect': true});
                form.controls['month'].setErrors({'incorrect': true});
                form.controls['year'].setErrors({'incorrect': true});
                form.controls['day'].markAsDirty();
                form.controls['month'].markAsDirty();
                form.controls['year'].markAsDirty();
            }
        });
    }
}
