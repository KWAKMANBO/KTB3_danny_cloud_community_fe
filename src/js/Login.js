import {post} from './RequestConst.js';
import {API, PAGE} from './const/ConstUrl.js';

const loginButton = document.querySelector('.login-btn');
loginButton.addEventListener('click', async () => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    await login(email, password);
});

const login = async (email, password) => {
    const response = await post(API.LOGIN, {
        email: email,
        password: password
    })


    if (response) {
        localStorage.setItem("accessToken", response.data.access_token);
        window.location.replace(PAGE.POST_LIST_PAGE);

    } else {
        alert('로그인에 실패했습니다.');
    }
}

const signUpButton = document.querySelector('.signup-btn');

signUpButton.addEventListener('click', async () => {
    window.location.href = PAGE.SIGNUP_PAGE;
})