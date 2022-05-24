import {Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {TokenService} from './token.service';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AddcellService {

    public addCellScriptTag;
    public addCellTrackScriptTag;
    private renderer2: Renderer2;

    constructor(@Inject(DOCUMENT) private document: any,
                private tokenService: TokenService,
                @Inject(PLATFORM_ID) private platformId: any,
                rendererFactory: RendererFactory2) {
        this.renderer2 = rendererFactory.createRenderer(null, null);
    }

    addCellJs() {
        const user = this.tokenService.getPayload();
        if (!user && isPlatformBrowser(this.platformId)) {
            const addCell = this.document.getElementById('adcell');
            if (!addCell) {
                this.addCellScriptTag = this.renderer2.createElement('script');
                this.addCellScriptTag.type = 'text/javascript';
                this.addCellScriptTag.src = 'https://t.adcell.com/js/trad.js'; // Defines someGlobalObject
                this.addCellScriptTag.setAttribute('id', 'adcell');
                this.addCellScriptTag.setAttribute('as', 'script');
                this.addCellScriptTag.setAttribute('rel', 'script preload prefetch');
                this.addCellScriptTag.setAttribute('type', 'text/javascript');
                this.renderer2.appendChild(this.document.body, this.addCellScriptTag);
                this.delay(5000).then(v => {
                    this.loadNextScript();
                });
            }

        }
    }

    loadNextScript() {
        this.addCellTrackScriptTag = this.renderer2.createElement('script');
        this.addCellTrackScriptTag.text = `Adcell.Tracking.track();`;
        this.addCellTrackScriptTag.setAttribute('id', 'adtrackcell');
        this.addCellTrackScriptTag.setAttribute('as', 'script');
        this.addCellTrackScriptTag.setAttribute('rel', 'script preload prefetch');
        this.addCellTrackScriptTag.setAttribute('type', 'text/javascript');
        this.renderer2.appendChild(this.document.body, this.addCellTrackScriptTag);
    }

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => {
        });
    }

    removeAddCellScripts() {
        if (isPlatformBrowser(this.platformId)) {
            const addCell = this.document.getElementById('adcell');
            const addTrackCell = this.document.getElementById('adtrackcell');
            if (addCell) {
                this.document.body.removeChild(addCell);
                this.document.body.removeChild(addTrackCell);
            }
        }
    }

    removeGoogleTagManager() {
        if (isPlatformBrowser(this.platformId) && environment.production) {
            const googleTagManager = this.document.getElementById('googletagmanagerOne');
            const googleTagManager2 = this.document.getElementById('googletagmanagerTwo');
            if (googleTagManager) {
                this.document.head.removeChild(googleTagManager);
            }
            if (googleTagManager2) {
                this.document.head.removeChild(googleTagManager2);
            }
            const scripts: any = document.getElementsByTagName('script');
            if (scripts && scripts.length > 0) {
                for (const item of scripts) {
                    if (item.src === 'https://www.google-analytics.com/analytics.js') {
                        this.document.head.removeChild(item);
                    }
                }
            }
        }
    }

    addGoogleTagManager() {
        // add Google Analytics script to <head>
        if (isPlatformBrowser(this.platformId) && environment.production) {
            const scriptProdOne = document.createElement('script');
            scriptProdOne.src = 'https://www.googletagmanager.com/gtag/js?id=UA-146065926-1';
            scriptProdOne.setAttribute('id', 'googletagmanagerOne');
            scriptProdOne.setAttribute('as', 'script');
            scriptProdOne.setAttribute('rel', 'script preload prefetch');
            scriptProdOne.setAttribute('type', 'text/javascript');
            scriptProdOne.async = true;
            const scriptProd = document.createElement('script');
            scriptProd.setAttribute('id', 'googletagmanagerTwo');
            scriptProd.setAttribute('as', 'script');
            scriptProd.setAttribute('rel', 'script preload prefetch');
            scriptProd.setAttribute('type', 'text/javascript');
            scriptProd.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-146065926-1', {
            cookie_flags: 'max-age=7200;secure;samesite=none'
            });`;
            document.head.appendChild(scriptProdOne);
            document.head.appendChild(scriptProd);
        }

    }
}
