import { HomePage } from '../pages/home.js';
import { EventsPage } from '../pages/events.js';
import { EventDetailPage } from '../pages/event-detail.js';
import { LoginPage } from '../pages/login.js';
import { RegisterPage } from '../pages/register.js';
import { DashboardPage } from '../pages/dashboard.js';
import { CreateEventPage } from '../pages/create-event.js';
import { ProgramsPage } from '../pages/programs.js';
import { auth } from '../main.js';

export class Router {
    constructor() {
        this.routes = {
            '/': HomePage,
            '/events': EventsPage,
            '/events/:id': EventDetailPage,
            '/login': LoginPage,
            '/register': RegisterPage,
            '/dashboard': DashboardPage,
            '/create-event': CreateEventPage,
            '/programs': ProgramsPage
        };
        this.currentPage = null;
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }

    async handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const app = document.getElementById('app');

        const protectedRoutes = ['/dashboard', '/create-event'];
        if (protectedRoutes.includes(hash) && !auth.isAuthenticated()) {
            window.location.hash = '#/login';
            return;
        }

        let matchedRoute = null;
        let params = {};

        for (const [route, PageClass] of Object.entries(this.routes)) {
            const routePattern = route.replace(/:\w+/g, '([^/]+)');
            const regex = new RegExp(`^${routePattern}$`);
            const match = hash.match(regex);

            if (match) {
                matchedRoute = PageClass;
                const paramNames = (route.match(/:\w+/g) || []).map(p => p.slice(1));
                paramNames.forEach((name, i) => {
                    params[name] = match[i + 1];
                });
                break;
            }
        }

        if (matchedRoute) {
            if (this.currentPage && this.currentPage.destroy) {
                this.currentPage.destroy();
            }
            this.currentPage = new matchedRoute(params);
            app.innerHTML = await this.currentPage.render();
            if (this.currentPage.mount) {
                this.currentPage.mount();
            }
        } else {
            app.innerHTML = '<div class="error-page"><h1>404 - الصفحة غير موجودة</h1></div>';
        }
    }

    navigate(path) {
        window.location.hash = `#${path}`;
    }
}
