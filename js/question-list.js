document.addEventListener('DOMContentLoaded', function() {
    // 検索機能
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.querySelector('.search-btn');
    const categoryFilter = document.getElementById('category-filter');
    const statusFilter = document.getElementById('status-filter');
    const questionCards = document.querySelectorAll('.question-card');

    // 検索とフィルター機能
    function filterQuestions() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedStatus = statusFilter.value;

        questionCards.forEach(card => {
            const title = card.querySelector('.question-title').textContent.toLowerCase();
            const preview = card.querySelector('.question-preview').textContent.toLowerCase();
            const category = card.querySelector('.category-tag').textContent.toLowerCase();
            const status = card.querySelector('.status').classList.contains('answered') ? 'answered' : 'unanswered';

            // 検索条件をチェック
            const matchesSearch = title.includes(searchTerm) || preview.includes(searchTerm);
            const matchesCategory = !selectedCategory || category.includes(selectedCategory);
            const matchesStatus = !selectedStatus || status === selectedStatus;

            // 全ての条件を満たす場合のみ表示
            if (matchesSearch && matchesCategory && matchesStatus) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        updateResultsCount();
    }

    // 検索結果数を更新
    function updateResultsCount() {
        const visibleCards = document.querySelectorAll('.question-card[style="display: block"], .question-card:not([style*="display: none"])');
        const totalCards = questionCards.length;
        
        // 結果数表示要素がない場合は作成
        let resultsCount = document.querySelector('.results-count');
        if (!resultsCount) {
            resultsCount = document.createElement('div');
            resultsCount.className = 'results-count';
            resultsCount.style.cssText = 'margin-bottom: 16px; font-weight: bold; color: #666;';
            document.querySelector('.questions-container').parentNode.insertBefore(resultsCount, document.querySelector('.questions-container'));
        }
        
        resultsCount.textContent = `${visibleCards.length} / ${totalCards} 件の質問を表示中`;
    }

    // イベントリスナー設定
    searchBtn.addEventListener('click', filterQuestions);
    searchInput.addEventListener('input', filterQuestions);
    categoryFilter.addEventListener('change', filterQuestions);
    statusFilter.addEventListener('change', filterQuestions);

    // Enterキーで検索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filterQuestions();
        }
    });

    // いいね機能
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 現在のいいね数を取得
            const currentText = this.textContent;
            const currentCount = parseInt(currentText.match(/\d+/)[0]);
            
            // いいね状態を切り替え
            if (this.classList.contains('liked')) {
                this.classList.remove('liked');
                this.textContent = `👍 ${currentCount - 1}`;
                this.style.backgroundColor = '';
                this.style.color = '';
            } else {
                this.classList.add('liked');
                this.textContent = `👍 ${currentCount + 1}`;
                this.style.backgroundColor = '#007bff';
                this.style.color = 'white';
            }
        });
    });

    // ページ読み込み時に結果数を表示
    updateResultsCount();

    // ソート機能
    function addSortFunctionality() {
        const sortContainer = document.createElement('div');
        sortContainer.className = 'sort-container';
        sortContainer.style.cssText = 'margin-bottom: 16px; display: flex; gap: 8px; align-items: center;';
        
        const sortLabel = document.createElement('span');
        sortLabel.textContent = '並び替え:';
        sortLabel.style.fontWeight = 'bold';
        
        const sortSelect = document.createElement('select');
        sortSelect.innerHTML = `
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
        
        document.querySelector('.search-section').appendChild(sortContainer);
        
        sortSelect.addEventListener('change', function() {
            sortQuestions(this.value);
        });
    }

    function sortQuestions(sortType) {
        const container = document.querySelector('.questions-container');
        const cards = Array.from(questionCards);
        
        cards.sort((a, b) => {
            switch(sortType) {
                case 'date-desc':
                    return new Date(b.querySelector('.date').textContent) - new Date(a.querySelector('.date').textContent);
                case 'date-asc':
                    return new Date(a.querySelector('.date').textContent) - new Date(b.querySelector('.date').textContent);
                case 'likes-desc':
                    return parseInt(b.querySelector('.like-btn').textContent.match(/\d+/)[0]) - parseInt(a.querySelector('.like-btn').textContent.match(/\d+/)[0]);
                case 'likes-asc':
                    return parseInt(a.querySelector('.like-btn').textContent.match(/\d+/)[0]) - parseInt(b.querySelector('.like-btn').textContent.match(/\d+/)[0]);
                case 'answers-desc':
                    return parseInt(b.querySelector('.answers-count').textContent.match(/\d+/)[0]) - parseInt(a.querySelector('.answers-count').textContent.match(/\d+/)[0]);
                case 'answers-asc':
                    return parseInt(a.querySelector('.answers-count').textContent.match(/\d+/)[0]) - parseInt(b.querySelector('.answers-count').textContent.match(/\d+/)[0]);
                default:
                    return 0;
            }
        });
        
        // カードを再配置
        cards.forEach(card => container.appendChild(card));
    }

    // ソート機能を追加
    addSortFunctionality();
});
