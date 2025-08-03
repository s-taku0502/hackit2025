document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('forgot-password-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = form.elements.email.value;

        if (!email) {
            alert('メールアドレスを入力してください。');
            return;
        }

        window.sendPasswordReset(email)
            .then(() => {
                alert('パスワード再設定用のメールを送信しました。メールボックスを確認してください。');
                form.reset();
            })
            .catch((error) => {
                console.error('Password reset error', error);
                let errorMessage = 'メールの送信に失敗しました。';
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'そのメールアドレスは登録されていません。';
                }
                alert(errorMessage);
            });
    });
});
