// Firebase SDK の import
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

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