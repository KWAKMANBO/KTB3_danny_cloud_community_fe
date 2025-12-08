export const commentComponent = (comment) => {
     // 댓글 작성자 프로필 이미지 처리
    const authorProfileStyle = comment.authorProfileImageUrl
        ? `style="background-image: url(${comment.authorProfileImageUrl}); background-size: cover; background-position: center;"`
        : '';

    // 본인 댓글인 경우만 수정/삭제 버튼 표시
    const actionButtons = comment.is_mine ? `
        <div class="comment-actions">
            <button class="action-btn comment-edit-btn">수정</button>
            <button class="action-btn comment-delete-btn">삭제</button>
        </div>
    ` : '';

    return `<div class="comment-item" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="author-profile small" ${authorProfileStyle}></div>
                        <span class="author-name">${comment.author}</span>
                        <span class="comment-date">${comment.createAt}</span>
                    </div>
                    ${actionButtons}
                </div>
                <div class="comment-content">${comment.content}</div>
            </div>`;
};