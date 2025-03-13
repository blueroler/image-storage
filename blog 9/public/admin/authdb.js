import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

let api_private = JSON.parse(localStorage.getItem("api_private"));

try {
    const app_1 = initializeApp(api_private);
    const auth_1 = getAuth(app_1);

    window.auth_1 = auth_1;
    window.idToken_1 = null;

    // Kiểm tra trạng thái đăng nhập
    onAuthStateChanged(auth_1, async (user_1) => {
        if (user_1) {
            document.querySelector('.logindb').style.display = "none";
            document.querySelector('.logoutBtn').style.display = "block";
            window.idToken = localStorage.getItem("idToken");
            window.idToken_1 = await user_1.getIdToken();
            get_post_info();
            setTimeout(() => {
                preview_and_edit();
            }, 100);
        } else {
            // window.location.href = "logindb.html";
            document.querySelector('.logindb').style.display = "block";
        }
    });

} catch (error) {
    console.log('Bạn cần phải đăng nhập trang Admin')
    document.getElementById('need-admin').innerHTML = `<h1>Bạn cần phải đăng nhập trang Admin</h1>`;
}


// Xử lý đăng xuất
document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm('Đăng Xuất khỏi Trang chỉnh sửa?')) {
        signOut(auth_1).then(() => {
            window.idToken_1 = null;
            document.getElementById("loginForm").reset();
            document.querySelector('.logindb').style.display = "none";
            window.location.href = "index.html";
        }).catch((error) => {
            console.error("Lỗi đăng xuất:", error);
        });
    }
});

window.addEventListener("storage", (event) => {
    if (event.key === "clearToken") {
        localStorage.setItem("idToken", null);
        localStorage.removeItem("idToken");
        api_private = null;
        window.idToken = null;
        console.log('Trang Admin đã bị đăng xuất')
    }
});

// Khi tab được mở, đánh dấu là session đang hoạt động
window.addEventListener("load", () => {
    sessionStorage.setItem("sessionActive", "true");
});

// Khi tab hoặc trình duyệt đóng, kiểm tra nếu không có session thì xóa localStorage
window.addEventListener("unload", () => {
    if (!sessionStorage.getItem("sessionActive")) {
        localStorage.setItem("idToken", null);
        localStorage.removeItem("idToken");
        api_private = null;
        window.idToken = null;
        localStorage.clear(); // Xóa toàn bộ dữ liệu trong localStorage
        console.log('Trang Admin đã bị đóng')
    }
});