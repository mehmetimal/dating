import {Component, EventEmitter, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {IUser} from '../../../model/user.model';
import {environment} from '../../../../environments/environment';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {TokenService} from '../../../services/token.service';
import {WINDOW} from '@ng-toolkit/universal';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {IUserFeature} from '../../../model/user-feature.model';
import {UserFeatureService} from '../../../services/user-feature.service';
import {isPlatformBrowser} from '@angular/common';
import {SharedImageService} from '../../../services/shared-image.service';
import {ISharedImage} from '../../../model/shared-image.model';
import {Options} from 'ng5-slider';
import {AcceptStateEnum} from '../../../model/accept-state.enum';
import {JhiEventManager} from '../../../services/event-manager.service';

declare var google;

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
    manualRefresh: EventEmitter<void> = new EventEmitter<void>();
    distance: number;
    options: Options;
    isPlatformBrowser: boolean;
    public currentPage = 1;


    public users: IUser[] = [];
    public userTotal: any;
    public backendURL = environment.url;
    public udcFolder = environment.udcFolder;

    bsModalRef: NgbModalRef;
    featureOptions: IUserFeature[];

    subs: Subscription;
    searchError = false;
    errorMessage: string;
    sharedImagesWithCurrentUser: ISharedImage[];
    public page = 1;

    public approved = AcceptStateEnum.APPROVED;

    isShow: boolean;
    topPosToStartShowing = 100;

    public isOpen = false;

    public searchContent: {
        minAgeValue: null,
        highAgeValue: null,
        features: null,
        distance: null,
        postCode: null,
        clubNumber: null
    };

    constructor(@Inject(WINDOW) private window: Window,
                @Inject(PLATFORM_ID) private platformId: any,
                public userService: UserService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private tokenService: TokenService,
                private sharedImageService: SharedImageService,
                private eventManager: JhiEventManager,
                private userFeatureService: UserFeatureService
    ) {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    ngOnInit() {
        this.page = 1;
        this.findAllSharedImagesWithCurrentUser();
        this.getUsersWithRouteData();
        this.open();
        this.subs = this.eventManager.subscribe(
            'user-detail-search-param-changed',
            response => {
                const content = response.content;
                this.searchContent = response.content;
                this.page = 1;
                this.users = [];
                this.getUsersWithDetailSearch(content.minAgeValue,
                    content.highAgeValue, content.features, content.distance, content.postCode, content.clubNumber);

            }
        );

        this.options = {
            showTicksValues: true,
            getLegend: (value: number): string => {
                return '' + value;
            },
            stepsArray: [
                {value: 100},
                {value: 150},
                {value: 200},
                {value: 250},
                {value: 300}
            ]
        };
    }

    open() {
        this.userFeatureService.findAll().subscribe((data: any) => {
            this.featureOptions = data.body.response;
        });
    }

    /*
    * İn das User component gibt es  bestimmte Filter. Gemäß diesen Filtern wird das Frondend
    * aus dem Backend abgerufen und das frondned wir updated . als Extra angegebenen Postleitzahl,
    *  gemäß der unter Verwendung der Google Maps Geocoder-API angegebenen Zone, wird die Beispielumgebung
    * 25KM 30KM der Postleitzahl durchsucht und die Benutzer in diesem User werden der Liste hinzugefügt.
    * */

    getUsersWithDetailSearch(minAgeValue, highAgeValue, features, distance, postCode, clubNumber) {
        this.searchError = false;
        if (postCode && postCode.length > 0) {
            const locationPromise = this.getLocationFromAddress(distance, postCode);
            Promise.resolve(locationPromise).then(returnVals => {
                const lat = returnVals[0];
                const lng = returnVals[1];
                this.userService.searchDetailUserByParams(minAgeValue,
                    highAgeValue, features, clubNumber, this.page, postCode, lat, lng).subscribe((res: any) => {
                    this.users = this.users.concat(res.body.data);
                    this.userTotal = res.body.total;
                });
                this.searchError = false;
            }).catch((err) => {
                this.searchError = true;
                this.users = [];
                this.errorMessage = `Couldn't find the location ${postCode} Germany`;
            });
        } else {
            this.userService.searchDetailUserByParams(minAgeValue,
                highAgeValue, features, clubNumber, this.page).subscribe((res: any) => {
                this.users = this.users.concat(res.body.data);
                this.userTotal = res.body.total;
            });
        }
    }

    getUsersWithDetailSearchByClubNumber(clubNumber) {
        this.searchError = false;
        this.page = 1;
        this.userService.searchDetailUserByClubNumber(clubNumber).subscribe((res: any) => {
            this.users = res.body.data;
        });
    }

    getLocationFromAddress(distance, address) {
        // tslint:disable-next-line:only-arrow-functions
        return new Promise(function(resolve, reject) {
            const geocoder = new google.maps.Geocoder();

            let lat = '';
            let lng = '';
            geocoder.geocode({
                    componentRestrictions: {
                        country: 'DE',
                        postalCode: address
                    }
                    // tslint:disable-next-line:only-arrow-functions
                }, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                        lat = results[0].geometry.location.lat();
                        lng = results[0].geometry.location.lng();
                        resolve([results[0].geometry.location.lat(), results[0].geometry.location.lng()]);
                    } else {
                        reject(new Error('Standort 23 konnte nicht gefunden werden ' + address));
                    }
                }
            );
        });

    }

/*    public filterUsersByDistance(users, distance: number, lat?: number, lng?: number) {

        this.mapsAPILoader.load().then(() => {

            const center = new google.maps.LatLng(lat, lng);
            // markers located within 50 km distance from center are included
            this.users = users.filter(user => {

                const markerLoc = new google.maps.LatLng(user.lat, user.lng);
                const distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(markerLoc, center) / 1000;
                if (distanceInKm < distance) {
                    return user;
                }
            });

        });
    }*/

    getUsersWithRouteData() {
        let state: any;
        this.activatedRoute.paramMap.pipe(
            map(() => {
                if (isPlatformBrowser(this.platformId)) {
                    state = this.window.history.state;
                }
            })
        ).subscribe((res: any) => {
            if (state.clubNumber) {
                this.getUsersWithDetailSearchByClubNumber(state.clubNumber);
            } else {
                this.getUsersWithDetailSearch(state.minAgeValue, state.highAgeValue, state.features,
                    state.distance, state.postCode, state.clubNumber);
            }

        });
    }

    ngOnDestroy(): void {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }

    isCurrentUserBlockList(user: IUser) {
        const currentUser = this.tokenService.getPayload();
        let blockListUser;
        if (user.blockUserList && user.blockUserList.length > 0) {
            blockListUser = user.blockUserList.find(value => value._id === currentUser._id);
        }
        return blockListUser ? true : false;
    }

    isSharedProfileImageWithCurrentUser(user: IUser) {
        const currentUser = this.tokenService.getPayload();
        let sharedUser;
        if (this.sharedImagesWithCurrentUser && this.sharedImagesWithCurrentUser.length > 0) {
            sharedUser = this.sharedImagesWithCurrentUser.find(value => value.toUser === currentUser._id
                && user && user.profileImage && value.image === user.profileImage._id);
        }
        return sharedUser || (user && user.profileImage && user.profileImage.isBlurRemoved) ? true : false;
    }

    findAllSharedImagesWithCurrentUser() {
        this.sharedImageService.findAllSharedImagesWithCurrentUser().subscribe((value: any) => {
            this.sharedImagesWithCurrentUser = value.body;
        });
    }

    nextPage() {
        this.page = this.page + 1;
        if (this.searchContent === undefined) {
            this.searchContent = {
                minAgeValue: null,
                highAgeValue: null,
                features: null,
                distance: null,
                postCode: null,
                clubNumber: null
            };
        }
        this.getUsersWithDetailSearch(this.searchContent.minAgeValue,
            this.searchContent.highAgeValue, this.searchContent.features,
            this.searchContent.distance, this.searchContent.postCode, this.searchContent.clubNumber);
    }

    @HostListener('window:scroll')
    checkScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= this.topPosToStartShowing) {
            this.isShow = true;
        } else {
            this.isShow = false;
        }
    }

    // TODO: Cross browsing
    gotoTop() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    goToMessage(user: IUser) {
        const convertUser = JSON.stringify(user);
        this.router.navigateByUrl('/messages', {state: {data: convertUser}});
    }

    toggleSidebar() {
        this.isOpen = this.isOpen ? false : true;
    }
}
