// 新規登録フォーム専用のJavaScript
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
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
    
    // パスワード一致チェック（リアルタイム）
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword === '') {
            removeErrorMessage('password-match-error');
            return;
        }
        
        if (password !== confirmPassword) {
            const errorMessage = createErrorMessage('password-match-error', 'パスワードが一致しません');
            const confirmPasswordGroup = confirmPasswordInput.closest('.form-group');
            if (!document.getElementById('password-match-error')) {
                confirmPasswordGroup.appendChild(errorMessage);
            }
            confirmPasswordInput.style.borderColor = '#e74c3c';
        } else {
            removeErrorMessage('password-match-error');
            confirmPasswordInput.style.borderColor = '#27ae60';
        }
    }
    
    // パスワード強度チェック
    function checkPasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        if (password.length < minLength) {
            return 'パスワードは8文字以上で入力してください';
        }
        
        let strength = 0;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumbers) strength++;
        if (hasSpecialChar) strength++;
        
        if (strength < 2) {
            return 'パスワードには英数字を組み合わせてください';
        }
        
        return null; // エラーなし
    }
    
    // パスワード入力時のリアルタイムチェック
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthError = checkPasswordStrength(password);
            
            if (strengthError) {
                const errorMessage = createErrorMessage('password-strength-error', strengthError);
                const passwordGroup = this.closest('.form-group');
                if (!document.getElementById('password-strength-error')) {
                    passwordGroup.appendChild(errorMessage);
                }
                this.style.borderColor = '#e74c3c';
            } else {
                removeErrorMessage('password-strength-error');
                this.style.borderColor = '#27ae60';
            }
            
            // パスワード確認フィールドがある場合はマッチチェックも実行
            if (confirmPasswordInput && confirmPasswordInput.value !== '') {
                checkPasswordMatch();
            }
        });
    }
    
    // パスワード確認入力時のリアルタイムチェック
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }
    
    // フォーム送信時のバリデーション
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const termsCheckbox = document.getElementById('terms');
            
            let hasErrors = false;
            
            // ユーザー名チェック
            if (username.length < 3) {
                const errorMessage = createErrorMessage('username-error', 'ユーザー名は3文字以上で入力してください');
                const usernameGroup = document.getElementById('username').closest('.form-group');
                if (!document.getElementById('username-error')) {
                    usernameGroup.appendChild(errorMessage);
                }
                hasErrors = true;
            } else {
                removeErrorMessage('username-error');
            }
            
            // メールアドレスチェック
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const errorMessage = createErrorMessage('email-error', '正しいメールアドレスを入力してください');
                const emailGroup = document.getElementById('email').closest('.form-group');
                if (!document.getElementById('email-error')) {
                    emailGroup.appendChild(errorMessage);
                }
                hasErrors = true;
            } else {
                removeErrorMessage('email-error');
            }
            
            // パスワード強度チェック
            const strengthError = checkPasswordStrength(password);
            if (strengthError) {
                const errorMessage = createErrorMessage('password-strength-error', strengthError);
                const passwordGroup = passwordInput.closest('.form-group');
                if (!document.getElementById('password-strength-error')) {
                    passwordGroup.appendChild(errorMessage);
                }
                hasErrors = true;
            }
            
            // パスワード一致チェック
            if (password !== confirmPassword) {
                const errorMessage = createErrorMessage('password-match-error', 'パスワードが一致しません');
                const confirmPasswordGroup = confirmPasswordInput.closest('.form-group');
                if (!document.getElementById('password-match-error')) {
                    confirmPasswordGroup.appendChild(errorMessage);
                }
                hasErrors = true;
            }
            
            // 利用規約チェック
            if (termsCheckbox && !termsCheckbox.checked) {
                const errorMessage = createErrorMessage('terms-error', '利用規約に同意してください');
                const termsGroup = termsCheckbox.closest('.form-group');
                if (!document.getElementById('terms-error')) {
                    termsGroup.appendChild(errorMessage);
                }
                hasErrors = true;
            } else {
                removeErrorMessage('terms-error');
            }
            
            // エラーがある場合は送信を中止
            if (hasErrors) {
                event.preventDefault();
                
                // 最初のエラー要素にスクロール
                const firstError = document.querySelector('.error-message');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // フィードバック表示
                showFormFeedback('入力内容を確認してください', 'error');
            } else {
                // 成功フィードバック
                showFormFeedback('登録情報を送信中...', 'success');
            }
        });
    }
    
    // フィードバック表示機能
    function showFormFeedback(message, type) {
        // 既存のフィードバック要素を削除
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
        
        const form = document.querySelector('.signup-form');
        form.parentNode.insertBefore(feedback, form);
        
        // 3秒後に自動削除（成功メッセージの場合）
        if (type === 'success') {
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.remove();
                }
            }, 3000);
        }
    }
});