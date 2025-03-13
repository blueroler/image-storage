const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

async function get_post_info() {

    document.getElementById('edit-page').innerHTML = postId;
    const dataContainer = document.getElementById('hbody');
    if (!postId) {
        return;
    }

    try {
        const response = await fetch(`${databaseUrl}/public_data/temps/${postId}.json`);
        const post = await response.json();

        // Kiểm tra và hiển thị dữ liệu
        let htmlContent = '';
        htmlContent += `
            <tr>
                <td style="width: 100px; height: 40px;"><h4>Tên bài viết</h4></td>
                <td>${textOutput(post.name)}</td>
            </tr>
            <tr>
                <td style="width: 100px; height: 40px;"><h4>Chủ đề</h4></td>
                <td><b>${textOutput(post.topic)}</b></td>
            </tr>
            <tr>
                <td style="width: 100px; height: 40px;"><h4>Thumbnail</h4></td>
                <td><img class="list-img" src="${post.summary}" alt="${post.name}" /></td>
            </tr>
            <tr>
                <td style="width: 100px; height: 40px;"><h4>Ngày đăng</h4></td>
                <td><small>${new Date(post.timestamp).toLocaleString()}</small></td>
            </tr>
        `;

        dataContainer.innerHTML = htmlContent;
        document.querySelector('.view-container').style.display = "block";
        document.querySelector('.edit-container').style.display = "block";
    } catch (error) {
        document.querySelector('.view-container').style.display = "none";
        document.querySelector('.edit-container').style.display = "none";
        console.error('Đã xảy ra lỗi khi lấy dữ liệu:', error);
    }
}


async function preview_and_edit() {
    if (!postId) {
        alert('Không tìm thấy ID bài viết!');
        return;
    }

    const response = await fetch(`${databaseUrl_post}/post_content/${postId}.json`);
    if (!response.ok) {
        alert('Không thể lấy dữ liệu từ Server.');
        return;
    }

    const data = await response.json();
    content.innerHTML = data;
    toggleSaveButton(true);
}

const content = document.getElementById('content');
const showCode = document.getElementById('show-code');
const fontSizeDisplay = document.getElementById('font-size-display');
let isCodeActive = false;
let currentFontSize = 16;

function formatDoc(cmd, value = null) {
    document.execCommand(cmd, false, value);
    focusEditor();
    updateActiveButtons();
}

function addLink() {
    const url = prompt('Insert URL');
    if (url) formatDoc('createLink', url);
}

function addImagelink() {
    const imgSrc = prompt('Insert URL');
    addImage_edit(imgSrc)
}


let fileInput = document.getElementById("image-upload-edit");
let image = document.getElementById("image");
let load_img_btn = document.getElementById("use-btn");

let cropper = "";

// Xử lý sự kiện khi chọn file
function imageData_edit() {
    openImageCropper();
    let reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);

    reader.onload = () => {
        image.setAttribute("src", reader.result);

        if (cropper) {
            cropper.destroy();
        }

        // Khởi tạo cropper mới
        cropper = new Cropper(image, {
            aspectRatio: 16 / 9,
            viewMode: 1,
            ready() {
                const imageData = cropper.getImageData();

                // Tính toán vùng cắt tối ưu
                cropBoxWidth = imageData.width * 0.98;
                let cropBoxHeight = cropBoxWidth / (16 / 9);

                if (cropBoxHeight > imageData.height * 0.98) {
                    cropBoxHeight = imageData.height * 0.98;
                    cropBoxWidth = cropBoxHeight * (16 / 9);
                }

                // Đặt vùng cắt tối ưu và canh giữa
                cropper.setCropBoxData({
                    left: (imageData.width - cropBoxWidth) / 2,
                    top: (imageData.height - cropBoxHeight) / 2,
                    width: cropBoxWidth,
                    height: cropBoxHeight
                });
            }
        });

        load_img_btn.classList.remove("hide");
    };
};

// Xử lý sự kiện khi nhấn nút tải xuống
load_img_btn.addEventListener("click", (e) => {
    e.preventDefault();

    // Xuất canvas dưới dạng JPEG với chất lượng 0.8 (80%)
    let imgSrc = cropper.getCroppedCanvas({}).toDataURL("image/jpeg", 0.8);
    closeImageCropper();
    addImage_edit(imgSrc);
});



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

    load_img_btn.classList.add("hide");
    image.src = "";
}




function triggerImageUpload_edit() {
    // Mở dialog chọn file ảnh
    document.getElementById('image-upload-edit').click();
}

function addImage_edit(imgSrc) {

    if (imgSrc) {
        const imgTag = `
            <br>
            <div class="posts-img">
                <img src="${imgSrc}" alt="" />
            </div>
            <br>
        `;

        // Chèn trực tiếp vào vùng soạn thảo
        insertAtCaret(content, imgTag); // Chèn vào vùng soạn thảo
        checkEditorContent(); // Cập nhật trạng thái nút "Save"
    }
}



function triggerImageUpload() {
    // Mở dialog chọn file ảnh
    document.getElementById('image-upload').click();
}

function addImage(event) {
    const file = event.target.files[0]; // Lấy file từ input

    if (file) {
        // Giới hạn dung lượng tối đa 2096 KB (2 MB)
        const maxSize = 2096 * 1024; // 2096 KB tính theo byte
        if (file.size > maxSize) {
            alert('Dung lượng ảnh vượt quá 2 MB. Vui lòng chọn ảnh nhỏ hơn.');
            return;
        }

        // Kiểm tra file có phải là ảnh không
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn một file ảnh!');
            return;
        }

        const reader = new FileReader();

        // Đọc file ảnh và chuyển sang Base64
        reader.onload = function (e) {
            const imgTag = `
            <br>
            <div class="posts-img">
                <img src="${e.target.result}" alt="" />
            </div>
            <br>`;

            insertAtCaret(content, imgTag); // Chèn vào vùng soạn thảo
            checkEditorContent(); // Cập nhật trạng thái nút "Save"
            let file_option1 = document.getElementById("image-upload");
            file_option1.value = "";
        };

        reader.readAsDataURL(file); // Đọc file dưới dạng Base64
    } else {
        alert('Không có file được chọn.');
    }
}



function adjustFontSize(change) {
    currentFontSize = Math.min(Math.max(currentFontSize + change, 8), 72); // Giới hạn 8px đến 72px
    fontSizeDisplay.textContent = currentFontSize;
    document.execCommand('fontSize', false, 7); // Tạm thời sử dụng size 7
    document.querySelectorAll('font[size="7"]').forEach(font => {
        font.removeAttribute('size');
        font.style.fontSize = `${currentFontSize}px`;
    });
    focusEditor();
}

function insertOrderedList() {
    document.execCommand('insertOrderedList');
}

function insertUnorderedList() {
    document.execCommand('insertUnorderedList');
}

function applyHeading() {
    const headingType = document.getElementById('heading-select').value;
    formatDoc('formatBlock', headingType);
}

function focusEditor() {
    content.focus();
}

function updateActiveButtons() {
    const buttons = document.querySelectorAll('.toolbar button');
    buttons.forEach(button => {
        const command = button.getAttribute('onclick');
        if (command && document.queryCommandState(command)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

content.addEventListener('input', checkEditorContent);

function checkEditorContent() {
    const hasText = content.innerHTML.trim().length;
    const hasElements = content.querySelector('*');
    if (hasText > 0 || hasElements !== null) {
        toggleSaveButton(true);
        formatDoc('justifyFull');
    } else {
        toggleSaveButton(false);
    }
}

function toggleSaveButton(enable) {
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = !enable;
    saveBtn.classList.toggle('disabled', !enable);
}

showCode.addEventListener('click', () => {
    isCodeActive = !isCodeActive;
    showCode.dataset.active = isCodeActive;

    if (isCodeActive) {
        content.textContent = content.innerHTML;
        content.setAttribute('contenteditable', false);
    } else {
        content.innerHTML = content.textContent;
        content.setAttribute('contenteditable', true);
    }
});

async function savePost(event) {
    event.preventDefault();

    const contentHtml = content.innerHTML.trim();
    if (!contentHtml) return;

    const url = `${databaseUrl_post}/post_content/${postId}.json?auth=${window.idToken_1}`;

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contentHtml),
        });

        if (response.ok) {
            alert("✅ Lưu dữ liệu thành công!");
        } else {
            throw new Error("Lưu dữ liệu thất bại!");
        }
    } catch (error) {
        alert(`❌ ${error.message}`);
    }

    toggleSaveButton(false);
    let file_option1 = document.getElementById("image-upload");
    file_option1.value = "";
}


async function Delete() {
    if (confirm('Sau khi "XÓA" bài viết của bạn sẽ không thể khôi phục!')) {
        const response_put = await fetch(`${databaseUrl}/public_data/temps/${postId}.json?auth=${window.idToken}`, { method: 'DELETE' });

        if (response_put.ok) {
            await fetch(`${databaseUrl_post}/post_content/${postId}.json?auth=${window.idToken_1}`, { method: 'DELETE' });
            alert('✅ Xoá bài viết thành công');
            dash_addr_btn();
        } else {
            alert('❌ Bạn Không thể xóa bài viết này');
        }
    }
}


content.addEventListener('drop', (event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;

    if (files.length > 0) {
        const file = files[0];

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const imgTag = `
                <br>
                <div class="posts-img">
                    <img src="${e.target.result}" alt="" />
                </div>
                <br>`;
                insertAtCaret(content, imgTag);
                checkEditorContent();
            };

            reader.readAsDataURL(file);
        } else {
            alert('Please drop an image file!');
        }
    }
});

content.addEventListener('paste', (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const text = clipboardData.getData('text/plain');

    if (text) {
        event.preventDefault();
        insertAtCaret(content, text.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        checkEditorContent();
        return;
    }

    const items = clipboardData.items;
    let imageItem = null;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
            imageItem = items[i].getAsFile();
            break;
        }
    }

    if (imageItem) {
        event.preventDefault();
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgTag = `
            <br>
            <div class="posts-img">
                <img src="${e.target.result}" alt="" />
            </div>
            <br>`;
            insertAtCaret(content, imgTag);
            checkEditorContent();
        };
        reader.readAsDataURL(imageItem);
    }
});

function insertAtCaret(areaId, value) {
    const doc = areaId.ownerDocument || areaId.document;
    const win = doc.defaultView || doc.parentWindow;
    const sel = win.getSelection();
    const range = sel.getRangeAt(0);

    // Tạo một node text để chèn vào
    const el = document.createElement('div');
    el.innerHTML = value;
    const frag = document.createDocumentFragment();
    let node, lastNode;
    while (node = el.firstChild) {
        lastNode = frag.appendChild(node);
    }

    range.deleteContents();
    range.insertNode(frag);

    // Di chuyển con trỏ sau khi chèn
    if (lastNode) {
        range.setStartAfter(lastNode);
        range.setEndAfter(lastNode);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

async function push_to_news() {

    if (confirm('Bạn có chắc chắn muốn đăng bài viết này?')) {
        const response = await fetch(`${databaseUrl}/public_data/temps/${postId}.json`);
        const post = await response.json();

        let top = post.topic;

        const response_put = await fetch(`${databaseUrl}/public_data/news/${top}/${postId}.json?auth=${window.idToken}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });

        if (response_put.ok) {
            await fetch(`${databaseUrl}/public_data/temps/${postId}.json?auth=${window.idToken}`, { method: 'DELETE' });
            alert('✅ Đăng bài viết thành công');
            dash_addr_btn();
        } else {
            alert('❌ Bạn Không thể đăng bài viết này');
        }

    }
}

async function dash_addr_btn() {
    const postData = {
        dash_addr: 3,
    };

    await fetch(`${databaseUrl}/public_data/status_element.json?auth=${window.idToken}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });

    window.location.href = `index.html`;
}

function Return_admin() {
    window.location.href = "./";
}