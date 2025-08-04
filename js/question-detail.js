document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const questionId = params.get('id');

    if (!questionId) {
        document.body.innerHTML = '<h1>質問IDが指定されていません。</h1>';
        return;
    }

    const questionContainer = document.getElementById('question-detail-container');
    const commentsContainer = document.getElementById('comments-container');
    const commentForm = document.getElementById('comment-form');

    const userCache = new Map();
    async function getUserName(uid) {
        if (userCache.has(uid)) return userCache.get(uid);
        try {
            const userProfile = await window.getUserProfile(uid);
            const username = userProfile.exists() ? userProfile.data().username : '匿名ユーザー';
            userCache.set(uid, username);
            return username;
        } catch (e) {
            return '匿名ユーザー';
        }
    }

    async function loadQuestion() {
        const docSnap = await window.getQuestionById(questionId);
        if (!docSnap.exists()) {
            questionContainer.innerHTML = '<h1>質問が見つかりません。</h1>';
            return;
        }
        const question = docSnap.data();
        const authorName = await getUserName(question.user);
        questionContainer.innerHTML = `
            <h1>${question.title}</h1>
            <p><strong>課程:</strong> ${question.course_label}</p>
            <p><strong>投稿者:</strong> ${authorName}</p>
            <p><strong>投稿日時:</strong> ${question.date.toDate().toLocaleString()}</p>
            <hr>
            <p>${question.content.replace(/\n/g, '<br>')}</p>
        `;
    }

    async function loadComments() {
        const snapshot = await window.getCommentsForQuestion(questionId);
        commentsContainer.innerHTML = '';
        if (snapshot.empty) {
            commentsContainer.innerHTML = '<p>まだコメントはありません。</p>';
            return;
        }
        for (const doc of snapshot.docs) {
            const comment = doc.data();
            const authorName = await getUserName(comment.user);
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `
                <div class="comment-meta">
                    <span><strong>${authorName}</strong></span> - 
                    <span>${comment.date.toDate().toLocaleString()}</span>
                </div>
                <p>${comment.answer.replace(/\n/g, '<br>')}</p>
            `;
            commentsContainer.appendChild(commentEl);
        }
    }

    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const commentInput = document.getElementById('comment-input');
        const answer = commentInput.value.trim();
        if (!answer) return;

        try {
            await window.addComment(questionId, answer);
            commentInput.value = '';
            await loadComments(); // コメントを再読み込み
        } catch (error) {
            console.error("コメントの投稿に失敗しました:", error);
            alert(`コメントの投稿に失敗しました: ${error.message}`);
        }
    });

    window.onAuth(user => {
        if (!user) {
            commentForm.style.display = 'none';
            const p = document.createElement('p');
            p.innerHTML = '<a href="/login.html">ログイン</a>してコメントを投稿してください。';
            commentsContainer.insertAdjacentElement('afterend', p);
        }
    });

    await loadQuestion();
    await loadComments();
});
