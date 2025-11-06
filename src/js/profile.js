import {get} from "./const/requestconst.js";
import {API, PAGE} from "./const/const.js";
import {requireAuth} from './common.js';

// 인증 체크
requireAuth();
let originalNickname;
window.addEventListener("load", async () => {
    try {
        const response = await get(API.USERS_ME);
        if (response) {
            console.log(response);
            const {email, nickname} = response.data;
            originalNickname = nickname;
            document.querySelector(".email-display").innerHTML = email;
            document.querySelector("#nickname").value = nickname;

        }
    } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
    }
})

const nicknameInput = document.querySelector("#nickname");
const helperText = document.querySelector(".helper-text");

// 닉네임 입력 시 helper text 숨기기
nicknameInput.addEventListener('input', () => {
    helperText.style.visibility = "hidden";
    helperText.innerHTML = "";
});

const submitBtn = document.querySelector(".submit-btn")
submitBtn.addEventListener('click', async (e) => {
    try {
        e.preventDefault();
        const currentNickname = nicknameInput.value;

        if (currentNickname === originalNickname) {
            helperText.style.visibility = "visible";
            helperText.innerHTML = "* 이전 닉네임과 동일한 닉네임으로는 변경이 불가능합니다.";
            return ;
        }

        const data = {
            nickname : currentNickname
        }

        // 직접 fetch를 사용하여 상태 코드 확인
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(API.NICKNAME, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(data)
        });

        if (response.status === 409) {
            // Conflict - 중복된 닉네임
            helperText.style.visibility = "visible";
            helperText.innerHTML = "* 사용중인 닉네임으로는 변경이 불가능합니다.";
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            // TODO alert 토스트 형식으로 변경하기
            alert("닉네임을 변경했습니다.")
            window.location.replace(PAGE.POST_LIST_PAGE);
        } else {
            helperText.style.visibility = "visible";
            helperText.innerHTML = "* 닉네임 변경에 실패했습니다.";
        }

    } catch (error) {
        console.error("닉네임 변경중 오류가 발생했습니다:", error);
        helperText.style.visibility = "visible";
        helperText.innerHTML = "* 오류가 발생했습니다. 다시 시도해주세요.";
    }

})

