// ログインフォーム専用のJavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // エラーメッセージ表示用の要素を作成
    function createErrorMessage(id, message) {
        const existingError = document.getElementById(id);
        if (existingError) {
            existingError.textContent = message;
            return existingError;
        }
        
        const errorElement = document.createElement('div');
        errorElement.id = id;
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '5px';
        return errorElement;
    }
    
    // エラーメッセージを削除
    function removeErrorMessage(id) {
        const errorElement = document.getElementById(id);
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // ログインフォーム送信時のバリデーション
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            
            let hasErrors = false;
            
            // ユーザー名チェック
            if (username.length < 3) {
                const errorMessage = createErrorMessage('username-error', 'ユーザー名は3文字以上で入力してください');
                const usernameGroup = usernameInput.closest('.form-group');
                if (!document.getElementById('username-error')) {
                    usernameGroup.appendChild(errorMessage);
                }
                usernameInput.style.borderColor = '#e74c3c';
                hasErrors = true;
            } else {
                removeErrorMessage('username-error');
                usernameInput.style.borderColor = '#27ae60';
            }
            
            // パスワードチェック
            if (password.length < 6) {
                const errorMessage = createErrorMessage('password-error', 'パスワードは6文字以上で入力してください');
                const passwordGroup = passwordInput.closest('.form-group');
                if (!document.getElementById('password-error')) {
                    passwordGroup.appendChild(errorMessage);
                }
                passwordInput.style.borderColor = '#e74c3c';
                hasErrors = true;
            } else {
                removeErrorMessage('password-error');
                passwordInput.style.borderColor = '#27ae60';
            }
            
            // エラーがある場合は送信を中止
            if (hasErrors) {
                event.preventDefault();
                
                // 最初のエラー要素にスクロール
                const firstError = document.querySelector('.error-message');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                showFormFeedback('入力内容を確認してください', 'error');
            } else {
                showFormFeedback('ログイン中...', 'success');
            }
        });
    }
    
    // フィードバック表示機能
    function showFormFeedback(message, type) {
        const existingFeedback = document.querySelector('.form-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        const feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        feedback.textContent = message;
        feedback.style.padding = '10px';
        feedback.style.borderRadius = '5px';
        feedback.style.margin = '10px 0';
        feedback.style.textAlign = 'center';
        feedback.style.fontWeight = 'bold';
        
        if (type === 'error') {
            feedback.style.backgroundColor = '#f8d7da';
            feedback.style.color = '#721c24';
            feedback.style.border = '1px solid #f5c6cb';
        } else if (type === 'success') {
            feedback.style.backgroundColor = '#d4edda';
            feedback.style.color = '#155724';
            feedback.style.border = '1px solid #c3e6cb';
        }
        
        const form = document.querySelector('.login-form');
        form.parentNode.insertBefore(feedback, form);
        
        if (type === 'success') {
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.remove();
                }
            }, 3000);
        }
    }
    
    // Enterキーでフォーム送信
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (document.activeElement === usernameInput || document.activeElement === passwordInput)) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});