import {PAGE} from "./const/const.js";

export const getDate = (date) => {
    const createdAt = new Date(date);
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const day = String(createdAt.getDate()).padStart(2, '0');
    const hours = String(createdAt.getHours()).padStart(2, '0');
    const minutes = String(createdAt.getMinutes()).padStart(2, '0');
    return `${createdAt.getFullYear()}.${month}.${day} ${hours}:${minutes}`;
}

// 인증 체크 함수
export const requireAuth = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        window.location.replace(PAGE.LOGIN_PAGE);
        return false;
    }
    return true;
}