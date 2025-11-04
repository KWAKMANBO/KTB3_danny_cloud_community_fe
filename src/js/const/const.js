export const API = {
    LOGIN: "http://localhost:8080/auth/login",
    LOGOUT: "http://localhost:8080/auth/logout",
    SIGNUP: "http://localhost:8080/auth",
    TERM: "http://localhost:8080/auth/consent",
    POST: "http://localhost:8080/posts",
    USERS_ME: "http://localhost:8080/users/me",
    NICKNAME: "http://localhost:8080/users/nickname",
    PASSWORD: "http://localhost:8080/users/password"
}

export const PAGE = {
    LOGIN_PAGE: "http://localhost:3000/",
    SIGNUP_PAGE: "http://localhost:3000/signup",
    POST_LIST_PAGE: "http://localhost:3000/posts",
    POST_DETAIL: "http://localhost:3000/post",
    POST_WRITE_PAGE: "http://localhost:3000/post",
    POST_MODIFY_PAGE: "http://localhost:3000/post/correction",
    PROFILE_MODIFY_PAGE: "http://localhost:3000/profile",
    PROFILE_MODIFY_PASSWORD_PAGE: "http://localhost:3000/profile/password"
}

export const TITLE_MAX = 30;
export const CONTENT_MAX = 2000;