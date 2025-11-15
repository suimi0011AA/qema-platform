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
                    <a href="#/" class="nav-logo">مبادرة قِمّة</a>
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
                            <h1 style="font-size: 32px; font-weight: 700;">لوحة التحكم</h1>
                            <p style="color: var(--neutral-600); margin-top: 8px;">مرحبًا، ${user?.user_metadata?.name || user?.email}</p>
                        </div>
                        <a href="#/create-event" class="btn btn-primary">إضافة فعالية جديدة</a>
                    </div>

                    <div class="grid grid-3" style="margin-bottom: 32px;">
                        <div class="card" style="text-align: center;">
                            <div style="font-size: 36px; font-weight: 700; color: var(--primary); margin-bottom: 8px;">
                                ${this.stats.total}
                            </div>
                            <div style="color: var(--neutral-600);">إجمالي الفعاليات</div>
                        </div>
                        <div class="card" style="text-align: center;">
                            <div style="font-size: 36px; font-weight: 700; color: var(--success); margin-bottom: 8px;">
                                ${this.stats.published}
                            </div>
                            <div style="color: var(--neutral-600);">منشورة</div>
                        </div>
                        <div class="card" style="text-align: center;">
                            <div style="font-size: 36px; font-weight: 700; color: var(--warning); margin-bottom: 8px;">
                                ${this.stats.draft}
                            </div>
                            <div style="color: var(--neutral-600);">مسودات</div>
                        </div>
                    </div>

                    <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">فعالياتي</h2>

                    ${this.myEvents.length === 0 ? `
                        <div class="card" style="text-align: center; padding: 64px 32px;">
                            <div style="font-size: 64px; margin-bottom: 16px;">📝</div>
                            <h3 style="margin-bottom: 8px;">لم تقم بإنشاء أي فعالية بعد</h3>
                            <p style="color: var(--neutral-600); margin-bottom: 24px;">ابدأ بإنشاء فعاليتك الأولى</p>
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
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                    <h3 style="font-size: 20px; font-weight: 600; flex: 1;">${event.title}</h3>
                    <span class="badge ${statusColors[event.status]}">${statusLabels[event.status]}</span>
                </div>
                <p style="color: var(--neutral-600); margin-bottom: 16px; line-height: 1.5;">
                    ${event.short_description || 'لا يوجد وصف'}
                </p>
                <div style="display: flex; gap: 8px; color: var(--neutral-500); font-size: 14px; margin-bottom: 16px;">
                    <span>📅</span>
                    <span>${this.formatDate(startDate)}</span>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary" onclick="window.location.hash='#/events/${event.id}'" style="flex: 1;">
                        عرض
                    </button>
                    <button class="btn btn-primary" data-edit-event="${event.id}" style="flex: 1;">
                        تعديل
                    </button>
                    <button class="btn" data-delete-event="${event.id}"
                            style="background: var(--error); color: white;">
                        حذف
                    </button>
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
                const eventId = e.target.dataset.deleteEvent;
                if (confirm('هل أنت متأكد من حذف هذه الفعالية؟')) {
                    await this.deleteEvent(eventId);
                }
            });
        });

        document.querySelectorAll('[data-edit-event]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = e.target.dataset.editEvent;
                alert('ميزة التعديل قيد التطوير');
            });
        });
    }

    async deleteEvent(eventId) {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId);

        if (!error) {
            window.location.reload();
        } else {
            alert('حدث خطأ أثناء الحذف');
        }
    }
}
