import { auth } from '../main.js';

export class LoginPage {
    async render() {
        return `
            <nav class="nav">
                <div class="nav-content">
                    <a href="#/" class="nav-logo">
                        <img src="/public/qimmahlogo.png" alt="مبادرة قِمّة" class="logo">
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
                        <h1 style="text-align: center; margin-bottom: 32px;">تسجيل الدخول</h1>
                        <form id="loginForm">
                            <div class="form-group">
                                <label class="form-label">البريد الإلكتروني</label>
                                <input type="email" class="input" id="email" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">كلمة المرور</label>
                                <input type="password" class="input" id="password" required>
                            </div>
                            <div id="errorMessage" class="error-message" style="display: none;"></div>
                            <button type="submit" class="btn btn-primary" style="width: 100%;" id="submitBtn">
                                دخول
                            </button>
                        </form>
                        <p style="text-align: center; margin-top: 24px; color: var(--neutral-600);">
                            ليس لديك حساب؟ <a href="#/register" style="color: var(--primary);">سجل الآن</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    mount() {
        const form = document.getElementById('loginForm');
        const errorDiv = document.getElementById('errorMessage');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            submitBtn.disabled = true;
            submitBtn.textContent = 'جاري الدخول...';
            errorDiv.style.display = 'none';

            try {
                await auth.signIn(email, password);
            } catch (error) {
                errorDiv.textContent = 'فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.';
                errorDiv.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'دخول';
            }
        });
    }
}
