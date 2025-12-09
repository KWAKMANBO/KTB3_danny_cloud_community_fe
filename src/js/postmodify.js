import {get, patch, post, putImage} from "./const/requestconst.js";
import {API, PAGE, TITLE_MAX, CONTENT_MAX} from "./const/const.js";
import {requireAuth} from './common.js';

// 인증 체크
requireAuth();

const submitButton = document.querySelector(".submit-btn");
const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
const titleHelperText = document.querySelector("#title").nextElementSibling;
const contentHelperText = document.querySelector("#content").nextElementSibling;
const imageInput = document.querySelector("#image");
const fileInfo = document.querySelector(".file-info");
const imagePreview = document.querySelector("#image-preview");

// 선택된 이미지 파일 목록
let selectedFiles = [];
// 기존 이미지 목록 (id와 url 포함)
let existingImages = [];
// 삭제할 이미지 ID 목록
let deletedImageIds = [];
let originalTitle;
let originalContent;
let hasSameTitleAndContent = false;

// URL에서 postId 가져오기
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('postId');

// 에러 상태 제거 함수
const clearError = (input, helperText) => {
    input.classList.remove('error');
    helperText.classList.remove('error');
};

// 에러 상태 표시 함수
const showError = (input, helperText, message) => {
    input.classList.add('error');
    helperText.classList.add('error');
    helperText.textContent = message;
};

const showLength = (inputValue, helperText, max) => {
    helperText.textContent = `${inputValue.length}/${max}`;
}

// 게시글 데이터 로드
const loadPostData = async () => {
    if (!postId) {
        alert("게시물을 찾을 수 없습니다.");
        window.location.href = PAGE.POST_LIST_PAGE;
        return;
    }

    const response = await get(`${API.POST}/${postId}`, {});

    if (response && response.data) {
        const {title, content, images, image_ids} = response.data;
        originalTitle = title;
        titleInput.value = title;
        originalContent = content;
        contentInput.value = content;

        // 기존 이미지 로드 (id와 url 함께 저장)
        if (images && images.length > 0) {
            // image_ids가 있으면 함께 저장, 없으면 인덱스를 id로 사용
            existingImages = images.map((url, index) => ({
                id: image_ids ? image_ids[index] : index,
                url: url
            }));
            showAllImages();
            updateFileInfo();
        }

        // 초기 글자수 표시
        showLength(titleInput.value, titleHelperText, TITLE_MAX);
        showLength(contentInput.value, contentHelperText, CONTENT_MAX);
    } else {
        alert('게시물을 찾을 수 없습니다.');
        window.location.href = PAGE.POST_LIST_PAGE;
    }
};

// 입력 시 에러 제거 및 글자수 표시
titleInput.addEventListener('input', () => {
    showLength(titleInput.value, titleHelperText, TITLE_MAX);
    if (titleInput.value.trim()) {
        clearError(titleInput, titleHelperText);
    }
    if (hasSameTitleAndContent) {
        clearError(contentInput, contentHelperText)
        showLength(contentInput.value, contentHelperText, CONTENT_MAX);
    }
});

contentInput.addEventListener('input', () => {
    showLength(contentInput.value, contentHelperText, CONTENT_MAX);
    if (contentInput.value.trim()) {
        clearError(contentInput, contentHelperText);
    }
    if (hasSameTitleAndContent) {
        clearError(titleInput, titleHelperText);
        showLength(titleInput.value, titleHelperText, TITLE_MAX);
    }
});

// 이미지 파일 선택 이벤트
imageInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    const currentImageCount = existingImages.length - deletedImageIds.length;
    const totalImages = currentImageCount + files.length;

    if (totalImages > 5) {
        alert('이미지는 최대 5개까지 업로드 가능합니다.');
        imageInput.value = '';
        return;
    }

    selectedFiles = files;
    updateFileInfo();
    showAllImages();
});

// 파일 정보 업데이트
const updateFileInfo = () => {
    const currentImageCount = existingImages.length - deletedImageIds.length;
    const totalCount = currentImageCount + selectedFiles.length;
    if (totalCount === 0) {
        fileInfo.textContent = '파일을 선택하지 않음.';
    } else {
        fileInfo.textContent = `${totalCount}개의 파일 선택됨`;
    }
};

// 모든 이미지 표시 (기존 + 새 이미지)
const showAllImages = () => {
    imagePreview.innerHTML = '';

    // 기존 이미지 표시 (삭제되지 않은 것만)
    existingImages.forEach((image, index) => {
        if (!deletedImageIds.includes(image.id)) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${image.url}" alt="기존 이미지 ${index + 1}">
                <button type="button" class="remove-image-btn" data-type="existing" data-index="${index}">×</button>
            `;
            imagePreview.appendChild(previewItem);
        }
    });

    // 새 이미지 표시
    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="새 이미지 ${index + 1}">
                <button type="button" class="remove-image-btn" data-type="new" data-index="${index}">×</button>
            `;
            imagePreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
};

// 이미지 제거 (이벤트 위임 사용)
imagePreview.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-image-btn')) {
        const type = e.target.dataset.type;
        const index = parseInt(e.target.dataset.index);

        if (type === 'existing') {
            // 기존 이미지를 삭제 목록에 추가
            const imageToDelete = existingImages[index];
            if (imageToDelete && !deletedImageIds.includes(imageToDelete.id)) {
                deletedImageIds.push(imageToDelete.id);
            }
        } else {
            // 새 이미지 제거
            selectedFiles.splice(index, 1);

            // input 파일 목록 업데이트
            const dt = new DataTransfer();
            selectedFiles.forEach(file => dt.items.add(file));
            imageInput.files = dt.files;
        }

        updateFileInfo();
        showAllImages();
    }
});

// 이미지 업로드 함수
const uploadImages = async (files) => {
    if (files.length === 0) {
        return [];
    }

    try {
        // 파일 확장자 추출 (첫 번째 파일 기준)
        const fileExtension = files[0].name.split('.').pop().toLowerCase();

        // Presigned URL 요청
        const response = await get(API.IMAGE_UPLOAD_URL, {
            count: files.length,
            imageType: 'POST',
            fileExtension: fileExtension
        });

        if (!response || !response.data) {
            throw new Error('Presigned URL 요청 실패');
        }

        const presignedData = response.data;
        const imageKeys = [];

        // 각 파일을 S3에 업로드
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const { presignedUrl, imageKey } = presignedData[i];

            const uploadResult = await putImage(presignedUrl, file, file.type);

            if (!uploadResult) {
                throw new Error(`이미지 업로드 실패: ${file.name}`);
            }

            imageKeys.push(imageKey);
        }

        return imageKeys;
    } catch (error) {
        console.error('이미지 업로드 중 오류:', error);
        throw error;
    }
};

// 수정 완료 버튼
submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    let hasError;
    const title = titleInput.value;
    const content = contentInput.value;

    // 유효성 검사
    if (!title.trim()) {
        showError(titleInput, titleHelperText, '* 제목을 입력해주세요.');
        hasError = true;
    } else {
        clearError(titleInput, titleHelperText);
    }

    if (!content.trim()) {
        showError(contentInput, contentHelperText, '* 내용을 입력해주세요.');
        hasError = true;
    } else {
        clearError(contentInput, contentHelperText);
    }

    const isSameTitle = originalTitle.trim() === title.trim();
    const isSameContent = originalContent.trim() === content.trim();
    if (isSameContent && isSameTitle) {
        showError(titleInput, titleHelperText, "제목을 수정해주세요.");
        showError(contentInput, contentHelperText, "내용을 수정해주세요.");
        hasSameTitleAndContent = true;
        hasError = true;
    }

    if (hasError) {
        return;
    }

    try {
        // 버튼 비활성화 (중복 제출 방지)
        submitButton.disabled = true;
        submitButton.textContent = '수정 중...';

        // 새 이미지 업로드
        let addImageKeys = [];
        if (selectedFiles.length > 0) {
            addImageKeys = await uploadImages(selectedFiles);
        }

        // 게시글 수정 데이터 구성
        const postData = {
            title: title,
            content: content
        };

        // 삭제할 이미지가 있으면 추가
        if (deletedImageIds.length > 0) {
            postData.delete_image_ids = deletedImageIds;
        }

        // 추가할 이미지가 있으면 추가
        if (addImageKeys.length > 0) {
            postData.add_image_keys = addImageKeys;
        }

        const response = await patch(`${API.POST}/${postId}`, postData);

        if (response) {
            alert('게시글이 수정되었습니다.');
            window.location.replace(`${PAGE.POST_DETAIL}/${postId}`);
        } else {
            alert('게시글 수정에 실패했습니다. 다시 시도해주세요.');
            submitButton.disabled = false;
            submitButton.textContent = '수정하기';
        }
    } catch (error) {
        console.error('게시글 수정 중 오류 발생:', error);
        alert('게시글 수정 중 오류가 발생했습니다.');
        submitButton.disabled = false;
        submitButton.textContent = '수정하기';
    }
});

// 페이지 로드 시 게시글 데이터 불러오기
window.addEventListener('load', async () => {
    await loadPostData();
});

window.addEventListener("popstate", () =>{
    window.location.replace(PAGE.POST_LIST_PAGE);
})