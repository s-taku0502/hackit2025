document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('forgot-password-form');
    if (!form) return;

    const messageContainer = document.createElement('div');
    form.prepend(messageContainer);

    function showMessage(message, isError = false) {
        messageContainer.innerHTML = `<p style="color: ${isError ? '#e74c3c' : '#27ae60'}; text-align: center; margin-bottom: 15px;">${message}</p>`;
    }

    function clearMessage() {
        messageContainer.innerHTML = '';
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearMessage();
        const email = form.elements.email.value;

        if (!email) {
            showMessage('メールアドレスを入力してください。', true);
            return;
        }

        window.sendPasswordReset(email)
            .then(() => {
                showMessage('パスワード再設定用のメールを送信しました。メールボックスを確認してください。');
                form.reset();
            })
            .catch((error) => {
                console.error('Password reset error', error);
                let errorMessage = 'メールの送信に失敗しました。';
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'そのメールアドレスは登録されていません。';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'メールアドレスの形式が正しくありません。';
                }
                showMessage(errorMessage, true);
            });
    });
});