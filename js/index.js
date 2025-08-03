// Firebaseの初期化に必要なモジュールをインポート
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// パスワード確認機能
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    // エラーメッセージ表示用の要素を作成
    function createErrorMessage(id, message) {
        const existingError = document.getElementById(id);
        if (existingError) {
            existingError.textContent = message;
            return existingError;
        }
        
        const errorElement = document.createElement('div');
        errorElement.id = id;
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '5px';
        return errorElement;
    }
    
    // エラーメッセージを削除
    function removeErrorMessage(id) {
        const errorElement = document.getElementById(id);
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // パスワード一致チェック（リアルタイム）
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword === '') {
            removeErrorMessage('password-match-error');
            return;
        }
        
        if (password !== confirmPassword) {
            const errorMessage = createErrorMessage('password-match-error', 'パスワードが一致しません');
            const confirmPasswordGroup = confirmPasswordInput.closest('.form-group');
            if (!document.getElementById('password-match-error')) {
                confirmPasswordGroup.appendChild(errorMessage);
            }
            confirmPasswordInput.style.borderColor = '#e74c3c';
        } else {
            removeErrorMessage('password-match-error');
            confirmPasswordInput.style.borderColor = '#27ae60';
        }
    }
    
    // パスワード強度チェック
    function checkPasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        if (password.length < minLength) {
            return 'パスワードは8文字以上で入力してください';
        }
        
        let strength = 0;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumbers) strength++;
        if (hasSpecialChar) strength++;
        
        if (strength < 2) {
            return 'パスワードには英数字を組み合わせてください';
        }
        
        return null; // エラーなし
    }
    
    // パスワード入力時のリアルタイムチェック
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthError = checkPasswordStrength(password);
            
            if (strengthError) {
                const errorMessage = createErrorMessage('password-strength-error', strengthError);
                const passwordGroup = this.closest('.form-group');
                if (!document.getElementById('password-strength-error')) {
                    passwordGroup.appendChild(errorMessage);
                }
                this.style.borderColor = '#e74c3c';
            } else {
                removeErrorMessage('password-strength-error');
                this.style.borderColor = '#27ae60';
            }
            
            // パスワード確認フィールドがある場合はマッチチェックも実行
            if (confirmPasswordInput && confirmPasswordInput.value !== '') {
                checkPasswordMatch();
            }
        });
    }
    
    // パスワード確認入力時のリアルタイムチェック
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }
    
    // フォーム送信時のバリデーション
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const termsCheckbox = document.getElementById('terms');
            
            let hasErrors = false;
            
            // ユーザー名チェック
            if (username.length < 3) {
                const errorMessage = createErrorMessage('username-error', 'ユーザー名は3文字以上で入力してください');
                const usernameGroup = document.getElementById('username').closest('.form-group');
                if (!document.getElementById('username-error')) {
                    usernameGroup.appendChild(errorMessage);
                }
                hasErrors = true;
            } else {
                removeErrorMessage('username-error');
            }
            
            // メールアドレスチェック
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                const errorMessage = createErrorMessage('email-error', '正しいメールアドレスを入力してください');
                const emailGroup = document.getElementById('email').closest('.form-group');
                if (!document.getElementById('email-error')) {
                    emailGroup.appendChild(errorMessage);
                }
                hasErrors = true;
            } else {
                removeErrorMessage('email-error');
            }
            
            // パスワード強度チェック
            const strengthError = checkPasswordStrength(password);
            if (strengthError) {
                const errorMessage = createErrorMessage('password-strength-error', strengthError);
                const passwordGroup = passwordInput.closest('.form-group');
                if (!document.getElementById('password-strength-error')) {
                    passwordGroup.appendChild(errorMessage);
                }
                hasErrors = true;
            }
            
            // パスワード一致チェック
            if (password !== confirmPassword) {
                const errorMessage = createErrorMessage('password-match-error', 'パスワードが一致しません');
                const confirmPasswordGroup = confirmPasswordInput.closest('.form-group');
                if (!document.getElementById('password-match-error')) {
                    confirmPasswordGroup.appendChild(errorMessage);
                }
                hasErrors = true;
            }
            
            // 利用規約チェック
            if (!termsCheckbox.checked) {
                const errorMessage = createErrorMessage('terms-error', '利用規約に同意してください');
                const termsGroup = termsCheckbox.closest('.form-group');
                if (!document.getElementById('terms-error')) {
                    termsGroup.appendChild(errorMessage);
                }
                hasErrors = true;
            } else {
                removeErrorMessage('terms-error');
            }
            
            // エラーがある場合は送信を中止
            if (hasErrors) {
                event.preventDefault();
                
                // 最初のエラー要素にスクロール
                const firstError = document.querySelector('.error-message');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // フィードバック表示
                showFormFeedback('入力内容を確認してください', 'error');
            } else {
                // 成功フィードバック
                showFormFeedback('登録情報を送信中...', 'success');
            }
        });
    }
    
    // フィードバック表示機能
    function showFormFeedback(message, type) {
        // 既存のフィードバック要素を削除
        const existingFeedback = document.querySelector('.form-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        const feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        feedback.textContent = message;
        feedback.style.padding = '10px';
        feedback.style.borderRadius = '5px';
        feedback.style.margin = '10px 0';
        feedback.style.textAlign = 'center';
        feedback.style.fontWeight = 'bold';
        
        if (type === 'error') {
            feedback.style.backgroundColor = '#f8d7da';
            feedback.style.color = '#721c24';
            feedback.style.border = '1px solid #f5c6cb';
        } else if (type === 'success') {
            feedback.style.backgroundColor = '#d4edda';
            feedback.style.color = '#155724';
            feedback.style.border = '1px solid #c3e6cb';
        }
        
        const form = document.querySelector('.signup-form');
        form.parentNode.insertBefore(feedback, form);
        
        // 3秒後に自動削除（成功メッセージの場合）
        if (type === 'success') {
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.remove();
                }
            }, 3000);
        }
    }
});

// 過去問表示ページの機能
document.addEventListener('DOMContentLoaded', function() {
    // 過去問ページかどうかを判定
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
    }
});