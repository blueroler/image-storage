import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


const response = await fetch(`${databaseUrl}/api_public.json`);
const api_public = initializeApp(await response.json());
const auth = getAuth(api_public);

window.auth = auth;
window.idToken = null; // Ban đầu là null

// Kiểm tra trạng thái đăng nhập
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.body.style.display = "block";
        window.idToken = await user.getIdToken();
        const response = await fetch(`${databaseUrl}/api_private.json?auth=${window.idToken}`);
        const data = await response.json();
        localStorage.setItem("api_private", JSON.stringify(data));
        localStorage.setItem("idToken", await user.getIdToken());
    } else {
        clearToken();
        window.location.href = "login.html";
    }
});

// Xử lý đăng xuất
document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm('Đăng Xuất?')) {
        signOut(auth).then(() => {
            clearToken();
            window.idToken = null;
            window.location.href = "login.html";
        }).catch((error) => {
            console.error("Lỗi đăng xuất:", error);
        });
    }
});

function clearToken() {
    localStorage.setItem("api_private", null);
    localStorage.setItem("idToken", null);
    localStorage.removeItem("api_private");
    localStorage.removeItem("idToken");
    localStorage.setItem("clearToken", Date.now());
    localStorage.removeItem("clearToken");
}

// Khi tab được mở, đánh dấu là session đang hoạt động
window.addEventListener("load", () => {
    sessionStorage.setItem("sessionActive", "true");
});

// Khi tab hoặc trình duyệt đóng, kiểm tra nếu không có session thì xóa localStorage
window.addEventListener("unload", () => {
    if (!sessionStorage.getItem("sessionActive")) {
        localStorage.clear(); // Xóa toàn bộ dữ liệu trong localStorage
    }
});