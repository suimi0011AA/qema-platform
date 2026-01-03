import { supabase, auth } from '../main.js';

export class DashboardPage {
    constructor() {
        this.myEvents = [];
        this.stats = { total: 0, published: 0, draft: 0 };
    }

    async render() {
        await this.loadMyEvents();
        const user = auth.getUser();

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
                        <a href="#/dashboard" class="nav-link" style="color: var(--primary);">لوحة التحكم</a>
                        <button class="btn btn-secondary" id="logoutBtn">تسجيل الخروج</button>
                    </div>
                </div>
            </nav>

            <section class="section">
                <div class="container">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
                        <div>
                            <h1 class="heading-primary" style="font-size: 32px; margin-bottom: 8px;">لوحة التحكم</h1>
                            <p class="text-secondary">مرحبًا، ${user?.user_metadata?.name || user?.email}</p>
                        </div>
                        <a href="#/create-event" class="btn btn-primary">إضافة فعالية جديدة</a>
                    </div>

                    <div class="grid grid-3" style="margin-bottom: 32px;">
                        <div class="stats-card-green">
                            <div style="font-size: 36px; font-weight: 700; color: var(--brand-green); margin-bottom: 8px;">
                                ${this.stats.total}
                            </div>
                            <div class="text-secondary">إجمالي الفعاليات</div>
                        </div>
                        <div class="stats-card-brown">
                            <div style="font-size: 36px; font-weight: 700; color: var(--brand-brown); margin-bottom: 8px;">
                                ${this.stats.published}
                            </div>
                            <div class="text-secondary">منشورة</div>
                        </div>
                        <div class="stats-card-red">
                            <div style="font-size: 36px; font-weight: 700; color: var(--brand-red); margin-bottom: 8px;">
                                ${this.stats.draft}
                            </div>
                            <div class="text-secondary">مسودات</div>
                        </div>
                    </div>

                    <h2 class="heading-secondary" style="font-size: 24px; margin-bottom: 24px;">فعالياتي</h2>

                    ${this.myEvents.length === 0 ? `
                        <div class="card shadow-soft" style="text-align: center; padding: 64px 32px; background: var(--gray-50);">
                            <div style="font-size: 64px; margin-bottom: 16px;">📝</div>
                            <h3 class="heading-secondary" style="margin-bottom: 8px;">لم تقم بإنشاء أي فعالية بعد</h3>
                            <p class="text-muted" style="margin-bottom: 24px;">ابدأ بإنشاء فعاليتك الأولى</p>
                            <a href="#/create-event" class="btn btn-primary">إنشاء فعالية</a>
                        </div>
                    ` : `
                        <div class="grid grid-2">
                            ${this.myEvents.map(event => this.renderEventCard(event)).join('')}
                        </div>
                    `}
                </div>
            </section>
        `;
    }

    renderEventCard(event) {
        const startDate = new Date(event.start_date);
        const statusColors = {
            'draft': 'badge-warning',
            'published': 'badge-success',
            'archived': 'badge-error'
        };

        const statusLabels = {
            'draft': 'مسودة',
            'published': 'منشورة',
            'archived': 'مؤرشفة'
        };

        return `
            <div class="event-card">
                <div style="padding: var(--spacing-xl);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                        <h3 class="heading-secondary" style="font-size: 20px; flex: 1;">${event.title}</h3>
                        <span class="badge ${statusColors[event.status]}">${statusLabels[event.status]}</span>
                    </div>
                    <p class="text-secondary" style="margin-bottom: 16px; line-height: 1.5;">
                        ${event.short_description || 'لا يوجد وصف'}
                    </p>
                    <div style="display: flex; gap: 8px; margin-bottom: 16px;" class="text-muted">
                        <span>📅</span>
                        <span>${this.formatDate(startDate)}</span>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-ghost" onclick="window.location.hash='#/events/${event.id}'" style="flex: 1;">
                            عرض
                        </button>
                        <button class="btn btn-primary" data-edit-event="${event.id}" style="flex: 1;">
                            تعديل
                        </button>
                        <button class="btn btn-danger" data-delete-event="${event.id}">
                            حذف
                        </button>
                    </div>
                </div>
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

    async loadMyEvents() {
        const user = auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            this.myEvents = data;
            this.stats.total = data.length;
            this.stats.published = data.filter(e => e.status === 'published').length;
            this.stats.draft = data.filter(e => e.status === 'draft').length;
        }
    }

    mount() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await auth.signOut();
            });
        }

        document.querySelectorAll('[data-delete-event]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const eventId = e.target.dataset.deleteEvent;
                if (confirm('هل أنت متأكد من حذف هذه الفعالية؟')) {
                    await this.deleteEvent(eventId);
                }
            });
        });

        document.querySelectorAll('[data-edit-event]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = e.target.dataset.editEvent;
                window.location.hash = `#/edit-event/${eventId}`;
            });
        });
    }

    async deleteEvent(eventId) {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId);

        if (!error) {
            // Reload the page data without signing out
            await this.loadMyEvents();
            const app = document.getElementById('app');
            app.innerHTML = await this.render();
            this.mount();
        } else {
            alert('حدث خطأ أثناء الحذف');
        }
    }
}
