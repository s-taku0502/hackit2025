// 過去問表示ページ専用のJavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 過去問ページの要素を取得
    const paperTitle = document.getElementById('paper-title');
    const subjectName = document.getElementById('subject-name');
    const professor = document.getElementById('professor');
    const paperImage = document.getElementById('past-paper-img');
    
    if (paperTitle && subjectName && professor && paperImage) {
        // ページが読み込まれた時に動的にalt属性を更新
        function updateImageAlt() {
            const title = paperTitle.textContent || '過去問';
            const subject = subjectName.textContent || '教科';
            const profName = professor.textContent || '教員';
            
            // より具体的なalt属性を設定
            const altText = `${subject} ${title} (担当: ${profName})の問題画像`;
            paperImage.alt = altText;
        }
        
        // 初期設定
        updateImageAlt();
        
        // サンプルデータの設定（実際のプロジェクトでは動的に取得）
        function setSampleData() {
            paperTitle.textContent = '2024年度前期試験問題';
            subjectName.textContent = 'コンピュータサイエンス';
            professor.textContent = '田中教授';
            
            // alt属性を再更新
            updateImageAlt();
            
            // ダウンロードファイル名も更新
            if (downloadLink && typeof updateDownloadFileName === 'function') {
                updateDownloadFileName();
            }
        }
        
        // 1秒後にサンプルデータを設定（実際の実装では即座に設定）
        setTimeout(setSampleData, 100);
        
        // タイトルやデータが変更された時にalt属性も更新
        const observer = new MutationObserver(updateImageAlt);
        observer.observe(paperTitle, { childList: true, subtree: true });
        observer.observe(subjectName, { childList: true, subtree: true });
        observer.observe(professor, { childList: true, subtree: true });
        
        // ダウンロードリンクの改善
        const downloadLink = document.querySelector('.download-link');
        if (downloadLink) {
            // 初期ファイル名を設定
            function updateDownloadFileName() {
                const title = paperTitle.textContent?.trim() || '過去問';
                const subject = subjectName.textContent?.trim() || '教科';
                const year = new Date().getFullYear();
                
                // ファイル名に使用できない文字を除去
                const sanitizeFileName = (str) => {
                    return str.replace(/[<>:"/\\|?*]/g, '_')
                             .replace(/\s+/g, '_')
                             .replace(/_+/g, '_')
                             .replace(/^_|_$/g, '');
                };
                
                const sanitizedSubject = sanitizeFileName(subject);
                const sanitizedTitle = sanitizeFileName(title);
                
                // より詳細なファイル名を生成
                const fileName = `${sanitizedSubject}_${sanitizedTitle}_${year}.jpg`;
                downloadLink.download = fileName;
                
                // アクセシビリティ: aria-label で詳細情報を提供
                downloadLink.setAttribute('aria-label', 
                    `${subject} ${title}の過去問をダウンロード (ファイル名: ${fileName})`
                );
            }
            
            // 初期設定
            updateDownloadFileName();
            
            // コンテンツ変更時にファイル名も更新
            const updateFileName = () => setTimeout(updateDownloadFileName, 50);
            observer.observe(paperTitle, { childList: true, subtree: true, characterData: true });
            observer.observe(subjectName, { childList: true, subtree: true, characterData: true });
            
            downloadLink.addEventListener('click', function(e) {
                // 最新の情報でファイル名を再設定
                updateDownloadFileName();
                
                // ユーザーフィードバック
                const originalText = this.textContent;
                const originalBgColor = this.style.backgroundColor;
                
                // ダウンロード開始フィードバック
                this.textContent = 'ダウンロード中...';
                this.classList.add('downloading');
                this.style.cursor = 'wait';
                
                // ダウンロード完了フィードバック
                setTimeout(() => {
                    this.textContent = 'ダウンロード完了！';
                    this.classList.remove('downloading');
                    this.classList.add('completed');
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.classList.remove('completed');
                        this.style.cursor = 'pointer';
                    }, 2000);
                }, 500);
                
                // アクセシビリティ: スクリーンリーダー用のアナウンス
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.style.position = 'absolute';
                announcement.style.left = '-10000px';
                announcement.textContent = `${this.getAttribute('aria-label')} を開始しました`;
                document.body.appendChild(announcement);
                
                setTimeout(() => {
                    announcement.textContent = 'ダウンロードが完了しました';
                    setTimeout(() => {
                        document.body.removeChild(announcement);
                    }, 1000);
                }, 1000);
            });
        }
        
        // キーボードナビゲーション対応
        document.addEventListener('keydown', function(e) {
            if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                downloadLink?.click();
            }
        });
        
        // 画像の読み込みエラー処理
        paperImage.addEventListener('error', function() {
            this.alt = '画像を読み込めませんでした: ' + this.alt;
            
            // エラー時の代替表示
            const errorDiv = document.createElement('div');
            errorDiv.className = 'image-error';
            errorDiv.innerHTML = `
                <p>⚠️ 画像を読み込めませんでした</p>
                <p>画像ファイル: ${this.src}</p>
                <p>内容: ${this.alt}</p>
            `;
            errorDiv.style.cssText = `
                background-color: #f8f9fa;
                border: 2px dashed #dee2e6;
                padding: 20px;
                text-align: center;
                color: #6c757d;
                border-radius: 5px;
            `;
            
            this.parentNode.replaceChild(errorDiv, this);
        });
        
        // 画像の読み込み完了時の処理
        paperImage.addEventListener('load', function() {
            console.log(`画像が正常に読み込まれました: ${this.alt}`);
        });
        
        // ページ固有の追加機能
        
        // 画像のズーム機能
        paperImage.addEventListener('click', function() {
            if (this.style.transform === 'scale(1.5)') {
                this.style.transform = 'scale(1)';
                this.style.cursor = 'zoom-in';
            } else {
                this.style.transform = 'scale(1.5)';
                this.style.cursor = 'zoom-out';
            }
            this.style.transition = 'transform 0.3s ease';
        });
        
        // 印刷機能
        document.addEventListener('keydown', function(e) {
            if (e.key === 'p' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                window.print();
            }
        });
        
        // 共有機能（Web Share API対応）
        if (navigator.share) {
            const shareButton = document.createElement('button');
            shareButton.textContent = '共有';
            shareButton.className = 'share-btn';
            shareButton.style.cssText = `
                background-color: #3498db;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin-left: 10px;
                cursor: pointer;
            `;
            
            shareButton.addEventListener('click', async () => {
                try {
                    await navigator.share({
                        title: `${subjectName.textContent} ${paperTitle.textContent}`,
                        text: `${professor.textContent}の過去問をチェック！`,
                        url: window.location.href
                    });
                } catch (err) {
                    console.log('共有がキャンセルされました');
                }
            });
            
            document.querySelector('.download__btn').appendChild(shareButton);
        }
        
        // ページの読み込み完了時の処理
        console.log('過去問表示ページが正常に読み込まれました');
    }
});

// Firebaseの設定（初期化）は済んでいる前提です。
const db = firebase.firestore();
const auth = firebase.auth(); 

// ページが完全に読み込まれた後に実行
document.addEventListener('DOMContentLoaded', () => {
    // ダウンロードボタンを取得
    const downloadLink = document.querySelector('.download-link');
    
    // ダウンロードボタンが存在する場合にイベントリスナーを追加
    if (downloadLink) {
        downloadLink.addEventListener('click', (event) => {
            // クリックされた要素から過去問の情報を取得
            const paperId = event.currentTarget.getAttribute('data-paper-id');
            const paperTitle = event.currentTarget.getAttribute('data-paper-title');
            
            // ユーザーがログインしているか確認
            const user = auth.currentUser;
            if (user) {
                // ログインしていれば履歴を保存
                addHistory(user.uid, paperId, paperTitle);
            } else {
                console.log("ユーザーはログインしていません。履歴は保存されません。");
            }
        });
    }
});

// Firestoreに履歴を保存する関数
function addHistory(userId, paperId, paperTitle) {
    // 既に履歴が存在するか確認する処理を追加することもできますが、
    // ここではシンプルに毎回追加する方式とします。
    // 重複を避ける場合は、過去の履歴に同じpaperIdがあるかget()で確認してからadd()を実行します。
    
    db.collection("history").add({
        userId: userId, 
        paperId: paperId,
        paperTitle: paperTitle,
        viewedAt: firebase.firestore.FieldValue.serverTimestamp() // サーバーのタイムスタンプを使用
    })
    .then(() => {
        console.log("閲覧履歴が正常に保存されました。");
    })
    .catch((error) => {
        console.error("閲覧履歴の保存中にエラーが発生しました。", error);
    });
}