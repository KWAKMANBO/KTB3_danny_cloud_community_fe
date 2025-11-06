export const commentComponent = (comment) => {
    return `<div class="comment-item" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="author-profile small"></div>
                        <span class="author-name">${comment.author}</span>
                        <span class="comment-date">${comment.createAt}</span>
                    </div>
                    <div class="comment-actions">
                        <button class="action-btn">수정</button>
                        <button class="action-btn">삭제</button>
                    </div>
                </div>
                <div class="comment-content">${comment.content}</div>
            </div>`;
};