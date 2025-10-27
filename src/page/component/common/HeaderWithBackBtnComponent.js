const header = document.querySelector('header');
header.innerHTML = `
    <button class="back-btn""><</button>
    <h1>아무 말 대잔치</h1>
`;

// < 뒤로가기 버튼을 계싼
function positionBackButton() {
    const h1 = header.querySelector('h1');
    const backBtn = header.querySelector('.back-btn');

    if (!h1 || !backBtn) return;


    const h1Rect = h1.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();

    // h1의 왼쪽 끝 위치를 계산
    const h1LeftPosition = h1Rect.left - headerRect.left;
    // 뒤로가기 버튼을 아무 말 대잔치 옆으로 계싼
    backBtn.style.left = `${h1LeftPosition - backBtn.offsetWidth - 5}px`;
}


positionBackButton();

// 화면 크기 변경 시 재계산
window.addEventListener('resize', positionBackButton);