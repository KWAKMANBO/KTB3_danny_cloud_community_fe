import {get, patch, post} from "./const/RequestConst.js";
import {API, PAGE, TITLE_MAX, CONTENT_MAX} from "./const/const.js";
import {requireAuth} from './Common.js';

// 인증 체크
requireAuth();

const submitButton = document.querySelector(".submit-btn");
const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
const titleHelperText = document.querySelector("#title").nextElementSibling;
const contentHelperText = document.querySelector("#content").nextElementSibling;
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
        // TODO : alert 토스트 형식으로 변경하기
        alert("게시물을 찾을 수 없습니다.");
        window.location.href = PAGE.POST_LIST_PAGE;
        return;
    }

    const response = await get(`${API.POST}/${postId}`, {});

    if (response && response.data) {
        const {title, content} = response.data;
        originalTitle = title;
        titleInput.value = title;
        originalContent = content;
        contentInput.value = content;

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

    // TODO : 이미지 처리 로직 추가하기
    const postData = {
        title: title,
        content: content,
        images: []
    };

    try {
        const response = await patch(`${API.POST}/${postId}`, postData);

        if (response) {
            // TODO : alert 토스트 형식으로 변경하기
            alert('게시글이 수정되었습니다.');
            window.location.replace(`${PAGE.POST_DETAIL}/${postId}`);
        } else {
            // TODO : alert 토스트 형식으로 변경하기
            alert('게시글 수정에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('게시글 수정 중 오류 발생:', error);
        // TODO : alert 토스트 형식으로 변경하기
        alert('게시글 수정 중 오류가 발생했습니다.');
    }
});

// 페이지 로드 시 게시글 데이터 불러오기
window.addEventListener('load', async () => {
    await loadPostData();
});

window.addEventListener("popstate", () =>{
    window.location.replace(PAGE.POST_LIST_PAGE);
})