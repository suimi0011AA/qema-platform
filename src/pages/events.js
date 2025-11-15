import { supabase, auth } from '../main.js';

export class EventsPage {
    constructor() {
        this.events = [];
        this.tags = [];
        this.filteredEvents = [];
        this.searchTerm = '';
        this.selectedTag = '';
    }

    async render() {
        await this.loadData();
        const user = auth.getUser();

        return `
            <nav class="nav">
                <div class="nav-content">
                    <a href="#/" class="nav-logo">مبادرة قِمّة</a>
                    <div class="nav-menu">
                        <a href="#/" class="nav-link">الرئيسية</a>
                        <a href="#/events" class="nav-link" style="color: var(--primary);">الفعاليات</a>
                        <a href="#/programs" class="nav-link">البرامج</a>
                        ${user ? `
                            <a href="#/dashboard" class="nav-link">لوحة التحكم</a>
                            <button class="btn btn-secondary" id="logoutBtn">تسجيل الخروج</button>
                        ` : `
                            <a href="#/login" class="btn btn-primary">تسجيل الدخول</a>
                        `}
                    </div>
                </div>
            </nav>

            <section class="section">
                <div class="container">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
                        <h1 style="font-size: 32px; font-weight: 700;">الفعاليات القادمة</h1>
                        ${user ? `<a href="#/create-event" class="btn btn-primary">إضافة فعالية</a>` : ''}
                    </div>

                    <div class="card" style="margin-bottom: 32px;">
                        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                            <input
                                type="text"
                                class="input"
                                id="searchInput"
                                placeholder="ابحث عن فعالية..."
                                style="flex: 1; min-width: 250px;"
                                value="${this.searchTerm}"
                            >
                            <select class="select" id="tagFilter" style="min-width: 200px;">
                                <option value="">جميع التصنيفات</option>
                                ${this.tags.map(tag => `
                                    <option value="${tag.id}" ${this.selectedTag === tag.id ? 'selected' : ''}>
                                        ${tag.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>

                    <div id="eventsContainer">
                        ${this.renderEvents()}
                    </div>
                </div>
            </section>
        `;
    }

    renderEvents() {
        if (this.filteredEvents.length === 0) {
            return `
                <div class="card" style="text-align: center; padding: 64px 32px;">
                    <div style="font-size: 64px; margin-bottom: 16px;">📅</div>
                    <h3 style="margin-bottom: 8px;">لا توجد فعاليات</h3>
                    <p style="color: var(--neutral-600);">لم يتم العثور على فعاليات تطابق البحث</p>
                </div>
            `;
        }

        return `
            <div class="grid grid-2">
                ${this.filteredEvents.map(event => this.renderEventCard(event)).join('')}
            </div>
        `;
    }

    renderEventCard(event) {
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        const now = new Date();
        const isUpcoming = startDate > now;
        const isOngoing = startDate <= now && endDate >= now;

        let statusBadge = '';
        if (isOngoing) {
            statusBadge = '<span class="badge badge-success">جارية الآن</span>';
        } else if (isUpcoming) {
            statusBadge = '<span class="badge badge-primary">قريبًا</span>';
        }

        return `
            <div class="card" style="cursor: pointer; height: 100%;" onclick="window.location.hash='#/events/${event.id}'">
                ${event.cover_image ? `
                    <img src="${event.cover_image}" alt="${event.title}"
                         style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 16px;">
                ` : `
                    <div style="width: 100%; height: 200px; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); border-radius: var(--radius-md); margin-bottom: 16px; display: flex; align-items: center; justify-content: center; font-size: 48px;">
                        🎯
                    </div>
                `}
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <h3 style="font-size: 20px; font-weight: 600; flex: 1;">${event.title}</h3>
                    ${statusBadge}
                </div>
                <p style="color: var(--neutral-600); margin-bottom: 16px; line-height: 1.5;">
                    ${event.short_description || 'لا يوجد وصف'}
                </p>
                <div style="display: flex; gap: 8px; color: var(--neutral-500); font-size: 14px; margin-bottom: 8px;">
                    <span>📅</span>
                    <span>${this.formatDate(startDate)}</span>
                </div>
                ${event.location ? `
                    <div style="display: flex; gap: 8px; color: var(--neutral-500); font-size: 14px;">
                        <span>📍</span>
                        <span>${event.location}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    formatDate(date) {
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    async loadData() {
        const { data: events, error: eventsError } = await supabase
            .from('events')
            .select(`
                *,
                organizations(name),
                venues(name, city)
            `)
            .eq('status', 'published')
            .eq('visibility', 'public')
            .order('start_date', { ascending: true });

        if (!eventsError && events) {
            this.events = await Promise.all(events.map(async (event) => {
                const { data: images } = await supabase
                    .from('event_images')
                    .select('url')
                    .eq('event_id', event.id)
                    .eq('is_cover', true)
                    .limit(1);

                return {
                    ...event,
                    cover_image: images?.[0]?.url
                };
            }));
        }

        const { data: tags } = await supabase
            .from('tags')
            .select('*')
            .order('name');

        if (tags) this.tags = tags;

        this.filterEvents();
    }

    filterEvents() {
        this.filteredEvents = this.events.filter(event => {
            const matchesSearch = !this.searchTerm ||
                event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                (event.short_description && event.short_description.toLowerCase().includes(this.searchTerm.toLowerCase()));

            const matchesTag = !this.selectedTag;

            return matchesSearch && matchesTag;
        });
    }

    mount() {
        const searchInput = document.getElementById('searchInput');
        const tagFilter = document.getElementById('tagFilter');
        const logoutBtn = document.getElementById('logoutBtn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.filterEvents();
                document.getElementById('eventsContainer').innerHTML = this.renderEvents();
            });
        }

        if (tagFilter) {
            tagFilter.addEventListener('change', (e) => {
                this.selectedTag = e.target.value;
                this.filterEvents();
                document.getElementById('eventsContainer').innerHTML = this.renderEvents();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await auth.signOut();
            });
        }
    }
}
