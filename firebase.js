// Firebase SDK の import
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, addDoc, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


// .envファイルからFirebase設定を読み込む (Viteなどのビルドツールを想定)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestoreのインスタンスを取得
const storage = getStorage(app); // Storageのインスタンスを取得

// ユーザー登録時にFirestoreにもユーザー情報を保存する関数
window.signupWithEmailPasswordAndSaveUser = async (email, password, username) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  // usersコレクションにドキュメントを作成 (ドキュメントID = user.uid)
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    username: username,
    email: email,
    createdAt: serverTimestamp()
  });
  return userCredential;
};

// 過去問をアップロードする関数
window.uploadPastPaper = async (year, subject, teacher, file) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("ユーザーがログインしていません。");
  }

  // 1. Firestoreに新しいドキュメント参照を作成してIDを取得
  const newFileRef = doc(collection(db, "files"));
  const fileId = newFileRef.id;

  // 2. Storageのパスを決定
  const storagePath = `files/${user.uid}/${fileId}/${file.name.replace(/[/]/g, '_')}`;
  const storageRef = ref(storage, storagePath);

  // 3. ファイルをStorageにアップロード
  const uploadResult = await uploadBytes(storageRef, file);

  // 4. ダウンロードURLを取得
  const url = await getDownloadURL(uploadResult.ref);

  // 5. Firestoreに完全な情報を保存
  await setDoc(newFileRef, {
    uid: user.uid,
    year: Number(year),
    name: subject,
    teacher: teacher,
    url: url,
    storagePath: storagePath,
    fileName: file.name,
    createdAt: serverTimestamp()
  });

  return { id: fileId, url: url };
};

// 質問を投稿する関数
window.addQuestion = async (title, content, courseLabel) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("ユーザーがログインしていません。");
  }
  const userProfile = await window.getUserProfile(user.uid);
  const username = userProfile.exists() ? userProfile.data().username : '匿名ユーザー';

  await addDoc(collection(db, "questions"), {
    title: title,
    content: content,
    course_label: courseLabel,
    user: {
      uid: user.uid,
      name: username
    },
    date: serverTimestamp(),
    ans_count: 0,
    good_count: 0,
    is_solved: false
  });
};

// 質問一覧を取得する関数
window.getQuestions = async () => {
  const q = query(collection(db, "questions"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

// ログイン用の関数をグローバルスコープに公開
window.signInWithEmailPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// パスワードリセットメールを送信する関数
window.sendPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// ログイン状態を監視する関数
window.onAuth = (callback) => {
  onAuthStateChanged(auth, callback);
};

// Firestoreからユーザー情報を取得する関数
window.getUserProfile = (uid) => {
  const userDocRef = doc(db, "users", uid);
  return getDoc(userDocRef);
};

// filesコレクションからname,teacher,yearで絞り込み、該当するurlを取得する関数
window.getFileUrlByMeta = async (name, teacher, year) => {
  const filesRef = collection(db, "files");
  const q = query(
    filesRef,
    where("name", "==", name),
    where("teacher", "==", teacher),
    where("year", "==", year)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docData = querySnapshot.docs[0].data();
    return docData.url || null;
  }
  return null;
};