import { supabase, auth } from '../main.js';

export class CreateEventPage {
    async render() {
        const user = auth.getUser();

        return `
            <nav class="nav">
                <div class="nav-content">
                    <a href="#/" class="nav-logo">مبادرة قِمّة</a>
                    <div class="nav-menu">
                        <a href="#/dashboard" class="nav-link">لوحة التحكم</a>
                        <button class="btn btn-secondary" id="logoutBtn">تسجيل الخروج</button>
                    </div>
                </div>
            </nav>

            <section class="section">
                <div class="container" style="max-width: 800px;">
                    <a href="#/dashboard" class="btn btn-secondary" style="margin-bottom: 24px;">← العودة</a>

                    <div class="card">
                        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 32px;">إضافة فعالية جديدة</h1>

                        <form id="createEventForm">
                            <div class="form-group">
                                <label class="form-label">عنوان الفعالية *</label>
                                <input type="text" class="input" id="title" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label">وصف مختصر</label>
                                <input type="text" class="input" id="shortDescription" maxlength="500">
                                <small style="color: var(--neutral-500);">وصف قصير يظهر في بطاقة الفعالية</small>
                            </div>

                            <div class="form-group">
                                <label class="form-label">الوصف الكامل</label>
                                <textarea class="textarea" id="fullDescription" rows="6"></textarea>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                <div class="form-group">
                                    <label class="form-label">تاريخ البداية *</label>
                                    <input type="datetime-local" class="input" id="startDate" required>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">تاريخ النهاية *</label>
                                    <input type="datetime-local" class="input" id="endDate" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label">آخر موعد للتسجيل</label>
                                <input type="datetime-local" class="input" id="registrationDeadline">
                            </div>

                            <div class="form-group">
                                <label class="form-label">الموقع</label>
                                <input type="text" class="input" id="location" placeholder="مثال: الرياض، المملكة العربية السعودية">
                            </div>

                            <div class="form-group">
                                <label class="form-label">رابط التسجيل</label>
                                <input type="url" class="input" id="registrationLink" placeholder="https://...">
                            </div>

                            <div class="form-group">
                                <label class="form-label">رابط صورة الغلاف</label>
                                <input type="url" class="input" id="coverImage" placeholder="https://...">
                                <small style="color: var(--neutral-500);">رابط مباشر لصورة (يفضل من Pexels أو مصادر مجانية)</small>
                            </div>

                            <div class="form-group">
                                <label class="form-label">الحالة *</label>
                                <select class="select" id="status" required>
                                    <option value="draft">مسودة</option>
                                    <option value="published">نشر</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">الرؤية *</label>
                                <select class="select" id="visibility" required>
                                    <option value="public">عام</option>
                                    <option value="private">خاص</option>
                                </select>
                            </div>

                            <div id="errorMessage" class="error-message" style="display: none;"></div>
                            <div id="successMessage" class="success-message" style="display: none;"></div>

                            <div style="display: flex; gap: 16px; margin-top: 32px;">
                                <button type="submit" class="btn btn-primary" id="submitBtn" style="flex: 1;">
                                    إنشاء الفعالية
                                </button>
                                <a href="#/dashboard" class="btn btn-secondary">إلغاء</a>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        `;
    }

    mount() {
        const form = document.getElementById('createEventForm');
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        const submitBtn = document.getElementById('submitBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await auth.signOut();
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const user = auth.getUser();
            if (!user) {
                errorDiv.textContent = 'يجب تسجيل الدخول أولاً';
                errorDiv.style.display = 'block';
                return;
            }

            const eventData = {
                title: document.getElementById('title').value,
                short_description: document.getElementById('shortDescription').value,
                full_description: document.getElementById('fullDescription').value,
                start_date: document.getElementById('startDate').value,
                end_date: document.getElementById('endDate').value,
                registration_deadline: document.getElementById('registrationDeadline').value || null,
                location: document.getElementById('location').value,
                registration_link: document.getElementById('registrationLink').value,
                status: document.getElementById('status').value,
                visibility: document.getElementById('visibility').value,
                created_by: user.id
            };

            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.textContent = 'جاري الإنشاء...';

            try {
                const { data: event, error: eventError } = await supabase
                    .from('events')
                    .insert([eventData])
                    .select()
                    .single();

                if (eventError) throw eventError;

                const coverImageUrl = document.getElementById('coverImage').value;
                if (coverImageUrl && event) {
                    await supabase
                        .from('event_images')
                        .insert([{
                            event_id: event.id,
                            url: coverImageUrl,
                            is_cover: true
                        }]);
                }

                successDiv.textContent = 'تم إنشاء الفعالية بنجاح!';
                successDiv.style.display = 'block';

                setTimeout(() => {
                    window.location.hash = '#/dashboard';
                }, 1500);

            } catch (error) {
                console.error('Error creating event:', error);
                errorDiv.textContent = 'حدث خطأ أثناء إنشاء الفعالية. حاول مرة أخرى.';
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'إنشاء الفعالية';
            }
        });
    }
}
