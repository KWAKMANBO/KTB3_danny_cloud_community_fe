import {API, PAGE} from "../../../js/const/const.js";
import {post} from "../../../js/const/requestconst.js";

const header = document.querySelector('header');

// accessToken 확인
const accessToken = localStorage.getItem('accessToken');
const profileHTML = accessToken ? `
    <div class="profile-container">
        <div class="profile-thumbnail"></div>
        <div class="profile-dropdown">
            <div class="dropdown-item" data-action="edit-profile">회원 정보수정</div>
            <div class="dropdown-item" data-action="change-password">비밀번호수정</div>
            <div class="dropdown-item" data-action="logout">로그아웃</div>
        </div>
    </div>
` : '';

header.innerHTML = `
    <button class="back-btn""><</button>
    <h1>아무 말 대잔치</h1>
    ${profileHTML}
`;

// < 뒤로가기 버튼을 계산
function positionBackButton() {
    const h1 = header.querySelector('h1');
    const backBtn = header.querySelector('.back-btn');

    if (!h1 || !backBtn) return;


    const h1Rect = h1.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();

    // h1의 왼쪽 끝 위치를 계산
    const h1LeftPosition = h1Rect.left - headerRect.left;
    // 뒤로가기 버튼을 아무 말 대잔치 옆으로 계산
    backBtn.style.left = `${h1LeftPosition - backBtn.offsetWidth - 5}px`;
}


positionBackButton();

// 화면 크기 변경 시 재계산
window.addEventListener('resize', positionBackButton);


// accessToken이 있을 때만 이벤트 리스너 추가
if (accessToken) {
    // 프로필 썸네일 클릭 이벤트
    const profileThumbnail = header.querySelector('.profile-thumbnail');
    const profileDropdown = header.querySelector('.profile-dropdown');

    profileThumbnail.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
    });

    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', () => {
        profileDropdown.classList.remove('show');
    });

    // 드롭다운 아이템 클릭 이벤트
    header.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            const action = e.target.dataset.action;

            switch (action) {
                case 'edit-profile':
                    window.location.href = PAGE.PROFILE_MODIFY_PAGE;
                    break;
                case 'change-password':
                    window.location.href = PAGE.PROFILE_MODIFY_PASSWORD_PAGE;
                    break;
                case 'logout':
                    console.log('로그아웃');
                    try {
                        alert("로그아웃 되었습니다.")
                        localStorage.removeItem("accessToken");
                        await post(API.LOGOUT, {});
                        window.location.replace(PAGE.LOGIN_PAGE)
                    } catch (error) {
                        console.error("로그아웃중 문제가 발생했습니다.")
                    }

                    break;
            }
        });
    });
}

