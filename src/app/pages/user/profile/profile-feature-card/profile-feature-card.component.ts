import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {UserFeatureService} from '../../../../services/user-feature.service';

@Component({
    selector: 'app-profile-feature-card',
    templateUrl: './profile-feature-card.component.html',
    styleUrls: ['./profile-feature-card.component.scss']
})
export class ProfileFeatureCardComponent implements OnInit, OnChanges {
    @Input() features;
    @Input() featureOptions;
    public notEditable = true;
    public aboutEdit = false;

    constructor(public userService: UserService, private userFeatureService: UserFeatureService,) {
    }

    ngOnInit() {
        console.log(this.features);
    }

    aboutEditable() {
        if (this.notEditable) {
            this.notEditable = false;
            if (!this.aboutEdit) {
                this.aboutEdit = true;
            } else {
                this.aboutEdit = false;
            }
        } else {
        }
    }

    aboutEditCancel() {
        this.aboutEdit = false;
        this.notEditable = true;
    }

    checkedControl(id: string) {
        if (this.features) {
            return this.features.filter(value => value &&  value._id === id).length > 0 ? true : false;
        } else {
            return false;
        }
    }

    changeFeature(event, item) {
        const checked = event.target.checked;
        const lengthOfFeatures = this.features.length;
        const indexOfItem = this.features.indexOf(item);
        if (!(!checked && lengthOfFeatures === 1 && indexOfItem >= 0)) {
            this.userService.addFeatureToCurrentUser(checked, item).subscribe(value => {
                if (checked) {
                    this.features.push(item);
                } else {
                    this.features.splice(indexOfItem, 1);
                }
            });
        }
    }

    checkDisabledCheckBox(item) {
        const indexOfItem = this.features.indexOf(item._id);
        if (this.features && this.features.length === 1 && indexOfItem >= 0) {
            return true;
        } else {
            return false;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.features) {
            this.features = changes.features.currentValue;
        }
    }
}
