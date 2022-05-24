import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {environment} from './environments/environment';
import {AppModule} from './app/app.module';

if (environment.production) {
    // add Google Analytics script to <head>
     const scriptProdOne = document.createElement('script');
     scriptProdOne.src = 'https://www.googletagmanager.com/gtag/js?id=UA-146065926-1';
     scriptProdOne.setAttribute('id', 'googletagmanagerOne')
     scriptProdOne.setAttribute('rel', 'script preload prefetch');
     scriptProdOne.setAttribute('type', 'text/javascript');
     scriptProdOne.setAttribute('as', 'script');
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


    const scriptProdThree = document.createElement('script');
    scriptProdThree.async = true;
    scriptProdThree.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=AW-359861119');


    const scriptProdFour = document.createElement('script');
    scriptProdFour.innerHTML = `window.dataLayer = 
    window.dataLayer || []; 
    function gtag(){dataLayer.push(arguments);} 
    gtag('js', new Date()); 
    gtag('config', 'AW-359861119');`;


    const scriptProdFive = document.createElement('script');
    scriptProdFive.innerHTML = `gtag('event', 'conversion', {'send_to': 'AW-359861119/Oj3yCLucjroCEP-WzKsB'}) `;

    document.head.appendChild(scriptProdOne);
    document.head.appendChild(scriptProd);
    document.head.appendChild(scriptProdThree);
    document.head.appendChild(scriptProdFour);
    document.head.appendChild(scriptProdFive);

    enableProdMode();
}


document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic().bootstrapModule(AppModule, {
        preserveWhitespaces: false
    })
        .catch(err => console.error('main.ts', err));
});
