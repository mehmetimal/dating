import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {UserService} from '../../services/user.service';

interface IBreadcrumb {
    label: string;
    params?: Params;
    url: string;
}

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})

export class BreadcrumbComponent implements OnInit {
    public breadcrumbs: IBreadcrumb[];

    constructor(public router: Router,
                public userService: UserService,
                private activatedRoute: ActivatedRoute) {
        this.breadcrumbs = [];
        this.router.events.pipe(filter((event => event instanceof NavigationEnd))).subscribe(event => {
            const root: ActivatedRoute = this.activatedRoute.root;
            this.breadcrumbs = this.getBreadcrumbs(root);
        });
    }

    ngOnInit() {
    }

    private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
        const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) {
            return breadcrumbs;
        }

        for (const child of children) {
            if (child.outlet !== PRIMARY_OUTLET) {
                continue;
            }

            if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
                return this.getBreadcrumbs(child, url, breadcrumbs);
            }

            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

            url += `/${routeURL}`;

            const breadcrumb: IBreadcrumb = {
                label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
                params: child.snapshot.params,
                url: url
            };
            breadcrumbs.push(breadcrumb);

            return this.getBreadcrumbs(child, url, breadcrumbs);
        }
        return breadcrumbs;
    }

    isAuthenticated() {
        return this.userService.getToken() ? true : false;
    }

}
