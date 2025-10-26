import {getDate} from "../../../js/Common.js";

export const postComponent = (data) => {
    return `<article class="post-card" data-post-id="${data.id}">
            <div class="post-card-header">
                <h3 class="post-title">${data.title}</h3>
                <div class="post-info">
                    <span class="info-item">좋아요 ${data.likes}</span>
                    <span class="info-item">댓글 ${data.comments}</span>
                    <span class="info-item">조회수 ${data.views}</span>
                    <span class="post-date">${getDate(data.created_at)}</span>
                </div>
            </div>
            <div class="post-card-footer">
                <div class="author-profile"></div>
                <span class="author-name">${data.author}</span>
            </div>
        </article>`;
};



