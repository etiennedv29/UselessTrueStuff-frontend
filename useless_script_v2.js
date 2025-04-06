document.addEventListener('DOMContentLoaded', () => {
    const burgerIcon = document.querySelector('.burger-icon');
    const burgerContent = document.querySelector('.burger-content');
    const popup = document.getElementById('popup');
    const submitStoryBtn = document.getElementById('submit-story-btn');
    const closeBtn = document.querySelector('.close-btn');
    const storyForm = document.getElementById('story-form');
    const searchBar = document.getElementById('search-bar');
    let storyIdCounter = 2; // Initialisé à 2 car il y a déjà 2 histoires

    burgerIcon.addEventListener('click', () => {
        burgerContent.style.display = burgerContent.style.display === 'block' ? 'none' : 'block';
    });

    if (submitStoryBtn) {
        submitStoryBtn.addEventListener('click', () => {
            popup.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }

    if (storyForm) {
        storyForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = document.getElementById('story-title').value;
            const content = document.getElementById('story-content').value;
            const category = document.getElementById('story-category').value;

            storyIdCounter += 1;

            const newStory = document.createElement('article');
            newStory.setAttribute('data-id', storyIdCounter);
            newStory.setAttribute('data-category', category);
            newStory.innerHTML = `
                <a href="story_template.html?id=${storyIdCounter}">
                    <h2>${title}</h2>
                </a>
                <p>${content}</p>
                <div class="voting">
                    <button class="vote-up">👍</button>
                    <span class="vote-count">0</span>
                    <button class="vote-down">👎</button>
                </div>
            `;

            document.getElementById('stories').appendChild(newStory);
            popup.style.display = 'none';
            storyForm.reset();

            // Log the new story to the database (backend implementation required)
            console.log('New story submitted:', { id: storyIdCounter, title, content, category });
        });
    }

    document.querySelectorAll('article').forEach(article => {
        const storyId = article.getAttribute('data-id');
        const voteUpButton = article.querySelector('.vote-up');
        const voteDownButton = article.querySelector('.vote-down');
        const voteCount = article.querySelector('.vote-count');
        const commentForm = article.querySelector('.comment-form');
        const commentList = article.querySelector('.comment-list');

        let votes = 0;

        voteUpButton.addEventListener('click', () => {
            votes += 1;
            voteCount.textContent = votes;
        });

        voteDownButton.addEventListener('click', () => {
            votes -= 1;
            voteCount.textContent = votes;
        });

        if (commentForm) {
            commentForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const commentText = commentForm.querySelector('textarea').value;
                if (commentText.trim() !== '') {
                    const commentElement = document.createElement('div');
                    commentElement.classList.add('comment');
                    commentElement.textContent = commentText;
                    commentList.appendChild(commentElement);
                    commentForm.querySelector('textarea').value = '';
                }
            });
        }
    });

    document.querySelectorAll('#categories li').forEach(categoryItem => {
        categoryItem.addEventListener('click', () => {
            const selectedCategory = categoryItem.getAttribute('data-category');
            document.querySelectorAll('article').forEach(article => {
                if (selectedCategory === 'all' || article.getAttribute('data-category') === selectedCategory) {
                    article.style.display = 'block';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    });

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        document.querySelectorAll('article').forEach(article => {
            const title = article.querySelector('h2').textContent.toLowerCase();
            if (title.includes(query)) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    });
});
