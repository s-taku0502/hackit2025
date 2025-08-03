// ログインフォーム専用のJavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
        console.error('Login form with id "login-form" not found.');
        return;
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = loginForm.elements.email.value;
        const password = loginForm.elements.password.value;

        if (!email || !password) {
            alert('メールアドレスとパスワードを入力してください。');
            return;
        }

        window.signInWithEmailPassword(email, password)
            .then((userCredential) => {
                console.log('Login successful', userCredential.user);
                alert('ログインしました！');
                window.location.href = '/index.html';
            })
            .catch((error) => {
                console.error('Login error', error);
                let errorMessage = 'ログインに失敗しました。';
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        errorMessage = 'メールアドレスまたはパスワードが間違っています。';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'メールアドレスの形式が正しくありません。';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'このアカウントは無効化されています。';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = '試行回数が多すぎます。後でもう一度お試しください。';
                        break;
                    default:
                        errorMessage = 'エラーが発生しました。しばらくしてから再度お試しください。';
                }
                alert(errorMessage);
            });
    });
});