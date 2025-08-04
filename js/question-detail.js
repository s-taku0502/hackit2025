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

    let currentUser = null;
    let questionData = null;

    const userCache = new Map();

    // いいね状態をローカルストレージで管理
    function hasUserLikedComment(commentId) {
        if (!currentUser) return false;
        const likedComments = JSON.parse(localStorage.getItem(`liked_comments_${currentUser.uid}`) || '[]');
        return likedComments.includes(commentId);
    }

    function addLikedComment(commentId) {
        if (!currentUser) return;
        const likedComments = JSON.parse(localStorage.getItem(`liked_comments_${currentUser.uid}`) || '[]');
        if (!likedComments.includes(commentId)) {
            likedComments.push(commentId);
            localStorage.setItem(`liked_comments_${currentUser.uid}`, JSON.stringify(likedComments));
        }
    }

    async function getUserName(uid) {
        // uidの妥当性チェックを追加
        if (!uid || typeof uid !== 'string') {
            console.warn('Invalid uid provided:', uid);
            return '匿名ユーザー';
        }

        if (userCache.has(uid)) return userCache.get(uid);
        try {
            const userProfile = await window.getUserProfile(uid);
            const username = userProfile.exists() ? userProfile.data().username : '匿名ユーザー';
            userCache.set(uid, username);
            return username;
        } catch (e) {
            console.error("Error fetching user:", e);
            return '匿名ユーザー';
        }
    }

    async function loadQuestion() {
        const docSnap = await window.getQuestionById(questionId);
        if (!docSnap.exists()) {
            questionContainer.innerHTML = '<h1>質問が見つかりません。</h1>';
            return;
        }
        questionData = docSnap.data();
        const authorName = await getUserName(questionData.user);
        
        // 解決状態切り替えボタンを投稿者のみに表示
        const solvedToggleButton = currentUser && currentUser.uid === questionData.user
            ? `<button id="toggle-solved-btn" class="solved-toggle-btn ${questionData.is_solved ? 'solved' : 'unsolved'}">
                 ${questionData.is_solved ? '✅ 解決済み' : '❌ 未解決'}
               </button>`
            : '';

        // 削除ボタンを投稿者のみに表示
        const deleteButton = currentUser && currentUser.uid === questionData.user
            ? `<button id="delete-question-btn" class="delete-btn" style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-left: 10px;">質問を削除</button>`
            : '';

        questionContainer.innerHTML = `
            <h1>${questionData.title}</h1>
            <div class="question-meta-header">
                <p><strong>課程:</strong> ${questionData.course_label}</p>
                <p><strong>投稿者:</strong> ${authorName}</p>
                <p><strong>投稿日時:</strong> ${questionData.date.toDate().toLocaleString()}</p>
                <div class="question-status">
                    <span class="status-badge ${questionData.is_solved ? 'solved' : 'unsolved'}">
                        ${questionData.is_solved ? '解決済み' : '未解決'}
                    </span>
                    ${solvedToggleButton}
                    ${deleteButton}
                </div>
            </div>
            <hr>
            <div class="question-content">${questionData.content.replace(/\n/g, '<br>')}</div>
        `;

        // 解決状態切り替えボタンのイベントリスナー
        const toggleBtn = document.getElementById('toggle-solved-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', async () => {
                try {
                    const newSolvedState = !questionData.is_solved;
                    await window.toggleQuestionSolved(questionId, newSolvedState);
                    questionData.is_solved = newSolvedState;
                    await loadQuestion();
                } catch (error) {
                    console.error("解決状態の更新に失敗しました:", error);
                    alert(`エラーが発生しました: ${error.message}`);
                }
            });
        }

        // 質問削除ボタンのイベントリスナー
        const deleteBtn = document.getElementById('delete-question-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                if (confirm('この質問を削除しますか？この操作は取り消せません。')) {
                    try {
                        await window.deleteQuestion(questionId);
                        alert('質問を削除しました。');
                        window.location.href = '/viewer/question/list.html';
                    } catch (error) {
                        console.error("質問の削除に失敗しました:", error);
                        alert(`質問の削除に失敗しました: ${error.message}`);
                    }
                }
            });
        }
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
            const commentId = doc.id;
            const authorName = await getUserName(comment.user);
            const isLiked = hasUserLikedComment(commentId);
            const canDelete = currentUser && currentUser.uid === comment.user;

            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `
                <div class="comment-meta">
                    <span><strong>${authorName}</strong></span> - 
                    <span>${comment.date.toDate().toLocaleString()}</span>
                    ${canDelete ? `<button class="delete-comment-btn" data-comment-id="${commentId}" style="background: #dc3545; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; margin-left: 10px; font-size: 0.8em;">削除</button>` : ''}
                </div>
                <p>${comment.answer.replace(/\n/g, '<br>')}</p>
                <div class="comment-actions" style="margin-top: 10px;">
                    <button class="comment-like-btn ${isLiked ? 'liked' : ''}" data-comment-id="${commentId}" ${isLiked ? 'disabled' : ''} style="background: none; border: 1px solid #ddd; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                        👍 ${comment.good || 0}
                    </button>
                </div>
            `;
            commentsContainer.appendChild(commentEl);
        }

        // コメントのいいねボタンにイベントリスナーを追加
        document.querySelectorAll('.comment-like-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const commentId = e.target.dataset.commentId;
                if (hasUserLikedComment(commentId)) return;

                try {
                    await window.incrementCommentGood(questionId, commentId);
                    const currentCount = parseInt(e.target.textContent.match(/\d+/)[0], 10);
                    e.target.textContent = `👍 ${currentCount + 1}`;
                    e.target.disabled = true;
                    e.target.classList.add('liked');
                    addLikedComment(commentId);
                } catch (error) {
                    console.error("コメントのいいねに失敗しました:", error);
                    alert('いいねに失敗しました。');
                }
            });
        });

        // コメント削除ボタンにイベントリスナーを追加
        document.querySelectorAll('.delete-comment-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const commentId = e.target.dataset.commentId;
                if (confirm('このコメントを削除しますか？この操作は取り消せません。')) {
                    try {
                        await window.deleteComment(questionId, commentId);
                        await loadComments(); // コメントを再読み込み
                        await loadQuestion(); // 質問も再読み込み（回答数更新のため）
                    } catch (error) {
                        console.error("コメントの削除に失敗しました:", error);
                        alert('コメントの削除に失敗しました。');
                    }
                }
            });
        });
    }

    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const commentInput = document.getElementById('comment-input');
        const answer = commentInput.value.trim();
        if (!answer) return;

        try {
            await window.addComment(questionId, answer);
            commentInput.value = '';
            await loadComments();
            await loadQuestion(); // 回答数更新のため質問も再読み込み
        } catch (error) {
            console.error("コメントの投稿に失敗しました:", error);
            alert(`コメントの投稿に失敗しました: ${error.message}`);
        }
    });

    window.onAuth(async (user) => {
        currentUser = user;
        if (!user) {
            commentForm.style.display = 'none';
            const p = document.createElement('p');
            p.innerHTML = '<a href="/login.html">ログイン</a>してコメントを投稿してください。';
            commentsContainer.insertAdjacentElement('afterend', p);
        }
        await loadQuestion();
        await loadComments();
    });
});
