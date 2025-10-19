import { post } from './RequestConst.js';
const email = document.querySelector('#email');
email.value = "test5@example.com";
const password = document.querySelector('#password');
password.value = "test1234!";

const loginButton = document.querySelector('.login-btn');
loginButton.addEventListener('click', async () => {
     // const email = document.querySelector('#email');
     // const password = document.querySelector('#password');

    // login 함수 호출
    await login(email, password);
});

const login = async (email, password) => {
    const result = await post("http://localhost:8080/auth/login", {
        email: email.value,
        password: password.value
    })


    if (result) {
        localStorage.setItem("accessToken" , result.data.access_token);
        window.location.href = "http://localhost:3000/posts";
    } else {
        alert('로그인에 실패했습니다.');
    }
}