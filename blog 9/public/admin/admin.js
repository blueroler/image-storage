dash_addr();

async function dash_addr() {
    const response = await fetch(`${databaseUrl}/public_data/status_element.json`);
    const post = await response.json();

    if (post.dash_addr == 1) {
        admin_dashboard();
    } else if (post.dash_addr == 2) {
        add_blogs();
    } else if (post.dash_addr == 3) {
        manager_blogs();
    } else if (post.dash_addr == 4) {
        manager_temps();
    } else if (post.dash_addr == 5) {
        admin_ads();
    }
}

async function dash_addr_btn(addr) {
    if (!window.idToken) {
        return;
    }

    const postData = { dash_addr: addr };

    await fetch(`${databaseUrl}/public_data/status_element.json?auth=${window.idToken}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });
}


function show_sidebar() {
    const sidebar = document.getElementById("sidebar");
    const content = document.querySelector(".content");

    // Kiểm tra trạng thái sidebar
    if (sidebar.classList.contains("show")) {
        sidebar.classList.remove("show"); // Ẩn sidebar
        content.classList.remove("sidebar-visible"); // Trả lại trạng thái ban đầu cho main
    } else {
        sidebar.classList.add("show"); // Hiển thị sidebar
        content.classList.add("sidebar-visible"); // Đẩy main sang phải
    }
}

function clear_main() {
    document.getElementById('admin-dashboard').classList.add('hide')
    document.getElementById('admin-add-blogs').classList.add('hide')
    document.getElementById('admin-blogs').classList.add('hide')
    document.getElementById('admin-temps').classList.add('hide')
    document.getElementById('admin-ads').classList.add('hide')
}

function admin_dashboard() {
    clear_main();
    dash_addr_btn(1)
    document.getElementById('admin-dashboard').classList.remove('hide')

    ads_status_dash();
    countIdsWithREST();
}

async function ads_status_dash() {
    let script_customer = 'Không có';

    try {
        const response = await fetch(`${databaseUrl}/public_data/ads/ads_script/customer.json`);
        if (response.ok) {
            const customer = await response.json();
            if (customer.script) {
                script_customer = customer.name;
            }
        }
    } catch (error) {
    }

    const adsStatusContainer = document.getElementById('ads-status');
    let htmlContent = '';

    try {
        const response1 = await fetch(`${databaseUrl}/public_data/status_element.json`);
        const post1 = await response1.json();

        const adsStatus = post1.ads === 0 ? 'Off' : 'On';
        const adsStatusColor = post1.ads === 0 ? 'red' : 'blue';

        htmlContent = `
        <div style="display: flex; justify-content: space-around; align-items: center; gap: 20px; margin-bottom: 30px;">
            <div style="display: inline-block; width: 150px; text-align: center; color: ${adsStatusColor};">
                <h3>ADS Banner Status: ${adsStatus}</h3>
            </div>
            <div style="display: inline-block; width: 150px; text-align: center; color: blue;">
                <h3>ADS script: ${script_customer}</h3>
            </div>
        </div>`;
    } catch (error) {
        console.error("Error fetching status data:", error);
        return;
    }
    adsStatusContainer.innerHTML = htmlContent;
}


async function countIdsWithREST() {
    const news_post = await fetch(`${databaseUrl}/public_data/news.json?shallow=true`);
    const data1 = await news_post.json();
    const count_news = Object.keys(data1 || {}).length; // Đếm số lượng key

    const temps_post = await fetch(`${databaseUrl}/public_data/temps.json?shallow=true`);
    const data2 = await temps_post.json();
    const count_temp = Object.keys(data2 || {}).length;
    count_total(count_news, count_temp);
}


async function count_total(count1, count2) {
    document.getElementById('count-total').innerHTML = `<h4>${(count1 + count2)}</h4>`;
    document.getElementById('count-posted').innerHTML = `<h4>${count1}</h4>`;
    document.getElementById('count-draft').innerHTML = `<h4>${count2}</h4>`;
}

async function add_blogs() {
    clear_main();
    dash_addr_btn(2)

    document.getElementById('admin-add-blogs').classList.remove('hide')

    const response = await fetch(`${databaseUrl}/public_data/news.json?shallow=true`);
    const news = await response.json();

    let putArray = Object.keys(news).sort();
    document.getElementById('category').innerHTML = '';

    for (let post of putArray) {
        document.getElementById('category').innerHTML += `<option value="${post}"></option>`;
    }
    putArray = [];
}



// let fileInput = document.getElementById("image-upload-edit");
// let image = document.getElementById("image-edit");
// let load_img_btn = document.getElementById("use-btn");

// let cropper = "";

// // Xử lý sự kiện khi chọn file
// function imageData_edit(event) {
//     const file = event.target.files[0];
//     if (!file) return;

//     const maxSize = 2096 * 1024;
//     if (file.size > maxSize) {
//         alert('Dung lượng ảnh vượt quá 2 MB. Vui lòng chọn ảnh nhỏ hơn.');
//         return;
//     }

//     if (!file.type.startsWith('image/')) {
//         alert('Vui lòng chọn một file ảnh!');
//         return;
//     }

//     openImageCropper();
//     let reader = new FileReader();
//     reader.readAsDataURL(file);

//     reader.onload = () => {
//         image.setAttribute("src", reader.result);

//         if (cropper) {
//             cropper.destroy();
//         }

//         cropper = new Cropper(image, {
//             aspectRatio: 4 / 3,
//             viewMode: 1,
//             ready() {
//                 const imageData = cropper.getImageData();

//                 let cropBoxWidth = imageData.width * 0.98;
//                 let cropBoxHeight = cropBoxWidth / (4 / 3);

//                 if (cropBoxHeight > imageData.height * 0.98) {
//                     cropBoxHeight = imageData.height * 0.98;
//                     cropBoxWidth = cropBoxHeight * (4 / 3);
//                 }

//                 cropper.setCropBoxData({
//                     left: (imageData.width - cropBoxWidth) / 2,
//                     top: (imageData.height - cropBoxHeight) / 2,
//                     width: cropBoxWidth,
//                     height: cropBoxHeight
//                 });
//             }
//         });

//         load_img_btn.classList.remove("hide");
//     };
// }

// load_img_btn.addEventListener("click", (e) => {
//     e.preventDefault();
//     if (!cropper) return;

//     // let resizedCanvas = cropper.getCroppedCanvas({ width: 320, height: 240 });
//     let resizedCanvas = cropper.getCroppedCanvas({ width: 480, height: 360 });
//     let imgSrc = resizedCanvas.toDataURL("image/webp", 0.8);

//     document.querySelector('.wrapper').classList.remove('show');
//     document.querySelector('.wrapper').classList.add('hide');
//     document.body.classList.remove('blur');

//     cropper.destroy();
//     cropper = null;
//     load_img_btn.classList.add("hide");
//     image.src = "";
//     addImage_edit(imgSrc);
// });




// Hàm mở Image Cropper
function openImageCropper() {
    document.querySelector('.wrapper').classList.remove('hide');
    document.querySelector('.wrapper').classList.add('show');
    document.body.classList.add('blur');
}

// Hàm đóng Image Cropper
function closeImageCropper() {
    document.querySelector('.wrapper').classList.remove('show');
    document.querySelector('.wrapper').classList.add('hide');
    document.body.classList.remove('blur');

    fileInput.value = '';

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    // Ẩn nút tải xuống và xóa ảnh xem trước
    load_img_btn.classList.add("hide");
    image.src = ""; // Đặt lại ảnh cropper về rỗng
}


// function addImagelink() {
//     const imgSrc = prompt('Insert URL');
//     addImage_edit(imgSrc)
// }

function addImagelink() {
    const imgSrc = document.getElementById('img-url').value;
    addImage_edit(imgSrc)
}


let img_title = '';

function addImage_edit(imgSrc) {
    img_title = '';

    const img_data = `
                    <div class="posts-img">
                        <img src="${imgSrc}" alt="" />
                    </div>
                    <button style="background: red;" onclick="dele_temp()">Xóa</button>
                `;

    const show_img = document.getElementById('content-img');
    show_img.innerHTML = img_data;
    img_title = imgSrc;
};

function dele_temp() {
    document.getElementById('content-img').innerHTML = "";
    // fileInput.value = '';
    img_title = '';
}

document.getElementById('put-blogs').addEventListener('submit', savePost);

async function savePost(event) {
    event.preventDefault();

    if (img_title == '') {
        alert('Bạn phải Get ảnh trước');
        return;
    }

    const post_link = document.getElementById('post-link').value;
    const topic = document.getElementById('get-category').value;
    const name = document.getElementById('name').value;
    // const content = '&nbsp;';

    // Tính timestamp ngược
    const MAX_TIMESTAMP = 9999999999999; // Giá trị rất lớn để đảm bảo tính ngược
    const postId = (MAX_TIMESTAMP - Date.now()) + "-" + post_link;

    // Tạo dữ liệu bài viết
    const postData = {
        topic,
        name,
        summary: img_title,
        timestamp: Date.now(),
    };

    await fetch(`${databaseUrl}/public_data/temps/${postId}.json?auth=${window.idToken}`, {
        method: 'PUT', // Luôn dùng PUT vì ID là do ta tự tạo
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });

    // Reset form và các biến liên quan
    document.getElementById('put-blogs').reset();
    img_title = '';
    dele_temp();
    manager_temps();
}

async function manager_blogs() {
    clear_main();
    dash_addr_btn(3)
    document.getElementById('admin-blogs').classList.remove('hide')

    const response = await fetch(`${databaseUrl}/public_data/news.json?shallow=true`);
    const news = await response.json();

    let putArray = Object.keys(news).sort();

    const show = document.getElementById('selec-topic');
    show.innerHTML = '';
    for (let topic of putArray) {
        show.innerHTML += `<button onclick="scroll_topic('${topic}')">${topic}</button>`;
    }
}

async function scroll_topic(topic) {
    let count = 1;
    const response = await fetch(`${databaseUrl}/public_data/news/${topic}.json`);
    const posts = await response.json();

    const postsArray = Object.entries(posts || {}).map(([id, item]) => ({
        id,
        ...item,
    }));

    postsArray.sort((a, b) => b.timestamp - a.timestamp);

    const listContainer = document.getElementById('scroll-topic');
    listContainer.innerHTML = '';

    let htmlContent = `
    <tr>
        <td style="width: 50px; height: 50px;"><h4>STT</h4></td>
        <td style="min-width: 100px; height: 50px;"><h4>Tên bài viết </h4></td>
        <td><h4>Chủ đề </h4></td>
        <td><h4>Thời Gian </h4></td>
        <td style="min-width: 80px; height: 50px;"><h4>Hành động </h4></td>
    </tr> `;
    for (let post of postsArray) {
        htmlContent += `
        <tr>
            <td>${count}</td>
            <td>${textOutput(post.name)}</td>
            <td>${textOutput(post.topic)}</td>
            <td>${new Date(post.timestamp).toLocaleDateString()}</td>
            <td>
                <button title="Edit" onclick="push_to_temp('${post.id}', '${post.topic}')"><i class='bx bx-edit'></i></button>
                <button title="Pin" onclick="pin_to_top('${post.id}', '${post.topic}')"><i class='bx bx-pin'></i></button>
            </td>
        </tr> `;
        count++;
    }
    listContainer.innerHTML = htmlContent;
}

async function pin_to_top(Id, topic) {

    if (confirm('Bài viết đã ghim trước đó sẽ bị thay thế ?')) {
        const post = {
            topic,
            Id,
        };

        await fetch(`${databaseUrl}/public_data/pins.json?auth=${window.idToken}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });
    }
}

async function push_to_temp(Id, topic) {

    if (confirm('Nếu bạn sửa Bài viết này sẽ bị ẨN đi')) {
        const response = await fetch(`${databaseUrl}/public_data/news/${topic}/${Id}.json`);
        const post = await response.json();

        await fetch(`${databaseUrl}/public_data/temps/${Id}.json?auth=${window.idToken}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });
        await fetch(`${databaseUrl}/public_data/news/${topic}/${Id}.json?auth=${window.idToken}`, { method: 'DELETE' });
        Edit(Id);
    }
}

function Edit(id) {
    // window.location.href = `edit.html?id=${id}`;
    window.open(`edit.html?id=${id}`, '_blank');
}

async function manager_temps() {
    clear_main();
    dash_addr_btn(4)
    document.getElementById('admin-temps').classList.remove('hide')

    let count = 1;
    const response = await fetch(`${databaseUrl}/public_data/temps.json`);
    const posts = await response.json();

    const postsArray = Object.entries(posts || {}).map(([id, item]) => ({
        id,
        ...item,
    }));

    const temp = document.getElementById('table-temps');
    temp.innerHTML = '';

    let htmlContent = `
                    <tr>
                        <td style="width: 50px; height: 50px;"><h4>STT</h4></td>
                        <td style="min-width: 100px; height: 50px;"><h4>Tên bài viết </h4></td>
                        <td><h4>Chủ đề </h4></td>
                        <td><h4>Thời Gian </h4></td>
                        <td style="min-width: 80px; height: 50px;"><h4>Hành động </h4></td>
                    </tr>
    `;
    for (let post of postsArray) {
        htmlContent += `
                    <tr>
                        <td>${count}</td>
                        <td>${textOutput(post.name)}</td>
                        <td><h4>${post.topic}</h4></td>
                        <td>${new Date(post.timestamp).toLocaleDateString()}</td>
                        <td>
                            <button title="Edit" onclick="Edit('${post.id}')"><i class='bx bx-edit'></i></button>
                    </tr>
    `;
        count++;
    }
    temp.innerHTML = htmlContent;
}

function admin_ads() {
    clear_main();
    dash_addr_btn(5)
    document.getElementById('admin-ads').classList.remove('hide')

    check_ads_status();
    put_ads_script();
}

async function check_ads_status() {

    const dataContainer = document.getElementById('check-ads-status');
    const response = await fetch(`${databaseUrl}/public_data/ads.json`);
    const post = await response.json();

    let htmlContent = '';
    if (post.ads_status == 0) {
        htmlContent = `
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 30px;">
            <div style="display: inline-block; width: 150px; text-align: center; color: red;">Đang TẮT</div>
            <button id="button-check-data" disabled style="width: 100px;" onclick="ads_status(1)"><i class='bx bx-power-off'></i></button>
        </div>`;
    } else {
        htmlContent = `
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 30px;">
            <div style="display: inline-block; width: 150px; text-align: center; color: blue;">Đang BẬT</div>
            <button id="button-check-data" enable style="width: 100px;" onclick="ads_status(0)"><i class='bx bx-low-vision'></i></button>
        </div>`;
    }

    dataContainer.innerHTML = htmlContent;
    const myButton = document.getElementById('button-check-data');
    put_ads_banner(myButton);

}

async function ads_status(key) {
    const postData = {
        ads_status: key,
    };

    const sure = key == '1'
        ? 'Bạn có chắc chắn muốn BẬT quảng cáo?'
        : 'Bạn có chắc chắn muốn TẮT quảng cáo?';

    const method = 'PATCH';
    const url = `${databaseUrl}/public_data/ads.json?auth=${window.idToken}`;
    if (confirm(sure)) {
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });
        check_ads_status();
    }
}

async function auto_off_ads() {
    const postData = {
        ads_status: 0,
    };

    const method = 'PATCH';
    const url = `${databaseUrl}/public_data/ads.json?auth=${window.idToken}`;
    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });
    check_ads_status();
}


async function put_ads_banner(myButton) {
    try {
        // Gắn sự kiện submit cho form
        document.getElementById('add-banner-ads').addEventListener('submit', saveAdsBanner);

        // Lấy dữ liệu từ Firebase
        const response = await fetch(`${databaseUrl}/public_data/ads/ads_banner.json`);

        // Kiểm tra nếu phản hồi không thành công
        if (!response.ok) {
            throw new Error(`Lỗi khi lấy dữ liệu: ${response.status}`);
        }

        const news = await response.json();
        const newsArray = Object.entries(news || {}).map(([id, item]) => ({ id, ...item }));
        newsArray.sort((a, b) => b.timestamp - a.timestamp);

        // Tạo nội dung hiển thị
        let htmlData = `
            <tr>
                <td style="width: 80px;"><h4>Thứ tự</h4></td>
                <td><h4>Img</h4></td>
                <td><h4>ADS</h4></td>
                <td style="width: 170px;"><h4>Hành động</h4></td>
            </tr>
        `;

        if (newsArray.length === 0) {
            const response1 = await fetch(`${databaseUrl}/public_data/ads.json`);
            const post1 = await response1.json();

            if (post1.ads_status == 0) {
                htmlData += `
                <tr>
                    <td colspan="4" style="text-align: center;">Không có dữ liệu.</td>
                </tr>
            `;
            } else {
                auto_off_ads();
                htmlData += `
                <tr>
                    <td colspan="4" style="text-align: center;">Không có dữ liệu.</td>
                </tr>
            `;
            }
        } else {
            myButton.disabled = false;
            newsArray.forEach((item, index) => {
                htmlData += `
                    <tr>
                        <td><p>${index + 1}</p></td>
                        <td><p>${item.img}</p></td>
                        <td>${item.ads}</td>
                        <td>
                            <button onclick="readyForUpdate('${item.id}', this)"><i class='bx bx-edit'></i></button>
                            <button onclick="moveUp('${item.id}', ${index})"><i class='bx bx-up-arrow-alt'></i></button>
                            <button onclick="removeAds('${item.id}')"><i class='bx bx-power-off'></i></button>
                            <button onclick="moveDown('${item.id}', ${index})"><i class='bx bx-down-arrow-alt'></i></button>
                        </td>
                    </tr>
                `;
            });
        }

        // Hiển thị nội dung lên bảng
        document.querySelector('#get-banner-ads').innerHTML = htmlData;

    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);

        // Hiển thị thông báo lỗi lên giao diện
        document.querySelector('#get-banner-ads').innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: red;">Lỗi khi tải dữ liệu. Vui lòng thử lại sau.</td>
            </tr>
        `;
    }
}


async function put_ads_script() {
    document.getElementById('add-script-ads').addEventListener('submit', saveAdsscript);
    try {
        // Lấy dữ liệu từ Firebase
        const response = await fetch(`${databaseUrl}/public_data/ads/ads_script/customer.json`);
        const customer = await response.json();

        // Kiểm tra nếu không có dữ liệu
        if (!customer) {
            document.querySelector('#get-script-ads').innerHTML = '<tr><td colspan="3">Không có dữ liệu.</td></tr>';
            return;
        }

        const htmlData = `
            <tr>
                <td><h4>Name</h4></td>
                <td><h4>script</h4></td>
                <td style="width: 150px;"><h4>Hành động</h4></td>
            </tr>
            <tr>
                <td>${customer.name}</td>
                <td>${textOutput(customer.script)}</td>
                <td>
                    <button onclick="removescriptAd()"><i class='bx bx-power-off'></i></button>
                </td>
            </tr>
        `;

        document.querySelector('#get-script-ads').innerHTML = htmlData;
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        document.querySelector('#get-script-ads').innerHTML = '<tr><td colspan="3">Lỗi tải dữ liệu.</td></tr>';
    }
}


async function moveUp(id, index) {
    const response = await fetch(`${databaseUrl}/public_data/ads/ads_banner.json`);
    const news = await response.json();
    const newsArray = Object.entries(news || {}).map(([id, item]) => ({ id, ...item }));
    newsArray.sort((a, b) => b.timestamp - a.timestamp);

    if (index > 0) {
        const currentItem = newsArray[index];
        const prevItem = newsArray[index - 1];

        // Hoán đổi timestamp
        const updates = {
            [`/ads/ads_banner/${currentItem.id}/timestamp`]: prevItem.timestamp,
            [`/ads/ads_banner/${prevItem.id}/timestamp`]: currentItem.timestamp,
        };

        await fetch(`${databaseUrl}/public_data/.json?auth=${window.idToken}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });

        check_ads_status(); // Load lại dữ liệu
    }
}

async function moveDown(id, index) {
    const response = await fetch(`${databaseUrl}/public_data/ads/ads_banner.json`);
    const news = await response.json();
    const newsArray = Object.entries(news || {}).map(([id, item]) => ({ id, ...item }));
    newsArray.sort((a, b) => b.timestamp - a.timestamp);

    if (index < newsArray.length - 1) {
        const currentItem = newsArray[index];
        const nextItem = newsArray[index + 1];

        // Hoán đổi timestamp
        const updates = {
            [`/ads/ads_banner/${currentItem.id}/timestamp`]: nextItem.timestamp,
            [`/ads/ads_banner/${nextItem.id}/timestamp`]: currentItem.timestamp,
        };

        await fetch(`${databaseUrl}/public_data/.json?auth=${window.idToken}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });

        check_ads_status(); // Load lại dữ liệu
    }
}

async function saveAdsBanner(event) {
    event.preventDefault();

    try {
        const response = await fetch(`${databaseUrl}/public_data/ads/ads_banner.json`);
        const news = await response.json();
        const newsArray = Object.entries(news || {}).map(([id, item]) => ({ id, ...item }));
        newsArray.sort((a, b) => b.timestamp - a.timestamp);

        if (newsArray.length === 0) {
            auto_off_ads();
            saveAdsBanner_check();
        } else {
            error
        }

    } catch (error) {
        saveAdsBanner_check();
    }
}

async function saveAdsBanner_check() {
    const data1 = document.getElementById('img-id').value.trim();
    const data2 = document.getElementById('ads-id').value.trim();
    const newAd = {
        img: data1,
        ads: data2,
        timestamp: Date.now(),
    };

    try {
        const response = await fetch(`${databaseUrl}/public_data/ads/ads_banner.json?auth=${window.idToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAd),
        });

        if (response.ok) {
            alert('Thêm thành công!');
            document.getElementById('add-banner-ads').reset();
            check_ads_status();
        } else {
            alert('Thêm thất bại.');
        }
    } catch (error) {
        alert('Đã xảy ra lỗi khi thêm.');
    }
}

async function saveAdsscript(event) {
    event.preventDefault(); // Ngăn chặn reload form

    // Lấy dữ liệu từ form
    const data1 = document.getElementById('name-ads').value.trim();
    const data2 = document.getElementById('script-ads-id').value.trim();

    // Tạo object mới
    const newAd = {
        name: data1,
        script: data2,
    };

    try {
        // Gửi yêu cầu PUT để ghi đè tại key "script_ad"
        const response = await fetch(`${databaseUrl}/public_data/ads/ads_script/customer.json?auth=${window.idToken}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAd),
        });

        if (response.ok) {
            alert('Cập nhật thành công!');
            document.getElementById('add-script-ads').reset(); // Xóa form sau khi lưu
            put_ads_script(); // Cập nhật lại dữ liệu
        } else {
            alert('Cập nhật thất bại.');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật dữ liệu:', error);
        alert('Đã xảy ra lỗi khi cập nhật.');
    }
}

async function removescriptAd() {
    if (confirm('Bạn có chắc chắn muốn xóa quảng cáo này không?')) {
        try {
            const response = await fetch(`${databaseUrl}/public_data/ads/ads_script/customer.json?auth=${window.idToken}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Xóa thành công!');
                put_ads_script(); // Cập nhật lại hiển thị
            } else {
                alert('Xóa thất bại.');
            }
        } catch (error) {
            console.error('Lỗi khi xóa dữ liệu:', error);
            alert('Đã xảy ra lỗi khi xóa.');
        }
    }
}


async function removeAds(key) {
    try {
        const response = await fetch(`${databaseUrl}/public_data/ads/ads_banner/${key}.json?auth=${window.idToken}`, { method: 'DELETE' });
        if (response.ok) {
            alert('Xóa thành công!');
            check_ads_status();
        } else {
            alert('Xóa thất bại.');
        }
    } catch (error) {
        console.error('Lỗi khi xóa dữ liệu:', error);
        alert('Đã xảy ra lỗi khi xóa.');
    }
}

function readyForUpdate(key, elem) {
    const siblingTd = elem.parentElement.parentElement.getElementsByTagName('td');
    for (var i = 1; i < siblingTd.length - 1; i++) {
        siblingTd[i].contentEditable = true;
        siblingTd[i].classList.add('temp-update-class');
    }
    elem.setAttribute('onclick', `updateNow('${key}', this)`);
    elem.innerHTML = 'Send';
}

async function updateNow(key, elem) {
    const contentId = document.querySelectorAll('.temp-update-class');
    const obj = {
        img: contentId[0].textContent.trim(),
        ads: contentId[1].textContent.trim(),
    };

    try {
        const response = await fetch(`${databaseUrl}/public_data/ads/ads_banner/${key}.json?auth=${window.idToken}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj),
        });

        if (response.ok) {
            contentId.forEach(cell => {
                cell.contentEditable = false;
                cell.classList.remove('temp-update-class');
            });
            elem.setAttribute('onclick', `readyForUpdate('${key}', this)`);
            elem.innerHTML = 'Edit';
            alert('Cập nhật thành công!');
        } else {
            alert('Cập nhật thất bại.');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật dữ liệu:', error);
        alert('Đã xảy ra lỗi khi cập nhật.');
    }
}