export class AdminPortalPage {
    async render() {
        return `
            <div style="
                font-family: 'Tajawal', sans-serif;
                background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 50%, #d1d5db 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                direction: rtl;
                position: relative;
            ">
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, #4a9d4a 0%, #8b5a3c 50%, #c53030 100%);
                    opacity: 0.1;
                    z-index: -1;
                "></div>
                
                <div style="
                    background: white;
                    padding: 48px;
                    border-radius: 20px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
                    border: 1px solid #e5e7eb;
                    max-width: 450px;
                    width: 90%;
                    text-align: center;
                    position: relative;
                    backdrop-filter: blur(10px);
                ">
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 4px;
                        background: linear-gradient(90deg, #4a9d4a 0%, #8b5a3c 50%, #c53030 100%);
                        border-radius: 20px 20px 0 0;
                    "></div>
                    
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        margin-bottom: 16px;
                    ">
                        <img src="/qimmahlogo.png" alt="مبادرة قِمّة" style="height: 48px; width: auto;">
                    </div>
                    
                    <h1 style="margin-bottom: 8px; color: #374151; font-weight: 700;">دخول المدير</h1>
                    <p style="color: #6b7280; margin-bottom: 32px; font-size: 16px;">للوصول إلى لوحة التحكم والإدارة</p>
                    
                    <div style="
                        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                        color: #92400e;
                        padding: 20px;
                        border-radius: 12px;
                        margin-bottom: 24px;
                        font-size: 14px;
                        border: 1px solid #f59e0b;
                        font-weight: 500;
                    ">
                        🔐 هذه الصفحة مخصصة للمديرين فقط
                    </div>
                    
                    <a href="#/login" id="adminLoginBtn" style="
                        display: inline-block;
                        padding: 16px 32px;
                        background: linear-gradient(135deg, #4a9d4a 0%, #8b5a3c 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 12px;
                        font-weight: 600;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 4px 15px -3px rgba(74, 157, 74, 0.4);
                        margin-bottom: 16px;
                        width: 100%;
                        font-size: 16px;
                    ">
                        🚀 دخول لوحة التحكم
                    </a>
                    
                    <a href="#/register" id="adminRegisterBtn" style="
                        display: inline-block;
                        padding: 16px 32px;
                        background: linear-gradient(135deg, #c53030 0%, #8b5a3c 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 12px;
                        font-weight: 600;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 2px 10px -3px rgba(197, 48, 48, 0.3);
                        margin-bottom: 24px;
                        width: 100%;
                        font-size: 16px;
                    ">
                        ➕ إنشاء حساب مدير جديد
                    </a>
                    
                    <div style="
                        height: 1px;
                        background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
                        margin: 24px 0;
                    "></div>
                    
                    <p style="color: #6b7280; font-size: 14px;">
                        <a href="#/" style="
                            color: #4a9d4a;
                            text-decoration: none;
                            font-weight: 500;
                            transition: all 0.2s;
                        ">← العودة للموقع الرئيسي</a>
                    </p>
                </div>
            </div>
        `;
    }

    mount() {
        // Set admin access when buttons are clicked
        const adminLoginBtn = document.getElementById('adminLoginBtn');
        const adminRegisterBtn = document.getElementById('adminRegisterBtn');

        if (adminLoginBtn) {
            adminLoginBtn.addEventListener('click', () => {
                console.log('Admin login clicked - setting admin access');
                sessionStorage.setItem('adminAccess', 'true');
            });
        }

        if (adminRegisterBtn) {
            adminRegisterBtn.addEventListener('click', () => {
                console.log('Admin register clicked - setting admin access');
                sessionStorage.setItem('adminAccess', 'true');
            });
        }
    }
}