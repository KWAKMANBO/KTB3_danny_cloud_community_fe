import {API, PAGE} from "./const/const.js";
import {requireAuth} from './common.js';

// 인증 체크
requireAuth();
const beforePasswordInput = document.querySelector("#before_password");
const passwordInput = document.querySelector("#password");
const passwordCheckInput = document.querySelector("#password-check");
const helperTexts = document.querySelectorAll(".helper-text");
const beforePasswordHelperText = helperTexts[0];
const passwordHelperText = helperTexts[1];
const passwordCheckHelperText = helperTexts[2];
const submitBtn = document.querySelector(".submit-btn");

// 비밀번호 정규식 (8-20자, 영문+숫자+특수문자 조합)
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

// 에러 메시지 표시
const showError = (input, helperText, message) => {
    input.classList.add('error');
    helperText.style.visibility = "visible";
    helperText.innerHTML = message;
};

// 에러 메시지 제거
const clearError = (input, helperText) => {
    input.classList.remove('error');
    helperText.style.visibility = "hidden";
    helperText.innerHTML = "";
};

// 현재 비밀번호 입력 시 에러 제거
beforePasswordInput.addEventListener('input', () => {
    clearError(beforePasswordInput, beforePasswordHelperText);
});

// 새 비밀번호 입력 시 에러 제거
passwordInput.addEventListener('input', () => {
    clearError(passwordInput, passwordHelperText);
});

// 비밀번호 확인 입력 시 에러 제거
passwordCheckInput.addEventListener('input', () => {
    clearError(passwordCheckInput, passwordCheckHelperText);
});

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const beforePassword = beforePasswordInput.value.trim();
    const password = passwordInput.value.trim();
    const passwordCheck = passwordCheckInput.value.trim();
    let hasError = false;

    // 현재 비밀번호 유효성 검사
    if (!beforePassword) {
        showError(beforePasswordInput, beforePasswordHelperText, "* 현재 비밀번호를 입력해주세요.");
        hasError = true;
    } else {
        clearError(beforePasswordInput, beforePasswordHelperText);
    }

    // 새 비밀번호 유효성 검사
    if (!password) {
        showError(passwordInput, passwordHelperText, "* 새 비밀번호를 입력해주세요.");
        hasError = true;
    } else if (!passwordRegex.test(password)) {
        showError(passwordInput, passwordHelperText, "* 8-20자의 영문, 숫자, 특수문자를 조합해주세요.");
        hasError = true;
    } else if (beforePassword === password) {
        showError(passwordInput, passwordHelperText, "* 현재 비밀번호와 동일한 비밀번호로는 변경이 불가능합니다.");
        hasError = true;
    } else {
        clearError(passwordInput, passwordHelperText);
    }

    // 비밀번호 확인 유효성 검사
    if (!passwordCheck) {
        showError(passwordCheckInput, passwordCheckHelperText, "* 비밀번호 확인을 입력해주세요.");
        hasError = true;
    } else if (password !== passwordCheck) {
        showError(passwordCheckInput, passwordCheckHelperText, "* 비밀번호가 일치하지 않습니다.");
        hasError = true;
    } else {
        clearError(passwordCheckInput, passwordCheckHelperText);
    }

    if (hasError) {
        return;
    }

    try {
        const data = {
            current_password: beforePassword,
            new_password: password
        };

        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(API.PASSWORD, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        });

        if (response.status === 401) {
            // Unauthorized - 현재 비밀번호 불일치
            showError(beforePasswordInput, beforePasswordHelperText, "* 현재 비밀번호가 일치하지 않습니다.");
            return;
        }

        if (response.status === 409) {
            // Conflict - 이전 비밀번호와 동일
            showError(passwordInput, passwordHelperText, "* 이전 비밀번호와 동일한 비밀번호로는 변경이 불가능합니다.");
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            // TODO alert 토스트 형식으로 변경하기
            alert("비밀번호가 변경되었습니다.");
            window.location.replace(PAGE.POST_LIST_PAGE);
        } else {
            showError(passwordInput, passwordHelperText, "* 비밀번호 변경에 실패했습니다.");
        }

    } catch (error) {
        console.error("비밀번호 변경 중 오류가 발생했습니다:", error);
        showError(passwordInput, passwordHelperText, "* 오류가 발생했습니다. 다시 시도해주세요.");
    }
})