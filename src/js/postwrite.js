import {post, get, putImage} from "./const/requestconst.js";
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

// 입력 시 에러 제거
titleInput.addEventListener('input', () => {
    showLength(titleInput.value, titleHelperText, TITLE_MAX);
    if (titleInput.value.trim()) {
        clearError(titleInput, titleHelperText);
    }
});

contentInput.addEventListener('input', () => {
    showLength(contentInput.value, contentHelperText, CONTENT_MAX);
    if (contentInput.value.trim()) {
        clearError(contentInput, contentHelperText);
    }
});

// 이미지 파일 선택 이벤트
imageInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
        alert('이미지는 최대 5개까지 업로드 가능합니다.');
        imageInput.value = '';
        return;
    }

    selectedFiles = files;
    updateFileInfo();
    showImagePreview();
});

// 파일 정보 업데이트
const updateFileInfo = () => {
    if (selectedFiles.length === 0) {
        fileInfo.textContent = '파일을 선택하지 않음.';
    } else {
        fileInfo.textContent = `${selectedFiles.length}개의 파일 선택됨`;
    }
};

// 이미지 미리보기 표시
const showImagePreview = () => {
    imagePreview.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="미리보기 ${index + 1}">
                <button type="button" class="remove-image-btn" data-index="${index}">×</button>
            `;
            imagePreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
};

// 이미지 제거 (이벤트 위임 사용)
imagePreview.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-image-btn')) {
        const index = parseInt(e.target.dataset.index);
        selectedFiles.splice(index, 1);

        // input 파일 목록 업데이트
        const dt = new DataTransfer();
        selectedFiles.forEach(file => dt.items.add(file));
        imageInput.files = dt.files;

        updateFileInfo();
        showImagePreview();
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

submitButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const title = titleInput.value;
    const content = contentInput.value;
    let hasError = false;

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

    if (hasError) {
        return;
    }

    try {
        // 버튼 비활성화 (중복 제출 방지)
        submitButton.disabled = true;
        submitButton.textContent = '작성 중...';

        // 이미지 업로드
        let imageKeys = [];
        if (selectedFiles.length > 0) {
            imageKeys = await uploadImages(selectedFiles);
        }

        // 게시글 생성
        const postData = {
            title: title,
            content: content,
            imageKeys: imageKeys
        };

        const result = await post(API.POST, postData);

        if (result) {
            window.location.replace(PAGE.POST_LIST_PAGE);
        } else {
            alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
            submitButton.disabled = false;
            submitButton.textContent = '완료';
        }
    } catch (error) {
        console.error('게시글 작성 중 오류 발생:', error);
        alert('게시글 작성 중 오류가 발생했습니다.');
        submitButton.disabled = false;
        submitButton.textContent = '완료';
    }
})