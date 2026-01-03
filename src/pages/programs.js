import { supabase, auth } from '../main.js';

export class ProgramsPage {
    constructor() {
        this.programs = [];
    }

    async render() {
        await this.loadPrograms();
        const user = auth.getUser();

        return `
            <nav class="nav">
                <div class="nav-content">
                    <a href="#/" class="nav-logo">
                        <img src="/public/qimmahlogo.png" alt="مبادرة قِمّة" class="logo">
                    </a>
                    <div class="nav-menu">
                        <a href="#/" class="nav-link">الرئيسية</a>
                        <a href="#/events" class="nav-link">الفعاليات</a>
                        <a href="#/programs" class="nav-link" style="color: var(--primary);">البرامج</a>
                        ${user ? `
                            <a href="#/dashboard" class="nav-link">لوحة التحكم</a>
                            <button class="btn btn-secondary" id="logoutBtn">تسجيل الخروج</button>
                        ` : ''}
                    </div>
                </div>
            </nav>

            <section class="section">
                <div class="container">
                    <h1 class="heading-primary" style="font-size: 32px; margin-bottom: 32px;">البرامج</h1>

                    ${this.programs.length === 0 ? `
                        <div class="card shadow-soft" style="text-align: center; padding: 64px 32px; background: var(--gray-50);">
                            <div style="font-size: 64px; margin-bottom: 16px;">📚</div>
                            <h3 class="heading-secondary" style="margin-bottom: 8px;">لا توجد برامج حاليًا</h3>
                            <p class="text-muted">ترقبوا البرامج القادمة</p>
                        </div>
                    ` : `
                        <div class="grid grid-2">
                            ${this.programs.map(program => this.renderProgramCard(program)).join('')}
                        </div>
                    `}
                </div>
            </section>
        `;
    }

    renderProgramCard(program) {
        const startDate = new Date(program.start_date);
        const endDate = new Date(program.end_date);
        const now = new Date();
        const isActive = startDate <= now && endDate >= now;

        return `
            <div class="event-card">
                <div style="padding: var(--spacing-xl);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
                        <h3 class="heading-secondary" style="font-size: 22px; flex: 1;">${program.title}</h3>
                        ${isActive ? '<span class="badge badge-success">نشط</span>' : '<span class="badge" style="background: var(--gray-100); color: var(--gray-600);">مجدول</span>'}
                    </div>
                    <p class="text-secondary" style="margin-bottom: 16px; line-height: 1.6;">
                        ${program.description || 'لا يوجد وصف'}
                    </p>
                    <div style="display: flex; gap: 8px; margin-bottom: 16px;" class="text-muted">
                        <span>📅</span>
                        <span>${this.formatDate(startDate)} - ${this.formatDate(endDate)}</span>
                    </div>
                    <div style="padding-top: 16px; border-top: 1px solid var(--gray-200);">
                        <div style="display: flex; gap: 8px; align-items: center;" class="text-small">
                            <span style="color: var(--gray-400);">🎯</span>
                            <span style="color: var(--gray-500);">برنامج تدريبي متخصص</span>
                        </div>
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

    async loadPrograms() {
        const { data, error } = await supabase
            .from('programs')
            .select('*')
            .order('start_date', { ascending: false });

        if (!error && data) {
            this.programs = data;
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
