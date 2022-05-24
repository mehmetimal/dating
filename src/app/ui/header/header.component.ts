import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {RegisterPageConfigService} from '../../services/register-page-config.service';
import {Router} from '@angular/router';
import {catchError, mergeMap} from 'rxjs/operators';
import {RegisterPageImageService} from '../../services/register-page-image.service';
import {of} from 'rxjs';
import {LocationService} from '../../services/location.service';
import {LocalStorageService} from 'ngx-webstorage';
import {JhiEventManager} from '../../services/event-manager.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    public cardBackgroundColor: string;
    public state: string;
    users: any;

    constructor(
        public userService: UserService,
        private locationService: LocationService,
        private localStorageService: LocalStorageService,
        private registerPageConfigService: RegisterPageConfigService,
        public router: Router,
        private eventManager: JhiEventManager,
        private registerPageImageService: RegisterPageImageService,
    ) {
    }

    ngOnInit() {
        this.isAuthenticated();
        this.configureRegisterPage();
    }

    isAuthenticated() {
        return this.userService.getToken() ? true : false;
    }

    configureRegisterPage() {
        let imageArr: any[];

        this.registerPageImageService
            .findAll()
            .pipe(
                mergeMap((data: any) => {
                    imageArr = data.body.registerPageImages;
                    return this.registerPageConfigService.getRegisterPageConfig();
                }),
                catchError(err =>
                    of({
                        response: {
                            _id: null,
                            registerPageCardPosition: null,
                            registerPageCardBackground: null,
                            templateIsActive: null
                        }
                    })
                )
            )
            .subscribe((data: any) => {
                const firstImageName = imageArr[0];
                const dataResponse = data.response;
                let imagesWCheck = false;
                let imagesBCheck = false;
                let conflict = true;

                imageArr.forEach((value: any) => {
                    if (value.imageName.toLowerCase().indexOf('w') >= 0) {
                        imagesWCheck = true;
                    }

                    if (value.imageName.toLowerCase().indexOf('b') >= 0) {
                        imagesBCheck = true;
                    }
                });

                if (imagesBCheck && !imagesWCheck) {
                    conflict = false;

                    if (!dataResponse.registerPageCardBackground) {
                        this.cardBackgroundColor = 'black';
                    } else {
                        this.cardBackgroundColor = dataResponse.registerPageCardBackground;
                    }
                }
                if (imagesWCheck && !imagesBCheck) {
                    conflict = false;
                    if (!dataResponse.registerPageCardBackground) {
                        this.cardBackgroundColor = 'white';
                    } else {
                        this.cardBackgroundColor = dataResponse.registerPageCardBackground;
                    }
                }

                if (dataResponse.registerPageCardBackground) {
                    this.cardBackgroundColor = dataResponse.registerPageCardBackground;
                }

                if (conflict) {
                    if (!dataResponse.registerPageCardBackground) {
                        if (
                            firstImageName &&
                            firstImageName.imageName.toLowerCase().indexOf('w') >= 0
                        ) {
                            this.cardBackgroundColor = 'white';
                        } else if (
                            firstImageName &&
                            firstImageName.imageName.toLowerCase().indexOf('b') >= 0
                        ) {
                            this.cardBackgroundColor = 'black';
                        }
                    } else {
                        this.cardBackgroundColor = dataResponse.registerPageCardBackground;
                    }
                }
            });
    }

}
