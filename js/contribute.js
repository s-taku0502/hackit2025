window.onAuth(user => {
    if (!user) {
        // ユーザーがログインしていない場合はログインページにリダイレクト
        window.location.href = '/login.html';
    }
});

const form = document.getElementById('upload-form');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // デフォルトのフォーム送信をキャンセル

    const year = form.year.value;
    const subject = form.subject.value;
    const teacher = form.teacher.value;
    const file = form.file.files[0];

    if (!file) {
        alert('ファイルを選択してください。');
        return;
    }

    // アップロード中はボタンを無効化
    submitButton.disabled = true;
    submitButton.textContent = 'アップロード中...';

    try {
        await window.uploadPastPaper(year, subject, teacher, file);
        alert('過去問が正常にアップロードされました！');
        form.reset(); // フォームをリセット
    } catch (error) {
        console.error('アップロードに失敗しました:', error);
        alert(`アップロードに失敗しました: ${error.message}`);
    } finally {
        // ボタンを再度有効化
        submitButton.disabled = false;
        submitButton.textContent = 'アップロード';
    }
});
