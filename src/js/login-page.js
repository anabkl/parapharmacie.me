import '../../src/css/main.css';
import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AUTH_MESSAGES = {
  'auth/wrong-password': 'Mot de passe incorrect.',
  'auth/user-not-found': 'Aucun compte trouvé avec cet email.',
  'auth/invalid-email': 'Email invalide.',
  'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
  'auth/invalid-credential': 'Identifiants incorrects.',
};

document.addEventListener('DOMContentLoaded', () => {
  const errorEl = document.getElementById('errorMsg');

  // If already logged in as admin, redirect
  onAuthStateChanged(auth, async user => {
    if (user) {
      const snap = await getDoc(doc(db, 'roles', user.uid));
      if (snap.exists() && snap.data().role === 'admin') {
        window.location.href = '/admin.html';
      }
    }
  });

  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    errorEl.style.display = 'none';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Connexion…';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'roles', cred.user.uid));
      if (snap.exists() && snap.data().role === 'admin') {
        window.location.href = '/admin.html';
      } else {
        errorEl.textContent = 'Accès non autorisé. Ce compte n\'a pas les droits administrateur.';
        errorEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Se connecter';
      }
    } catch (err) {
      errorEl.textContent = AUTH_MESSAGES[err.code] || 'Erreur de connexion. Vérifiez vos identifiants.';
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Se connecter';
    }
  });
});
