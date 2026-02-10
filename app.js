// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update, get, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

// === تنظیمات اختصاصی Firebase شما ===
const firebaseConfig = {
    apiKey: "AIzaSyDuQsAcYik1vOkOYrQwOFNNWoUcBQohD1I",
    authDomain: "souq-al-maftuh-iran.firebaseapp.com",
    databaseURL: "https://souq-al-maftuh-iran-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "souq-al-maftuh-iran",
    storageBucket: "souq-al-maftuh-iran.firebasestorage.app",
    messagingSenderId: "314728424476",
    appId: "1:314728424476:web:72d07c3a97e2e17434ebd9"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
export { ref, push, onValue, update, get, remove, storageRef, uploadBytes, getDownloadURL };

// === تابع ترجمه خودکار رایگان (استفاده از API عمومی) ===
export async function autoTranslate(text, targetLang = 'fa') {
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
        const data = await response.json();
        return data.responseData.translatedText || text;
    } catch (error) {
        console.error("Error during translation:", error);
        return text; // Fallback to original text on error
    }
}

// === توابع کاربردی ===

// برای تولید یک ID تصادفی برای کاربران ناشناس
export function generateUserId() {
    let userId = localStorage.getItem('souqUserId');
    if (!userId) {
        userId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('souqUserId', userId);
    }
    return userId;
}

// مدیریت تاریخ انقضای اشتراک
export function isVipExpired(user) {
    if (!user || user.tier !== 'vip' || !user.vipExpires) {
        return true; // Not VIP or no expiry date
    }
    return user.vipExpires < Date.now();
}

// ذخیره آگهی در دیتابیس
export async function saveAdToDB(adData, file) {
    if (file) {
        const imageRef = storageRef(storage, `ad_images/${adData.ownerId}_${Date.now()}_${file.name}`);
        await uploadBytes(imageRef, file);
        adData.imageUrl = await getDownloadURL(imageRef);
    }
    return push(ref(db, 'ads'), adData);
}

// بروزرسانی تعداد آگهی کاربر
export async function updateUserAdCount(userId) {
    const userRef = ref(db, `users/${userId}`);
    const userSnap = await get(userRef);
    const userData = userSnap.val() || { adCount: 0 };
    update(userRef, { adCount: (userData.adCount || 0) + 1 });
}