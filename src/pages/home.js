import { auth } from '../main.js';

export class HomePage {
    async render() {
        const user = auth.getUser();

        return `
            <nav class="nav">
                <div class="nav-content">
                    <a href="#/" class="nav-logo">
                        <img src="/src/assets/qimmahlogo.png" alt="مبادرة قِمّة" class="logo">
                    </a>
                    <div class="nav-menu">
                        <a href="#/" class="nav-link">الرئيسية</a>
                        <a href="#/events" class="nav-link">الفعاليات</a>
                        <a href="#/programs" class="nav-link">البرامج</a>
                        ${user ? `
                            <a href="#/dashboard" class="nav-link">لوحة التحكم</a>
                            <button class="btn btn-secondary" id="logoutBtn">تسجيل الخروج</button>
                        ` : ''}
                    </div>
                </div>
            </nav>

            <section class="hero-brand">
                <div class="container">
                    <h1>مرحبًا بك في مبادرة قِمّة</h1>
                    <p>منصة موحدة لجميع الفعاليات التقنية والتعليمية - هاكاثونات، مؤتمرات، معارض، ودورات</p>
                    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                        <a href="#/events" class="btn" style="background: white; color: var(--brand-green);">استكشف الفعاليات</a>
                    </div>
                </div>
            </section>

            <section class="section">
                <div class="container">
                    <h2 class="section-title">لماذا مبادرة قِمّة؟</h2>
                    <div class="grid grid-3">
                        <div class="card" style="text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 16px;">🎯</div>
                            <h3 style="margin-bottom: 8px;">منصة موحدة</h3>
                            <p style="color: var(--neutral-600);">جميع الفعاليات في مكان واحد سهل الوصول</p>
                        </div>
                        <div class="card" style="text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                            <h3 style="margin-bottom: 8px;">بحث وفلترة متقدمة</h3>
                            <p style="color: var(--neutral-600);">ابحث عن الفعاليات المناسبة لك بسهولة</p>
                        </div>
                        <div class="card" style="text-align: center;">
                            <div style="font-size: 48px; margin-bottom: 16px;">📅</div>
                            <h3 style="margin-bottom: 8px;">تقويم تفاعلي</h3>
                            <p style="color: var(--neutral-600);">تابع الفعاليات القادمة ولا تفوت أي فرصة</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section" style="background: white;">
                <div class="container">
                    <h2 class="section-title">أنواع الفعاليات</h2>
                    <div class="grid grid-2">
                        <div class="card">
                            <h3 style="color: var(--primary); margin-bottom: 8px;">هاكاثونات</h3>
                            <p style="color: var(--neutral-600);">مسابقات برمجية ومشاريع تقنية مبتكرة</p>
                        </div>
                        <div class="card">
                            <h3 style="color: var(--primary); margin-bottom: 8px;">مؤتمرات</h3>
                            <p style="color: var(--neutral-600);">لقاءات ومحاضرات من خبراء المجال</p>
                        </div>
                        <div class="card">
                            <h3 style="color: var(--primary); margin-bottom: 8px;">معارض</h3>
                            <p style="color: var(--neutral-600);">عرض المشاريع والابتكارات التقنية</p>
                        </div>
                        <div class="card">
                            <h3 style="color: var(--primary); margin-bottom: 8px;">دورات تدريبية</h3>
                            <p style="color: var(--neutral-600);">ورش عمل وبرامج تطوير المهارات</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section">
                <div class="container" style="text-align: center;">
                    <h2 class="section-title">ابدأ رحلتك معنا</h2>
                    <p style="font-size: 18px; color: var(--neutral-600); margin-bottom: 32px;">
                        انضم إلى مجتمع قِمّة واستكشف أفضل الفعاليات التقنية
                    </p>
                    <a href="#/events" class="btn btn-primary" style="font-size: 18px;">استعرض الفعاليات الآن</a>
                </div>
            </section>

            <footer class="footer" style="padding: 32px 24px; text-align: center;">
                <div class="container">
                    <p>&copy; 2024 مبادرة قِمّة. جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        `;
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
