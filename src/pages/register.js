import { auth } from '../main.js';

export class RegisterPage {
    async render() {
        return `
            <nav class="nav">
                <div class="nav-content">
                    <a href="#/" class="nav-logo">
                        <img src="src/assets/qimmahlogo.png" alt="مبادرة قِمّة" class="logo">
                        <span>مبادرة قِمّة</span>
                    </a>
                    <div class="nav-menu">
                        <a href="#/" class="nav-link">الرئيسية</a>
                        <a href="#/events" class="nav-link">الفعاليات</a>
                    </div>
                </div>
            </nav>

            <div class="section">
                <div class="container" style="max-width: 500px;">
                    <div class="card">
                        <h1 style="text-align: center; margin-bottom: 32px;">إنشاء حساب جديد</h1>
                        <form id="registerForm">
                            <div class="form-group">
                                <label class="form-label">الاسم</label>
                                <input type="text" class="input" id="name" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">البريد الإلكتروني</label>
                                <input type="email" class="input" id="email" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">كلمة المرور</label>
                                <input type="password" class="input" id="password" required minlength="6">
                                <small style="color: var(--neutral-500);">يجب أن تكون 6 أحرف على الأقل</small>
                            </div>
                            <div class="form-group">
                                <label class="form-label">تأكيد كلمة المرور</label>
                                <input type="password" class="input" id="confirmPassword" required>
                            </div>
                            <div id="errorMessage" class="error-message" style="display: none;"></div>
                            <div id="successMessage" class="success-message" style="display: none;"></div>
                            <button type="submit" class="btn btn-primary" style="width: 100%;" id="submitBtn">
                                تسجيل
                            </button>
                        </form>
                        <p style="text-align: center; margin-top: 24px; color: var(--neutral-600);">
                            لديك حساب بالفعل؟ <a href="#/login" style="color: var(--primary);">سجل الدخول</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    mount() {
        const form = document.getElementById('registerForm');
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';

            if (password !== confirmPassword) {
                errorDiv.textContent = 'كلمات المرور غير متطابقة';
                errorDiv.style.display = 'block';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'جاري التسجيل...';

            try {
                await auth.signUp(email, password, name);
                successDiv.textContent = 'تم إنشاء الحساب بنجاح! جاري تسجيل الدخول...';
                successDiv.style.display = 'block';

                setTimeout(() => {
                    window.location.hash = '#/events';
                }, 1500);
            } catch (error) {
                let errorMessage = 'فشل إنشاء الحساب. حاول مرة أخرى.';
                if (error.message.includes('already registered')) {
                    errorMessage = 'البريد الإلكتروني مسجل بالفعل';
                }
                errorDiv.textContent = errorMessage;
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'تسجيل';
            }
        });
    }
}
