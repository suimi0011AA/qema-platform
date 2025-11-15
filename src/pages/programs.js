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
                    <a href="#/" class="nav-logo">مبادرة قِمّة</a>
                    <div class="nav-menu">
                        <a href="#/" class="nav-link">الرئيسية</a>
                        <a href="#/events" class="nav-link">الفعاليات</a>
                        <a href="#/programs" class="nav-link" style="color: var(--primary);">البرامج</a>
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
                    <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 32px;">البرامج</h1>

                    ${this.programs.length === 0 ? `
                        <div class="card" style="text-align: center; padding: 64px 32px;">
                            <div style="font-size: 64px; margin-bottom: 16px;">📚</div>
                            <h3 style="margin-bottom: 8px;">لا توجد برامج حاليًا</h3>
                            <p style="color: var(--neutral-600);">ترقبوا البرامج القادمة</p>
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
            <div class="card">
                <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 16px;">
                    <h3 style="font-size: 22px; font-weight: 600; flex: 1;">${program.title}</h3>
                    ${isActive ? '<span class="badge badge-success">نشط</span>' : ''}
                </div>
                <p style="color: var(--neutral-600); margin-bottom: 16px; line-height: 1.6;">
                    ${program.description || 'لا يوجد وصف'}
                </p>
                <div style="display: flex; gap: 8px; color: var(--neutral-500); font-size: 14px;">
                    <span>📅</span>
                    <span>${this.formatDate(startDate)} - ${this.formatDate(endDate)}</span>
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
