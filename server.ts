import 'zone.js/dist/zone-node';

import * as express from 'express';
import {join} from 'path';

const http = require('http');
const compression = require('compression');
// Express server
const app = express();
app.use(compression());

const PORT = process.env.PORT || 80;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');


const domino = require('domino');
const fs = require('fs');
const templateA = fs.readFileSync(join(DIST_FOLDER, 'index.html')).toString();
const win = domino.createWindow(templateA);
win.Object = Object;
win.Math = Math;
global['window'] = win;
global['document'] = win.document;
global['navigator'] = win.navigator;

const proxy = require('http-proxy-middleware');
app.use('/api', proxy({
    target: 'https://pronode.u-dating.club',
    changeOrigin: true
}));

app.use('/sitemap.xml', proxy({
    target: 'https://pronode.u-dating.club/sitemap',
    changeOrigin: true
}));

app.use('/robots.txt', proxy({
    target: 'https://pronode.u-dating.club/robots',
    changeOrigin: true
}));

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine, provideModuleMap} = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
    maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
    res.render('index', {req});
});


const httpsServer = http.createServer(app)
    .listen(PORT, () => {
        console.log('Express server listening on port ' + PORT);
    });
