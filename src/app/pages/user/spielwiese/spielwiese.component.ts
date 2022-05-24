import {Component, OnInit} from '@angular/core';
import {SpielwieseService} from '../../../services/spielwiese.service';
import {SystemConfigService} from '../../../services/system-config.service';
import {TokenService} from '../../../services/token.service';
import {environment} from '../../../../environments/environment';
import {UdcService} from '../../../services/udc.service';
import {mergeMap} from 'rxjs/operators';
import {UdcNameEnum} from '../../../model/udc-name.enum';

@Component({
    selector: 'app-spielwiese',
    templateUrl: './spielwiese.component.html',
    styleUrls: ['./spielwiese.component.scss']
})
export class SpielwieseComponent implements OnInit {
    public isSurveyActive;
    public isNewsActive;
    public backendURL = environment.url;

    public clubBoardImageUrl;
    public partnerSucheImageUrl;
    public erlebnisChatImageUrl;
    public werIstOnlineImageUrl;
    public neuigkeitenImageUrl;
    public umfragenImageUrl;
    public titleBildUrl;

    public isHeaderBoxShow = true;

    public loggedUser: any;

    cards: any = [
        {
            image: null,
            title: 'Clubboard',
            content: '',
            button: 'zum Clubboard',
            buttonUrl: '/clubboard'
        },
        {
            image: null,
            title: 'Partnersuche',
            content: '',
            button: 'zur Suche',
            buttonUrl: '/profilsuche'
        },
        /**
         {
            image: null,
            title: 'Erlebnis Chats',
            content: '',
            button: 'zu den Chats',
            buttonUrl: '/messages'
        },
         **/
        {
            image: null,
            title: 'Wer ist Online',
            content: '',
            button: 'Wer ist Online',
            buttonUrl: '/online-users'
        },
        {
            image: null,
            title: 'Neuigkeiten',
            content: '',
            button: 'zu den Neuigkeiten',
            buttonUrl: '/neuigkeiten'
        }/*
         {
             image: null,
             title: 'Umfragen',
             content: '',
             button: 'zu den Umfragen',
             buttonUrl: ''
         }*/
    ];

    constructor(private spielwiese: SpielwieseService,
                private systemConfigService: SystemConfigService,
                private tokenService: TokenService,
                private udcService: UdcService
    ) {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        this.loggedUser = this.tokenService.getPayload();
        if (this.loggedUser.gender.name === 'Male') {
            this.findCardAndDelete('Wer ist Online');
        }
    }

    ngOnInit() {
        this.checkSystemConfig();
        this.findAll();
    }

    findCardAndDelete(title) {
        const findIndex = this.cards.findIndex(item => item.title === title);
        this.cards.splice(findIndex, 1);
    }

    findAll() {
        this.udcService.findAll().pipe(
            mergeMap((data: any) => {
                const udc = data.body ? data.body.response : [];
                if (udc && udc.length > 0) {
                    const clubboard = udc.filter(val => val.name && val.name.name === UdcNameEnum.Eisdiele_Clubboard_348x180)[0];

                    if (clubboard) {
                        if (clubboard.image) {
                            this.clubBoardImageUrl = clubboard.image.imageURL;
                            if (this.cards[0]) {
                                this.cards[0].image = this.backendURL + this.clubBoardImageUrl;
                            }
                        }
                    }

                    const partnerSuche = udc.filter(val => val.name && val.name.name === UdcNameEnum.Eisdiele_Partnersuche_348x180)[0];
                    if (partnerSuche) {
                        if (partnerSuche.image) {
                            this.partnerSucheImageUrl = partnerSuche.image.imageURL;
                            if (this.cards[1]) {
                                this.cards[1].image = this.backendURL + this.partnerSucheImageUrl;
                            }
                        }
                    }
                    const werIstOnline = udc.filter(val => val.name && val.name.name === UdcNameEnum.Eisdiele_Wer_ist_online_348x180)[0];
                    if (werIstOnline) {
                        if (werIstOnline.image) {
                            this.werIstOnlineImageUrl = werIstOnline.image.imageURL;
                            if (this.cards[2]) {
                                this.cards[2].image = this.backendURL + this.werIstOnlineImageUrl;
                            }
                        }
                    }

                    const neugkeiten = udc.filter(val => val.name && val.name.name === UdcNameEnum.Eisdiele_Neuigkeiten_348x180)[0];
                    if (neugkeiten) {
                        if (neugkeiten.image) {
                            this.neuigkeitenImageUrl = neugkeiten.image.imageURL;
                            if (this.cards[3]) {
                                this.cards[3].image = this.backendURL + this.neuigkeitenImageUrl;
                            }
                        }
                    }

                    /* const umfragen = udc.filter(val => val.name && val.name.name === UdcNameEnum.Eisdiele_Umfragen_348x180)[0];

                    if (umfragen) {
                        this.umfragenImageUrl = umfragen.image.imageURL;
                        this.cards[4].image = this.backendURL + this.umfragenImageUrl;
                    }*/

                    const titleBild = udc.filter(val => val.name && val.name.name === UdcNameEnum.Eisdiele_Titelbild_1920x400)[0];
                    if (titleBild) {
                        if (titleBild.image) {
                            this.titleBildUrl = this.backendURL + titleBild.image.imageURL;
                        }
                    }
                }
                return this.spielwiese.findAll();
            })
        ).subscribe((data) => {
            const result = data.body;
            result.forEach((forData) => {
                if (forData.name === 'Pinnwand' && forData.content) {
                    this.cards[0].content = forData.content;
                }
                if (forData.name === 'Partnersuche' && forData.content) {
                    this.cards[1].content = forData.content;
                }
                /**
                 if (forData.name === 'Erlebnis Chats' && forData.content) {
                    this.cards[2].content = forData.content;
                }
                 **/
                if (forData.name === 'Club Bereich' && forData.content) {
                    this.cards[2].content = forData.content;
                }
                if (forData.name === 'Neuigkeiten' && forData.content) {

                    this.cards[3].content = forData.content;
                }
                /*if (forData.name === 'Umfragen' && forData.content) {
                     this.cards[4].content = forData.content;
                 }*/
            });
        });
    }

    checkSystemConfig() {
        this.systemConfigService.findAll().subscribe((data) => {
            const response = data.body;
            response.forEach((result) => {
                this.isNewsActive = result.isNews;
                if (!this.isNewsActive) {
                    this.findCardAndDelete('Neuigkeiten');
                }
                this.isSurveyActive = result.isSurveyActive;
                this.isHeaderBoxShow = result.isWelcomePageHeaderBoxShow;
            });
        });
    }

    inputSetData() {
        // openModal
        document.getElementById('modalButton').click();
        // setData
        const data = document.getElementById('email');
        const user = this.tokenService.getPayload();
        data['value'] = user.email;
    }

}
