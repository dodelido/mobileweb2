import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  ConfirmationResult,
  RecaptchaVerifier,
} from "firebase/auth";

import type {
  AuthUser,
  IAuthService,
  EmailPasswordCredentials,
  PhoneCredentials,
} from "./auth-interface";

// 🔐 Firebase config (ใช้ project เดิมจาก Lab06)
const firebaseConfig = {

  apiKey: "AIzaSyCzQSU1uXHP81ibTJznItKlZmWMumP4qx4",

  authDomain: "lab6webapp.firebaseapp.com",

  projectId: "lab6webapp",

  storageBucket: "lab6webapp.firebasestorage.app",

  messagingSenderId: "682699492471",

  appId: "1:682699492471:web:11aecdb5efd1d624acca72",

  measurementId: "G-WLN1CEEHS0"

};



// init
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

// mapper
function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email ?? null,
    phoneNumber: u.phoneNumber ?? null,
    displayName: u.displayName ?? null,
    photoUrl: u.photoURL ?? null,
  };
}

// ===== Phone auth helpers =====
let verifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

const recaptchaContainerId = "recaptcha-container";

function getRecaptchaVerifier(): RecaptchaVerifier {
  if (!verifier) {
    verifier = new RecaptchaVerifier(
      firebaseAuth,
      recaptchaContainerId,
      { size: "invisible" }
    );
  }
  return verifier;
}

// ===== Service =====
export class FirebaseWebAuthService implements IAuthService {
  async getCurrentUser(): Promise<AuthUser | null> {
    return firebaseAuth.currentUser
      ? mapUser(firebaseAuth.currentUser)
      : null;
  }

  async loginWithEmailPassword(
    creds: EmailPasswordCredentials
  ): Promise<AuthUser> {
    const r = await signInWithEmailAndPassword(
      firebaseAuth,
      creds.email,
      creds.password
    );
    return mapUser(r.user);
  }

  async loginWithGoogle(): Promise<AuthUser> {
    const provider = new GoogleAuthProvider();
    const r = await signInWithPopup(firebaseAuth, provider);
    return mapUser(r.user);
  }

  async startPhoneLogin(
    creds: PhoneCredentials
  ): Promise<{ verificationId: string }> {
    const verifier = getRecaptchaVerifier();
    confirmationResult = await signInWithPhoneNumber(
      firebaseAuth,
      creds.phoneNumberE164,
      verifier
    );
    return { verificationId: confirmationResult.verificationId };
  }

  async confirmPhoneCode(payload: {
    verificationId: string;
    verificationCode: string;
  }): Promise<AuthUser> {
    if (!confirmationResult) {
      throw new Error("No confirmation result");
    }
    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }

  async logout(): Promise<void> {
    await firebaseAuth.signOut();
  }
}
