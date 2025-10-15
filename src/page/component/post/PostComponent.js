const postComponent = '<article class="post-card">\n' +
    '            <div class="post-card-header">\n' +
    '                <h3 class="post-title">제목 1</h3>\n' +
    '                <div class="post-info">\n' +
    '                    <span class="info-item">좋아요 0</span>\n' +
    '                    <span class="info-item">댓글 0</span>\n' +
    '                    <span class="info-item">조회수 0</span>\n' +
    '                    <span class="post-date">2021-01-01 00:00:00</span>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="post-card-footer">\n' +
    '                <div class="author-profile"></div>\n' +
    '                <span class="author-name">더미 닉네임 1</span>\n' +
    '            </div>\n' +
    '        </article>';

const p = document.querySelector('.post-list')
p.innerHTML = postComponent;