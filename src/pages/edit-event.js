import { supabase, auth } from '../main.js';

export class EditEventPage {
    constructor(params) {
        this.eventId = params.id;
        this.event = null;
        this.organizations = [];
        this.venues = [];
    }

    async render() {
        await this.loadData();
        
        if (!this.event) {
            return `
                <div class="section">
                    <div class="container">
                        <div class="card" style="text-align: center; padding: 64px 32px;">
                            <h1>الفعالية غير موجودة</h1>
                            <p style="color: var(--gray-600); margin: 16px 0;">لم يتم العثور على الفعالية المطلوبة</p>
                            <a href="#/dashboard" class="btn btn-primary">العودة للوحة التحكم</a>
                        </div>
                    </div>
                </div>
            `;
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
                        <a href="#/dashboard" class="nav-link">لوحة التحكم</a>
                        <button class="btn btn-secondary" id="logoutBtn">تسجيل الخروج</button>
                    </div>
                </div>
            </nav>

            <section class="section">
                <div class="container" style="max-width: 800px;">
                    <div style="margin-bottom: 32px;">
                        <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">تعديل الفعالية</h1>
                        <p style="color: var(--gray-600);">قم بتعديل تفاصيل الفعالية</p>
                    </div>

                    <form id="editEventForm" class="card">
                        <div class="form-group">
                            <label class="form-label">عنوان الفعالية *</label>
                            <input type="text" class="input" id="title" value="${this.event.title}" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label">وصف مختصر</label>
                            <textarea class="textarea" id="shortDescription" placeholder="وصف مختصر للفعالية">${this.event.short_description || ''}</textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label">الوصف الكامل</label>
                            <textarea class="textarea" id="fullDescription" placeholder="الوصف الكامل للفعالية" style="min-height: 150px;">${this.event.full_description || ''}</textarea>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">تاريخ البداية *</label>
                                <input type="datetime-local" class="input" id="startDate" value="${this.formatDateForInput(this.event.start_date)}" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">تاريخ النهاية *</label>
                                <input type="datetime-local" class="input" id="endDate" value="${this.formatDateForInput(this.event.end_date)}" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">الموقع</label>
                            <input type="text" class="input" id="location" value="${this.event.location || ''}" placeholder="موقع الفعالية">
                        </div>

                        <div class="form-group">
                            <label class="form-label">رابط التسجيل</label>
                            <input type="url" class="input" id="registrationLink" value="${this.event.registration_link || ''}" placeholder="https://example.com/register">
                        </div>

                        <div class="form-group">
                            <label class="form-label">آخر موعد للتسجيل</label>
                            <input type="datetime-local" class="input" id="registrationDeadline" value="${this.event.registration_deadline ? this.formatDateForInput(this.event.registration_deadline) : ''}">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">حالة الفعالية</label>
                                <select class="select" id="status">
                                    <option value="draft" ${this.event.status === 'draft' ? 'selected' : ''}>مسودة</option>
                                    <option value="published" ${this.event.status === 'published' ? 'selected' : ''}>منشورة</option>
                                    <option value="archived" ${this.event.status === 'archived' ? 'selected' : ''}>مؤرشفة</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">الرؤية</label>
                                <select class="select" id="visibility">
                                    <option value="public" ${this.event.visibility === 'public' ? 'selected' : ''}>عامة</option>
                                    <option value="private" ${this.event.visibility === 'private' ? 'selected' : ''}>خاصة</option>
                                </select>
                            </div>
                        </div>

                        <div id="errorMessage" class="error-message" style="display: none;"></div>
                        <div id="successMessage" class="success-message" style="display: none;"></div>

                        <div style="display: flex; gap: 16px; margin-top: 32px;">
                            <button type="submit" class="btn btn-primary" id="submitBtn" style="flex: 1;">
                                حفظ التغييرات
                            </button>
                            <a href="#/dashboard" class="btn btn-secondary" style="flex: 1; text-align: center; text-decoration: none;">
                                إلغاء
                            </a>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }

    formatDateForInput(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    }

    async loadData() {
        const user = auth.getUser();
        if (!user) {
            window.location.hash = '#/login';
            return;
        }

        // Load the event
        const { data: event, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', this.eventId)
            .eq('created_by', user.id)
            .single();

        if (!error && event) {
            this.event = event;
        }
    }

    mount() {
        const form = document.getElementById('editEventForm');
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        const submitBtn = document.getElementById('submitBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await auth.signOut();
            });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const formData = {
                    title: document.getElementById('title').value,
                    short_description: document.getElementById('shortDescription').value,
                    full_description: document.getElementById('fullDescription').value,
                    start_date: document.getElementById('startDate').value,
                    end_date: document.getElementById('endDate').value,
                    location: document.getElementById('location').value,
                    registration_link: document.getElementById('registrationLink').value,
                    registration_deadline: document.getElementById('registrationDeadline').value || null,
                    status: document.getElementById('status').value,
                    visibility: document.getElementById('visibility').value,
                    updated_at: new Date().toISOString()
                };

                errorDiv.style.display = 'none';
                successDiv.style.display = 'none';

                if (new Date(formData.start_date) >= new Date(formData.end_date)) {
                    errorDiv.textContent = 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية';
                    errorDiv.style.display = 'block';
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.textContent = 'جاري الحفظ...';

                try {
                    const { error } = await supabase
                        .from('events')
                        .update(formData)
                        .eq('id', this.eventId);

                    if (error) throw error;

                    successDiv.textContent = 'تم حفظ التغييرات بنجاح!';
                    successDiv.style.display = 'block';

                    setTimeout(() => {
                        window.location.hash = '#/dashboard';
                    }, 1500);

                } catch (error) {
                    errorDiv.textContent = 'حدث خطأ أثناء حفظ التغييرات. حاول مرة أخرى.';
                    errorDiv.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'حفظ التغييرات';
                }
            });
        }
    }
}