import {post} from './RequestConst.js';

const loginButton = document.querySelector('.login-btn');
loginButton.addEventListener('click', async () => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    console.log(email);
    console.log(password);
    await login(email, password);
});

const login = async (email, password) => {
    const result = await post("http://localhost:8080/auth/login", {
        email: email,
        password: password
    })


    if (result) {
        localStorage.setItem("accessToken", result.data.access_token);
        window.location.href = "http://localhost:3000/posts";
    } else {
        alert('로그인에 실패했습니다.');
    }
}

const signUpButton = document.querySelector('.signup-btn');

signUpButton.addEventListener('click', async () =>{
    window.location.href = "http://localhost:3000/signup";
})