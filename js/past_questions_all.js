document.addEventListener('DOMContentLoaded', async () => {
    const searchForm = document.getElementById('search-form');
    const resultsList = document.getElementById('results-list');
    let allFiles = [];

    // 最初にすべてのファイルを読み込む
    async function fetchAllFiles() {
        try {
            resultsList.innerHTML = '<li>読み込み中...</li>';
            const snapshot = await window.getAllFiles();
            allFiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // 科目名でクライアント側ソートを追加
            allFiles.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            displayResults(allFiles); // 初期表示
        } catch (error) {
            console.error("ファイルの読み込みに失敗しました:", error);
            resultsList.innerHTML = '<li>ファイルの読み込みに失敗しました。</li>';
        }
    }

    // 履歴に記録する関数
    async function recordHistory(url) {
        try {
            const { getFirestore, collection, addDoc, serverTimestamp } = await import("firebase/firestore");
            const { getAuth } = await import("firebase/auth");
            
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (user && user.uid) {
                const db = getFirestore();
                await addDoc(collection(db, "history"), {
                    uid: user.uid,
                    url: url,
                    time: serverTimestamp()
                });
            }
        } catch (error) {
            console.error("履歴の記録に失敗しました:", error);
        }
    }

    // 結果をリストに表示する
    function displayResults(files) {
        resultsList.innerHTML = '';
        if (files.length === 0) {
            resultsList.innerHTML = '<li>該当する過去問は見つかりませんでした。</li>';
            return;
        }

        files.forEach(file => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = file.url;
            a.target = '_blank';
            a.textContent = `${file.year}年度 ${file.name} [${file.exam_name || '種別未登録'}] (${file.teacher || '教員名未登録'})`;
            
            // クリック時に履歴を記録
            a.addEventListener('click', () => {
                recordHistory(file.url);
            });
            
            li.appendChild(a);
            resultsList.appendChild(li);
        });
    }

    // 検索フォームの送信イベント
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchName = document.getElementById('search-name').value.trim();
        const searchTeacher = document.getElementById('search-teacher').value.trim();
        const searchYear = document.getElementById('search-year').value;
        const searchExamName = document.getElementById('search-exam-name').value;

        const filteredFiles = allFiles.filter(file => {
            const nameMatch = !searchName || (file.name && file.name.toLowerCase().includes(searchName.toLowerCase()));
            const teacherMatch = !searchTeacher || (file.teacher && file.teacher.toLowerCase().includes(searchTeacher.toLowerCase()));
            const yearMatch = !searchYear || file.year == searchYear;
            const examNameMatch = !searchExamName || file.exam_name === searchExamName;
            return nameMatch && teacherMatch && yearMatch && examNameMatch;
        });

        displayResults(filteredFiles);
    });

    // 認証状態を確認してからファイルを取得
    window.onAuth(async (user) => {
        if (user) {
            await fetchAllFiles();
        } else {
            window.location.href = '/login.html';
        }
    });
});
