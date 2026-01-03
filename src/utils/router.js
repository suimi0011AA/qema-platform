import { HomePage } from '../pages/home.js';
import { EventsPage } from '../pages/events.js';
import { EventDetailPage } from '../pages/event-detail.js';
import { LoginPage } from '../pages/login.js';
import { RegisterPage } from '../pages/register.js';
import { DashboardPage } from '../pages/dashboard.js';
import { CreateEventPage } from '../pages/create-event.js';
import { EditEventPage } from '../pages/edit-event.js';
import { ProgramsPage } from '../pages/programs.js';

export class Router {
    constructor(auth) {
        this.auth = auth;
        this.routes = {
            '/': HomePage,
            '/events': EventsPage,
            '/events/:id': EventDetailPage,
            '/login': LoginPage,
            '/register': RegisterPage,
            '/dashboard': DashboardPage,
            '/create-event': CreateEventPage,
            '/edit-event/:id': EditEventPage,
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

        // Check for admin parameter and store it
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true') {
            console.log('Admin parameter detected, storing in sessionStorage');
            sessionStorage.setItem('adminAccess', 'true');
        }

        // Admin-only routes
        const adminRoutes = ['/dashboard', '/create-event'];
        const editEventRoute = hash.match(/^\/edit-event\/(.+)$/);
        
        if ((adminRoutes.includes(hash) || editEventRoute) && !this.auth.isAuthenticated()) {
            window.location.hash = '#/login';
            return;
        }

        // Hide registration and login from public (admin-only)
        // TEMPORARILY DISABLED FOR DEBUGGING
        /*
        if ((hash === '/register' || hash === '/login') && !this.isAdminAccess()) {
            // Redirect to home if trying to access admin login/register
            window.location.hash = '#/';
            return;
        }
        */

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

    // Check if this is an admin trying to access login/register
    isAdminAccess() {
        // Check for admin parameter in URL or if user is already authenticated
        const urlParams = new URLSearchParams(window.location.search);
        const isAdminParam = urlParams.get('admin') === 'true';
        const isAdminPath = window.location.pathname.includes('admin-login');
        const isAuthenticated = this.auth.isAuthenticated();
        const hasAdminInReferrer = document.referrer.includes('admin-login');
        const hasStoredAdminAccess = sessionStorage.getItem('adminAccess') === 'true';
        
        // Debug logging
        console.log('Admin Access Check:', {
            urlParams: window.location.search,
            isAdminParam,
            isAdminPath,
            pathname: window.location.pathname,
            isAuthenticated,
            referrer: document.referrer,
            hasAdminInReferrer,
            hasStoredAdminAccess
        });
        
        // Also check if we came from admin-login page or have admin param or stored access
        return isAuthenticated || isAdminParam || isAdminPath || hasAdminInReferrer || hasStoredAdminAccess;
    }

    navigate(path) {
        window.location.hash = `#${path}`;
    }
}