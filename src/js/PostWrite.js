import {post} from "./const/RequestConst.js";
import {API, PAGE, TITLE_MAX, CONTENT_MAX} from "./const/const.js";

const submitButton = document.querySelector(".submit-btn");
const titleInput = document.querySelector("#title");
const contentInput = document.querySelector("#content");
const titleHelperText = document.querySelector("#title").nextElementSibling;
const contentHelperText = document.querySelector("#content").nextElementSibling;



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

    // TODO : 이미지 처리 로직 추가하기
    const postData = {
        title: title,
        content: content,
        images: []
    };

    try {
        const result = await post(API.POST, postData);

        if (result) {
            window.location.replace(PAGE.POST_LIST_PAGE);
        } else {
            alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('게시글 작성 중 오류 발생:', error);
        alert('게시글 작성 중 오류가 발생했습니다.');
    }
})