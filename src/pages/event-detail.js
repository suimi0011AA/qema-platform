import { supabase, auth } from '../main.js';

export class EventDetailPage {
    constructor(params) {
        this.eventId = params.id;
        this.event = null;
    }

    async render() {
        await this.loadEvent();
        const user = auth.getUser();

        if (!this.event) {
            return `
                <nav class="nav">
                    <div class="nav-content">
                        <a href="#/" class="nav-logo">
                            <img src="/qimmahlogo.png" alt="مبادرة قِمّة" class="logo">
                            <span>مبادرة قِمّة</span>
                        </a>
                    </div>
                </nav>
                <div class="section">
                    <div class="container">
                        <div class="card" style="text-align: center; padding: 64px;">
                            <h2>الفعالية غير موجودة</h2>
                            <a href="#/events" class="btn btn-primary" style="margin-top: 24px;">العودة للفعاليات</a>
                        </div>
                    </div>
                </div>
            `;
        }

        const startDate = new Date(this.event.start_date);
        const endDate = new Date(this.event.end_date);
        const now = new Date();
        const isUpcoming = startDate > now;
        const isOngoing = startDate <= now && endDate >= now;
        const isPast = endDate < now;

        let statusBadge = '';
        if (isOngoing) {
            statusBadge = '<span class="badge badge-success" style="font-size: 16px;">جارية الآن</span>';
        } else if (isUpcoming) {
            statusBadge = '<span class="badge badge-primary" style="font-size: 16px;">قريبًا</span>';
        } else if (isPast) {
            statusBadge = '<span class="badge badge-error" style="font-size: 16px;">انتهت</span>';
        }

        return `
            <nav class="nav">
                <div class="nav-content">
                    <a href="#/" class="nav-logo">
                        <img src="/qimmahlogo.png" alt="مبادرة قِمّة" class="logo">
                        <span>مبادرة قِمّة</span>
                    </a>
                    <div class="nav-menu">
                        <a href="#/" class="nav-link">الرئيسية</a>
                        <a href="#/events" class="nav-link">الفعاليات</a>
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
                <div class="container" style="max-width: 900px;">
                    <a href="#/events" class="btn btn-secondary" style="margin-bottom: 24px;">← العودة للفعاليات</a>

                    ${this.event.cover_image ? `
                        <img src="${this.event.cover_image}" alt="${this.event.title}"
                             style="width: 100%; height: 400px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: 32px;">
                    ` : ''}

                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px; flex-wrap: wrap; gap: 16px;">
                            <h1 style="font-size: 36px; font-weight: 700; flex: 1;">${this.event.title}</h1>
                            ${statusBadge}
                        </div>

                        ${this.event.short_description ? `
                            <p style="font-size: 20px; color: var(--neutral-600); margin-bottom: 32px; line-height: 1.5;">
                                ${this.event.short_description}
                            </p>
                        ` : ''}

                        <div style="display: grid; gap: 16px; margin-bottom: 32px;">
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <span style="font-size: 24px;">📅</span>
                                <div>
                                    <strong style="display: block; margin-bottom: 4px;">التاريخ</strong>
                                    <span style="color: var(--neutral-600);">
                                        من ${this.formatDate(startDate)} إلى ${this.formatDate(endDate)}
                                    </span>
                                </div>
                            </div>

                            ${this.event.location ? `
                                <div style="display: flex; gap: 12px; align-items: start;">
                                    <span style="font-size: 24px;">📍</span>
                                    <div>
                                        <strong style="display: block; margin-bottom: 4px;">الموقع</strong>
                                        <span style="color: var(--neutral-600);">${this.event.location}</span>
                                    </div>
                                </div>
                            ` : ''}

                            ${this.event.organizations?.name ? `
                                <div style="display: flex; gap: 12px; align-items: start;">
                                    <span style="font-size: 24px;">🏢</span>
                                    <div>
                                        <strong style="display: block; margin-bottom: 4px;">الجهة المنظمة</strong>
                                        <span style="color: var(--neutral-600);">${this.event.organizations.name}</span>
                                    </div>
                                </div>
                            ` : ''}

                            ${this.event.registration_deadline ? `
                                <div style="display: flex; gap: 12px; align-items: start;">
                                    <span style="font-size: 24px;">⏰</span>
                                    <div>
                                        <strong style="display: block; margin-bottom: 4px;">آخر موعد للتسجيل</strong>
                                        <span style="color: var(--neutral-600);">
                                            ${this.formatDate(new Date(this.event.registration_deadline))}
                                        </span>
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        ${this.event.full_description ? `
                            <div style="border-top: 2px solid var(--neutral-200); padding-top: 32px; margin-bottom: 32px;">
                                <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 16px;">عن الفعالية</h2>
                                <div style="color: var(--neutral-700); line-height: 1.8; white-space: pre-wrap;">
                                    ${this.event.full_description}
                                </div>
                            </div>
                        ` : ''}

                        ${this.event.registration_link ? `
                            <div style="text-align: center; padding-top: 32px; border-top: 2px solid var(--neutral-200);">
                                <a href="${this.event.registration_link}" target="_blank" class="btn btn-primary"
                                   style="font-size: 18px; padding: 16px 48px;">
                                    سجل الآن
                                </a>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </section>
        `;
    }

    formatDate(date) {
        return date.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    async loadEvent() {
        const { data, error } = await supabase
            .from('events')
            .select(`
                *,
                organizations(name),
                venues(name, city)
            `)
            .eq('id', this.eventId)
            .maybeSingle();

        if (!error && data) {
            const { data: images } = await supabase
                .from('event_images')
                .select('url')
                .eq('event_id', data.id)
                .eq('is_cover', true)
                .limit(1);

            this.event = {
                ...data,
                cover_image: images?.[0]?.url
            };
        }
    }

    mount() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await auth.signOut();
            });
        }
    }
}
