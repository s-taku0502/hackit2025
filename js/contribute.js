window.onAuth(user => {
    if (!user) {
        // ユーザーがログインしていない場合はログインページにリダイレクト
        window.location.href = '/login.html';
    }
});

const form = document.getElementById('upload-form');
const submitButton = form.querySelector('button[type="submit"]');

// メッセージ表示用要素をフォーム内に追加
let messageDiv = form.querySelector('.form-message');
if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    form.insertBefore(messageDiv, form.firstChild);
}

function showMessage(msg, type = 'error') {
    messageDiv.textContent = msg;
    messageDiv.style.display = 'block';
    messageDiv.style.color = type === 'error' ? 'red' : 'green';
}

function clearMessage() {
    messageDiv.textContent = '';
    messageDiv.style.display = 'none';
}

// バリデーション用のヘルパー関数
function validateForm(year, subject, file) {
    if (!year) {
        showMessage('年度を入力してください。', 'error');
        return false;
    }
    if (!subject) {
        showMessage('科目名を入力してください。', 'error');
        return false;
    }
    if (!file) {
        showMessage('ファイルを選択してください。', 'error');
        return false;
    }
    return true;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // デフォルトのフォーム送信をキャンセル

    clearMessage();

    const year = form.year.value;
    const subject = form.subject.value;
    const teacher = form.teacher.value;
    const file = form.file.files[0];

    if (!validateForm(year, subject, file)) {
        return;
    }

    // アップロード中はボタンを無効化
    submitButton.disabled = true;
    submitButton.textContent = 'アップロード中...';

    try {
        await window.uploadPastPaper(year, subject, teacher, file);
        showMessage('過去問が正常にアップロードされました！', 'success');
        form.reset(); // フォームをリセット
    } catch (error) {
        console.error('アップロードに失敗しました:', error);
        showMessage(`アップロードに失敗しました: ${error.message}`, 'error');
    } finally {
        // ボタンを再度有効化
        submitButton.disabled = false;
        submitButton.textContent = 'アップロード';
    }
});
