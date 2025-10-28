export const showDialog = (message, onConfirm) => {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';

    overlay.innerHTML = `
        <div class="dialog-container">
            <div class="dialog-content">${message}</div>
            <div class="dialog-buttons">
                <button class="dialog-btn dialog-btn-cancel">취소</button>
                <button class="dialog-btn dialog-btn-confirm">확인</button>
            </div>
        </div>
    `;

    // 이벤트 리스너 추가
    overlay.querySelector('.dialog-btn-cancel').onclick = () => {
        document.body.removeChild(overlay);
    };

    overlay.querySelector('.dialog-btn-confirm').onclick = () => {
        document.body.removeChild(overlay);
        if (onConfirm) onConfirm();
    };

    document.body.appendChild(overlay);
};