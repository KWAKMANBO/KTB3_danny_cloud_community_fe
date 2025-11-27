// 이메일 유효성 검사
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 비밀번호 유효성 검사 (최소 8자, 영문, 숫자, 특수문자 포함)
export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
}

// 닉네임 유효성 검사 (최소 2자 이상)
export const validateNickname = (nickname) => {
    return nickname.trim().length >= 2;
}