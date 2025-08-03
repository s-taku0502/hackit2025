// 新規登録フォーム専用のJavaScript
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;

    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // パスワードが一致するかリアルタイムでチェックし、不一致の場合はフォーム送信を無効化
    const validatePasswordMatch = () => {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('パスワードが一致しません。');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    };

    passwordInput.addEventListener('input', validatePasswordMatch);
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // フォームのネイティブバリデーションをチェック
        if (!signupForm.checkValidity()) {
            signupForm.reportValidity();
            return;
        }

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Firebaseの関数を呼び出す
        window.signupWithEmailPasswordAndSaveUser(email, password, username)
            .then(userCredential => {
                console.log('signup successful', userCredential);
                alert('新規登録が完了しました。ログインページに移動します。');
                window.location.href = '/login.html';
            })
            .catch(error => {
                console.error('signup error', error);
                alert('登録に失敗しました: ' + error.message);
            });
    });
});