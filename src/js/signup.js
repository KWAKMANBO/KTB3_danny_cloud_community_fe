import {post} from './const/requestconst.js';
import {API, PAGE} from './const/const.js';

const backButton = document.querySelector(".back-btn");

// 뒤로가기 버튼을 누르면 로그인 페이지로 이동 하도록 이벤트 등록
backButton.addEventListener('click', () => {
    window.location.href = PAGE.LOGIN_PAGE;
})


// 로그인하러 가기 버튼 누르면 로그인 페이지로 이동
const loginLinkButton = document.querySelector('.login-link-btn');
loginLinkButton.addEventListener('click', () => {
    window.location.href = PAGE.LOGIN_PAGE;
})

const termButton = document.querySelector(".term-btn");
termButton.addEventListener('click', () => {
    window.location.href = API.TERM;
})

// 유효성 검사 함수들
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const validatePassword = (password) => {
    // 최소 8자, 영문, 숫자, 특수문자 포함
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
}

const validateNickname = (nickname) => {
    // 최소 2자 이상
    return nickname.trim().length >= 2;
}

// helper text 표시 함수
const showHelperText = (inputId, message, isError = true) => {
    const inputGroup = document.querySelector(`#${inputId}`).closest('.input-group');
    const helperText = inputGroup.querySelector('.helper-text');
    helperText.textContent = message;
    helperText.style.display = 'block';
    helperText.style.visibility = 'visible';
    helperText.style.color = isError ? 'red' : 'green';
}

// helper text 숨기기 함수
const hideHelperText = (inputId) => {
    const inputGroup = document.querySelector(`#${inputId}`).closest('.input-group');
    const helperText = inputGroup.querySelector('.helper-text');
    helperText.style.display = 'none';
    helperText.style.visibility = 'hidden';
}

// 회원가입 버튼 클릭
const signUpSubmitButton = document.querySelector('.signup-submit-btn');
signUpSubmitButton.addEventListener('click', async () => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;
    const nickname = document.querySelector('#nickname').value;

    let isValid = true;

    // 이메일 검사
    if (!email) {
        showHelperText('email', '이메일을 입력해주세요.');
        isValid = false;
    } else if (!validateEmail(email)) {
        showHelperText('email', '올바른 이메일 형식을 입력해주세요.');
        isValid = false;
    } else {
        hideHelperText('email');
    }

    // 비밀번호 검사
    if (!password) {
        showHelperText('password', '비밀번호를 입력해주세요.');
        isValid = false;
    } else if (!validatePassword(password)) {
        showHelperText('password', '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.');
        isValid = false;
    } else {
        hideHelperText('password');
    }

    // 비밀번호 확인 검사
    if (!passwordConfirm) {
        showHelperText('password-confirm', '비밀번호 확인을 입력해주세요.');
        isValid = false;
    } else if (password !== passwordConfirm) {
        showHelperText('password-confirm', '비밀번호가 일치하지 않습니다.');
        isValid = false;
    } else {
        showHelperText('password-confirm', '비밀번호가 일치합니다.', false);
    }

    // 닉네임 검사
    if (!nickname) {
        showHelperText('nickname', '닉네임을 입력해주세요.');
        isValid = false;
    } else if (!validateNickname(nickname)) {
        showHelperText('nickname', '닉네임은 2자 이상이어야 합니다.');
        isValid = false;
    } else {
        hideHelperText('nickname');
    }

    const data = {
        "email": email,
        "password": password,
        "passwordConfirm": passwordConfirm,
        "nickname": nickname,
        // "profileImage": "https://example.com/profile.jpg"
    }

    // 모든 검사 통과 시 회원가입 처리
    if (isValid) {
        const result = await post(API.SIGNUP, data);

        if (result) {
            // 회원가입 성공
            console.log('회원가입 성공:', result);
            alert('회원가입이 완료되었습니다!');
            // 로그인 페이지로 이동\
            window.location.replace(PAGE.LOGIN_PAGE);
        } else {
            // 회원가입 실패
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    }
});


