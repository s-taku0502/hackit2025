// 新規登録フォーム専用のJavaScript
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;

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
            confirmPasswordInput.style.borderColor = '';
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
    
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // 既存のフォーム全体のエラーをクリア
        removeErrorMessage('form-api-error');
        
        // 各フィールドの既存エラーメッセージもクリア
        removeErrorMessage('username-error');
        removeErrorMessage('email-error');
        removeErrorMessage('password-strength-error');
        removeErrorMessage('password-match-error');
        removeErrorMessage('terms-error');

        let hasErrors = false;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const termsCheckbox = document.getElementById('terms');

        // 各フィールドのバリデーションを実行し、具体的なエラーメッセージを表示
        if (username.length < 3) {
            hasErrors = true;
            const usernameGroup = document.getElementById('username').closest('.form-group');
            const errorMessage = createErrorMessage('username-error', 'ユーザー名は3文字以上で入力してください');
            usernameGroup.appendChild(errorMessage);
            document.getElementById('username').style.borderColor = '#e74c3c';
        } else {
            document.getElementById('username').style.borderColor = '';
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            hasErrors = true;
            const emailGroup = document.getElementById('email').closest('.form-group');
            const errorMessage = createErrorMessage('email-error', '正しいメールアドレス形式で入力してください');
            emailGroup.appendChild(errorMessage);
            document.getElementById('email').style.borderColor = '#e74c3c';
        } else {
            document.getElementById('email').style.borderColor = '';
        }
        
        if (checkPasswordStrength(password)) {
            hasErrors = true;
            // パスワード強度チェック関数が既にエラーメッセージを表示するので、ここでは追加処理不要
        }
        
        if (password !== confirmPassword) {
            hasErrors = true;
            const confirmPasswordGroup = confirmPasswordInput.closest('.form-group');
            const errorMessage = createErrorMessage('password-match-error', 'パスワードが一致しません');
            confirmPasswordGroup.appendChild(errorMessage);
            confirmPasswordInput.style.borderColor = '#e74c3c';
        } else if (confirmPassword !== '') {
            confirmPasswordInput.style.borderColor = '';
        }
        
        if (!termsCheckbox.checked) {
            hasErrors = true;
            const termsGroup = termsCheckbox.closest('.form-group');
            const errorMessage = createErrorMessage('terms-error', '利用規約に同意してください');
            termsGroup.appendChild(errorMessage);
        }

        if (hasErrors) {
            return;
        }

        // Firebaseの関数を呼び出す
        window.signupWithEmailPasswordAndSaveUser(email, password, username)
            .then(userCredential => {
                console.log('signup successful', userCredential);
                
                // 成功メッセージを表示
                const successMessage = createErrorMessage('form-api-success', '新規登録が完了しました。2秒後にログインページに移動します。');
                successMessage.style.color = '#27ae60';
                successMessage.style.textAlign = 'center';
                signupForm.prepend(successMessage);

                // フォームを無効化
                Array.from(signupForm.elements).forEach(el => el.disabled = true);

                // 2秒後にリダイレクト
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 2000);
            })
            .catch(error => {
                console.error('signup error', error);
                let errorMessageText = '登録に失敗しました。';
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessageText = 'このメールアドレスは既に使用されています。';
                        break;
                    case 'auth/invalid-email':
                        errorMessageText = 'メールアドレスの形式が正しくありません。';
                        break;
                    case 'auth/weak-password':
                        errorMessageText = 'パスワードが弱すぎます。もっと複雑なパスワードを設定してください。';
                        break;
                    default:
                        errorMessageText = '登録中にエラーが発生しました。しばらくしてから再度お試しください。';
                }
                const errorMessage = createErrorMessage('form-api-error', errorMessageText);
                errorMessage.style.textAlign = 'center';
                signupForm.prepend(errorMessage);
            });
    });
});