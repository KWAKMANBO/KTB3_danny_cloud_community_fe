import {get, putImage, patch} from "./const/requestconst.js";
import {API, PAGE} from "./const/const.js";
import {requireAuth} from './common.js';

// 인증 체크
requireAuth();
let originalNickname;
let selectedProfileImage = null;
let currentProfileImageUrl = null;
window.addEventListener("load", async () => {
    try {
        const response = await get(API.USERS_ME);
        if (response) {
            console.log(response);
            const {email, nickname, profileImageUrl} = response.data;
            originalNickname = nickname;
            currentProfileImageUrl = profileImageUrl;

            document.querySelector(".email-display").innerHTML = email;
            document.querySelector("#nickname").value = nickname;

            // 프로필 이미지 표시
            if (profileImageUrl) {
                displayProfileImage(profileImageUrl);
            }
        }
    } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
    }
})

// 프로필 이미지 표시 함수
const displayProfileImage = (imageUrl) => {
    const profileImageElement = document.querySelector(".profile-image");
    profileImageElement.innerHTML = `<img src="${imageUrl}" alt="프로필 이미지" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
}

// 프로필 이미지 파일 선택 이벤트
const profileImageInput = document.querySelector("#profile-image");
profileImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 이미지 파일 유효성 검사
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        profileImageInput.value = '';
        return;
    }

    // 파일 크기 체크 (예: 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('이미지 크기는 5MB 이하여야 합니다.');
        profileImageInput.value = '';
        return;
    }

    selectedProfileImage = file;

    // 미리보기 표시
    const reader = new FileReader();
    reader.onload = (e) => {
        displayProfileImage(e.target.result);
    };
    reader.readAsDataURL(file);
});

// 프로필 이미지 업로드 함수
const uploadProfileImage = async (file) => {
    try {
        const fileExtension = file.name.split('.').pop().toLowerCase();

        // Presigned URL 요청
        const response = await get(API.IMAGE_UPLOAD_URL, {
            count: 1,
            imageType: 'PROFILE',
            fileExtension: fileExtension
        });

        if (!response || !response.data) {
            throw new Error('Presigned URL 요청 실패');
        }

        const { presignedUrl, imageKey } = response.data[0];

        // S3에 이미지 업로드
        const uploadResult = await putImage(presignedUrl, file, file.type);
        if (!uploadResult) {
            throw new Error('이미지 업로드 실패');
        }

        // 프로필 이미지 저장 API 호출
        const saveResult = await patch(API.PROFILE_IMAGE, { imageKey });
        if (!saveResult) {
            throw new Error('프로필 이미지 저장 실패');
        }

        return true;
    } catch (error) {
        console.error('프로필 이미지 업로드 중 오류:', error);
        throw error;
    }
};

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

        // 버튼 비활성화 (중복 제출 방지)
        submitBtn.disabled = true;
        submitBtn.textContent = '수정 중...';

        const currentNickname = nicknameInput.value;
        let hasChanges = false;

        // 프로필 이미지 업로드 (선택된 경우)
        if (selectedProfileImage) {
            try {
                await uploadProfileImage(selectedProfileImage);
                hasChanges = true;
            } catch (error) {
                alert('프로필 이미지 업로드에 실패했습니다.');
                submitBtn.disabled = false;
                submitBtn.textContent = '수정하기';
                return;
            }
        }

        // 닉네임 변경 (변경된 경우)
        if (currentNickname !== originalNickname) {
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
                submitBtn.disabled = false;
                submitBtn.textContent = '수정하기';
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                hasChanges = true;
            } else {
                helperText.style.visibility = "visible";
                helperText.innerHTML = "* 닉네임 변경에 실패했습니다.";
                submitBtn.disabled = false;
                submitBtn.textContent = '수정하기';
                return;
            }
        }

        // 변경 사항이 없는 경우
        if (!hasChanges) {
            helperText.style.visibility = "visible";
            helperText.innerHTML = "* 변경된 내용이 없습니다.";
            submitBtn.disabled = false;
            submitBtn.textContent = '수정하기';
            return;
        }

        // 성공
        alert("회원정보를 수정했습니다.");
        window.location.replace(PAGE.POST_LIST_PAGE);

    } catch (error) {
        console.error("회원정보 수정 중 오류가 발생했습니다:", error);
        helperText.style.visibility = "visible";
        helperText.innerHTML = "* 오류가 발생했습니다. 다시 시도해주세요.";
        submitBtn.disabled = false;
        submitBtn.textContent = '수정하기';
    }

})

