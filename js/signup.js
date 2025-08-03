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

        let hasErrors = false;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const termsCheckbox = document.getElementById('terms');

        // 各フィールドのバリデーションを実行
        if (username.length < 3) {
            hasErrors = true;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            hasErrors = true;
        }
        if (checkPasswordStrength(password)) {
            hasErrors = true;
        }
        if (password !== confirmPassword) {
            hasErrors = true;
        }
        if (!termsCheckbox.checked) {
            hasErrors = true;
        }

        if (hasErrors) {
            alert('入力内容に誤りがあります。各項目のエラーメッセージを確認してください。');
            return;
        }

        // Firebaseの関数を呼び出す
        window.signupWithEmailPasswordAndSaveUser(email, password, username)
            .then(userCredential => {
                console.log('signup successful', userCredential);
                alert('新規登録が完了しました。ログインページに移動します。');
                window.location.href = '/login.html';
            })
            .catch(error => {
                console.error('signup error', error);
                let errorMessage = '登録に失敗しました。';
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'このメールアドレスは既に使用されています。';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'メールアドレスの形式が正しくありません。';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'パスワードが弱すぎます。もっと複雑なパスワードを設定してください。';
                        break;
                    default:
                        errorMessage = '登録中にエラーが発生しました。しばらくしてから再度お試しください。';
                }
                alert(errorMessage);
            });
    });
});