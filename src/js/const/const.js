const serverUrl =  "https://kwakmanbo.store";


export const API = {
    LOGIN: `${serverUrl}/api/auth/login`,
    LOGOUT: `${serverUrl}/api/auth/logout`,
    SIGNUP: `${serverUrl}/api/auth`,
    TERM: `${serverUrl}/api/auth/consent`,
    POST: `${serverUrl}/api/posts`,
    USERS_ME: `${serverUrl}/api/users/me`,
    NICKNAME: `${serverUrl}/api/users/nickname`,
    PASSWORD: `${serverUrl}/api/users/password`
}

export const PAGE = {
    LOGIN_PAGE: `${serverUrl}/`,
    SIGNUP_PAGE: `${serverUrl}/signup`,
    POST_LIST_PAGE: `${serverUrl}/posts`,
    POST_DETAIL: `${serverUrl}/post`,
    POST_WRITE_PAGE: `${serverUrl}/post`,
    POST_MODIFY_PAGE: `${serverUrl}/post/correction`,
    PROFILE_MODIFY_PAGE: `${serverUrl}/profile`,
    PROFILE_MODIFY_PASSWORD_PAGE: `${serverUrl}/profile/password`
}

export const TITLE_MAX = 30;
export const CONTENT_MAX = 2000;