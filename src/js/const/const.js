const serverUrl =  "https://kwakmanbo.store";

export const API = {
    LOGIN: `${serverUrl}/api/auth/login`,
    LOGOUT: `${serverUrl}/api/auth/logout`,
    SIGNUP: `${serverUrl}/api/auth`,
    TERM: `${serverUrl}/api/auth/consent`,
    POST: `${serverUrl}/api/posts`,
    USERS_ME: `${serverUrl}/api/users/me`,
    NICKNAME: `${serverUrl}/api/users/nickname`,
    PASSWORD: `${serverUrl}/api/users/password`,
    IMAGE_UPLOAD_URL: `${serverUrl}/api/images/upload-url`,
    PROFILE_IMAGE: `${serverUrl}/api/users/profile-image`,
    // 좋아요 API - 동적 URL은 `${API.POST}/${postId}/likes` 형태로 사용
    POST_LIKE: (postId) => `${serverUrl}/api/posts/${postId}/likes`
}
const wsUrl = "http://localhost:3000"

export const PAGE = {
    LOGIN_PAGE: `${wsUrl}/`,
    SIGNUP_PAGE: `${wsUrl}/signup`,
    POST_LIST_PAGE: `${wsUrl}/posts`,
    POST_DETAIL: `${wsUrl}/post`,
    POST_WRITE_PAGE: `${wsUrl}/post`,
    POST_MODIFY_PAGE: `${wsUrl}/post/correction`,
    PROFILE_MODIFY_PAGE: `${wsUrl}/profile`,
    PROFILE_MODIFY_PASSWORD_PAGE: `${wsUrl}/profile/password`
}

export const TITLE_MAX = 30;
export const CONTENT_MAX = 2000;