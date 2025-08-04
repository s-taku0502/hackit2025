document.addEventListener('DOMContentLoaded', async function() {
    const questionsContainer = document.getElementById('questions-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    const categoryFilter = document.getElementById('category-filter');
    const statusFilter = document.getElementById('status-filter');
    
    if (!questionsContainer) return;

    let allQuestions = [];
    let currentUser = null;
    const userCache = new Map();

    // いいね状態をローカルストレージで管理
    function hasUserLikedQuestion(questionId) {
        if (!currentUser) return false;
        const likedQuestions = JSON.parse(localStorage.getItem(`liked_questions_${currentUser.uid}`) || '[]');
        return likedQuestions.includes(questionId);
    }

    function addLikedQuestion(questionId) {
        if (!currentUser) return;
        const likedQuestions = JSON.parse(localStorage.getItem(`liked_questions_${currentUser.uid}`) || '[]');
        if (!likedQuestions.includes(questionId)) {
            likedQuestions.push(questionId);
            localStorage.setItem(`liked_questions_${currentUser.uid}`, JSON.stringify(likedQuestions));
        }
    }

    async function getUserName(uid) {
        // uidの妥当性チェックを追加
        if (!uid || typeof uid !== 'string') {
            console.warn('Invalid uid provided:', uid);
            return '匿名ユーザー';
        }

        if (userCache.has(uid)) {
            return userCache.get(uid);
        }
        try {
            const userProfile = await window.getUserProfile(uid);
            if (userProfile.exists()) {
                const username = userProfile.data().username;
                userCache.set(uid, username);
                return username;
            }
        } catch (e) {
            console.error("Error fetching user:", e);
        }
        userCache.set(uid, '匿名ユーザー');
        return '匿名ユーザー';
    }

    async function loadAllQuestions() {
        try {
            const snapshot = await window.getQuestions();
            allQuestions = [];
            
            for (const doc of snapshot.docs) {
                const question = doc.data();
                const questionId = doc.id;
                
                // question.userの妥当性もチェック
                const authorName = question.user ? await getUserName(question.user) : '匿名ユーザー';
                
                allQuestions.push({
                    id: questionId,
                    ...question,
                    authorName: authorName
                });
            }
            
            displayQuestions(allQuestions);
        } catch (error) {
            console.error("質問の読み込みに失敗しました:", error);
            questionsContainer.innerHTML = '<p>質問の読み込み中にエラーが発生しました。</p>';
        }
    }

    function displayQuestions(questions) {
        questionsContainer.innerHTML = '';
        
        if (questions.length === 0) {
            questionsContainer.innerHTML = '<p>条件に一致する質問はありません。</p>';
            return;
        }

        questions.forEach(question => {
            const card = document.createElement('div');
            card.className = 'question-card';
            card.dataset.id = question.id;

            const isLiked = hasUserLikedQuestion(question.id);
            const canDelete = currentUser && currentUser.uid === question.user;

            card.innerHTML = `
                <div class="question-header">
                    <span class="category-tag">${question.course_label}</span>
                    <span class="status ${question.is_solved ? 'answered' : 'unanswered'}">
                        ${question.is_solved ? '解決済み' : '未解決'}
                    </span>
                    ${canDelete ? `<button class="delete-question-btn" data-question-id="${question.id}" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">削除</button>` : ''}
                </div>
                <h3 class="question-title">${question.title}</h3>
                <p class="question-preview">${question.content.substring(0, 100)}...</p>
                <div class="question-meta">
                    <span class="author">投稿者: ${question.authorName}</span>
                    <span class="date">${question.date.toDate().toLocaleString()}</span>
                    <span class="answers-count">回答数: ${question.ans_count}</span>
                </div>
                <div class="question-actions">
                    <a href="/viewer/question/detail.html?id=${question.id}" class="view-btn">詳細を見る</a>
                    <button class="like-btn ${isLiked ? 'liked' : ''}" data-question-id="${question.id}" ${isLiked ? 'disabled' : ''}>
                        👍 ${question.good_count}
                    </button>
                </div>
            `;
            questionsContainer.appendChild(card);
        });

        // いいねボタンにイベントリスナーを追加
        document.querySelectorAll('.like-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const questionId = e.target.dataset.questionId;
                if (hasUserLikedQuestion(questionId)) return;

                try {
                    await window.incrementQuestionGoodCount(questionId);
                    const currentCount = parseInt(e.target.textContent.match(/\d+/)[0], 10);
                    e.target.textContent = `👍 ${currentCount + 1}`;
                    e.target.disabled = true;
                    e.target.classList.add('liked');
                    addLikedQuestion(questionId);
                } catch (error) {
                    console.error("いいねの追加に失敗しました:", error);
                    alert('いいねに失敗しました。');
                }
            });
        });

        // 削除ボタンにイベントリスナーを追加
        document.querySelectorAll('.delete-question-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                e.stopPropagation();
                const questionId = e.target.dataset.questionId;
                if (confirm('この質問を削除しますか？この操作は取り消せません。')) {
                    try {
                        await window.deleteQuestion(questionId);
                        await loadAllQuestions(); // 質問一覧を再読み込み
                    } catch (error) {
                        console.error("質問の削除に失敗しました:", error);
                        alert('質問の削除に失敗しました。');
                    }
                }
            });
        });
    }

    function filterAndSortQuestions() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;
        const selectedStatus = statusFilter.value;
        
        let filteredQuestions = allQuestions.filter(question => {
            // 検索条件
            const matchesSearch = !searchTerm || 
                question.title.toLowerCase().includes(searchTerm) ||
                question.content.toLowerCase().includes(searchTerm);
            
            // カテゴリ条件
            const matchesCategory = selectedCategory === 'all' || 
                question.course_label === selectedCategory;
            
            // ステータス条件を修正
            const matchesStatus = selectedStatus === 'all' ||
                (selectedStatus === 'answered' && question.is_solved) ||
                (selectedStatus === 'unanswered' && !question.is_solved);
            
            return matchesSearch && matchesCategory && matchesStatus;
        });

        // 並び替え（並び替えUIがある場合）
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect && sortSelect.value) {
            const sortType = sortSelect.value;
            filteredQuestions.sort((a, b) => {
                switch(sortType) {
                    case 'date-desc':
                        return b.date.toDate() - a.date.toDate();
                    case 'date-asc':
                        return a.date.toDate() - b.date.toDate();
                    case 'likes-desc':
                        return b.good_count - a.good_count;
                    case 'likes-asc':
                        return a.good_count - b.good_count;
                    case 'answers-desc':
                        return b.ans_count - a.ans_count;
                    case 'answers-asc':
                        return a.ans_count - b.ans_count;
                    default:
                        return 0;
                }
            });
        }

        displayQuestions(filteredQuestions);
        updateResultsCount(filteredQuestions.length, allQuestions.length);
    }

    function updateResultsCount(visibleCount, totalCount) {
        let resultsCount = document.querySelector('.results-count');
        if (!resultsCount) {
            resultsCount = document.createElement('div');
            resultsCount.className = 'results-count';
            resultsCount.style.cssText = 'margin-bottom: 16px; font-weight: bold; color: #666;';
            questionsContainer.parentNode.insertBefore(resultsCount, questionsContainer);
        }
        resultsCount.textContent = `${visibleCount} / ${totalCount} 件の質問を表示中`;
    }

    // 並び替えUIを追加
    function addSortUI() {
        const searchSection = document.querySelector('.search-section');
        const existingSortContainer = document.querySelector('.sort-container');
        
        if (searchSection && !existingSortContainer) {
            const sortContainer = document.createElement('div');
            sortContainer.className = 'sort-container';
            sortContainer.style.cssText = 'margin-top: 16px; display: flex; gap: 8px; align-items: center;';
            
            const sortLabel = document.createElement('span');
            sortLabel.textContent = '並び替え:';
            sortLabel.style.fontWeight = 'bold';
            
            const sortSelect = document.createElement('select');
            sortSelect.id = 'sort-select';
            sortSelect.innerHTML = `
                <option value="">デフォルト</option>
                <option value="date-desc">投稿日時（新しい順）</option>
                <option value="date-asc">投稿日時（古い順）</option>
                <option value="likes-desc">いいね数（多い順）</option>
                <option value="likes-asc">いいね数（少ない順）</option>
                <option value="answers-desc">回答数（多い順）</option>
                <option value="answers-asc">回答数（少ない順）</option>
            `;
            sortSelect.style.cssText = 'padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px;';
            
            sortContainer.appendChild(sortLabel);
            sortContainer.appendChild(sortSelect);
            searchSection.appendChild(sortContainer);
            
            sortSelect.addEventListener('change', filterAndSortQuestions);
        }
    }

    // イベントリスナーの設定
    if (searchBtn) {
        searchBtn.addEventListener('click', filterAndSortQuestions);
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterAndSortQuestions);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterAndSortQuestions();
            }
        });
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndSortQuestions);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterAndSortQuestions);
    }

    // ユーザー認証状態の監視
    window.onAuth(async (user) => {
        currentUser = user;
        if (!user) {
            window.location.href = '/login.html';
        } else {
            addSortUI();
            await loadAllQuestions();
        }
    });
});
