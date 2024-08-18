let socket;
let intervalId;
let shouldLoadMoreMessages = true;

fetchInitialData()

const list = document.querySelectorAll(".user-list");
list.forEach((userList) => {
    let isDown = false;
    let StartX, scrollLeft;

    userList.addEventListener("mousedown", (e) => {
        isDown = true;
        StartX = e.pageX - userList.offsetLeft;
        scrollLeft = userList.scrollLeft;
    });

    userList.addEventListener("mouseleave", () => {
        isDown = false;
    });

    userList.addEventListener("mouseup", () => {
        isDown = false;
    });

    userList.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - userList.offsetLeft;
        const walk = x - StartX;
        userList.scrollLeft = scrollLeft - walk;
    });

    userList.addEventListener("touchstart", (e) => {
        isDown = true;
        StartX = e.touches[0].pageX - userList.offsetLeft;
        scrollLeft = userList.scrollLeft;
    });

    userList.addEventListener("touchend", () => {
        isDown = false;
    });

    userList.addEventListener("touchmove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - userList.offsetLeft;
        const walk = x - StartX;
        userList.scrollLeft = scrollLeft - walk;
    });
});

async function updatesection2width() {
    section2.style.width = `${window.innerWidth - 350}px`;
}

window.addEventListener("resize", updatesection2width);

function checkAndUpdateSection() {
    const sectionm2 = document.querySelector("#sectionm2");

    if (sectionm2.classList.contains("active")) {
        updatesection2width();
    }
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            checkAndUpdateSection();
        }
    });
});

const section2 = document.getElementById("section2");
observer.observe(section2, { attributes: true });

checkAndUpdateSection();

document.getElementById('swiper-wrapper1').addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('dislike-icon')) {
        handleIconClick(event, 'nope');
    } else if (target.classList.contains('like-icon')) {
        handleIconClick(event, 'love');
    }
});


document.getElementById('swiper-wrapper1').addEventListener('mouseover', (event) => {
    const target = event.target;

    if (target.classList.contains('dislike-icon')) {
        target.src = "media/dislikeh.png";
    } else if (target.classList.contains('like-icon')) {
        target.src = "media/likeh.png";
    }
});

document.getElementById('swiper-wrapper1').addEventListener('mouseout', (event) => {
    const target = event.target;

    if (target.classList.contains('dislike-icon')) {
        target.src = "media/dislike.png";
    } else if (target.classList.contains('like-icon')) {
        target.src = "media/like.png";
    }
});

document.getElementById('user-list1').addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('dislike-icon')) {
        handleIconClick(event, 'nope');
    } else if (target.classList.contains('like-icon')) {
        handleIconClick(event, 'love');
    }
});


document.getElementById('user-list1').addEventListener('mouseover', (event) => {
    const target = event.target;

    if (target.classList.contains('dislike-icon')) {
        target.src = "media/dislikeh.png";
    } else if (target.classList.contains('like-icon')) {
        target.src = "media/likeh.png";
    }
});

document.getElementById('user-list1').addEventListener('mouseout', (event) => {
    const target = event.target;

    if (target.classList.contains('dislike-icon')) {
        target.src = "media/dislike.png";
    } else if (target.classList.contains('like-icon')) {
        target.src = "media/like.png";
    }
});

async function handleIconClick(event, action) {
    const userCard = event.target.closest('.usercard');
    const userId = userCard.getAttribute('data-userid');
    await connectionaction(userId, action);

    if (userCard) {
        removeUserCard(userId);
    }

    const swiperwrapper1 = document.getElementById('swiper-wrapper1')
    const userList1 = document.getElementById('user-list1')

    const remainingCardsins = swiperwrapper1.querySelectorAll('.usercard')
    const remainingCardsinu = userList1.querySelectorAll('.usercard');

    if (remainingCardsins.length === 0) {
        const nodatatext = document.createElement('div');
        nodatatext.classList.add('nodatatext');
        const noDataParagraph = document.createElement('p');
        noDataParagraph.textContent = 'No matches yet. Keep swiping to find your match!';
        nodatatext.appendChild(noDataParagraph);
        remainingCardsins.appendChild(nodatatext);
    }

    if (remainingCardsinu.length === 0) {
        const nodatatext = document.createElement('div');
        nodatatext.classList.add('nodatatext');
        const noDataParagraph = document.createElement('p');
        noDataParagraph.textContent = 'No matches yet. Keep swiping to find your match!';
        nodatatext.appendChild(noDataParagraph);
        remainingCardsinu.appendChild(nodatatext);
    }
}

const scrollLeftBtn = document.querySelector(".scroll-left");
const scrollRightBtn = document.querySelector(".scroll-right");
const scrollLeftmatches = document.querySelector(".scroll-left-matches");
const scrollRightmatches = document.querySelector(".scroll-right-matches");

const userList1 = document.getElementById("user-list1");
const userList2 = document.getElementById("user-list2");

scrollLeftBtn.addEventListener("click", function () {
    userList1.scrollBy({
        left: -300,
        behavior: "smooth",
    });
});

scrollRightBtn.addEventListener("click", function () {
    userList1.scrollBy({
        left: 300,
        behavior: "smooth",
    });
});

scrollLeftmatches.addEventListener("click", function () {
    userList2.scrollBy({
        left: -300,
        behavior: "smooth",
    });
});

scrollRightmatches.addEventListener("click", function () {
    userList2.scrollBy({
        left: 300,
        behavior: "smooth",
    });
});

function checkAndUpdateWidth() {
    const sectionm2 = document.getElementById("sectionm2");

    if (sectionm2.classList.contains("active")) {
        updatewidthofcontainers();
    }
}

const observer2 = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            checkAndUpdateWidth();
        }
    });
});

const sectionm2 = document.getElementById("sectionm2");
observer2.observe(sectionm2, { attributes: true });

checkAndUpdateWidth();

function updatewidthofcontainers() {
    const mainlikedislikecontainer = document.getElementById(
        "main-likedislike-container"
    );
    const mainmatchescontainer = document.getElementById(
        "main-matches-container"
    );

    mainlikedislikecontainer.width = sectionm2.offsetWidth;
    mainmatchescontainer.width = sectionm2.offsetWidth;
}

updatewidthofcontainers();
window.addEventListener("resize", updatewidthofcontainers);

function updateSwiperContainerWidth() {
    const swiperContainer1 = document.querySelector(".swiper-container1");
    const swiperContainer2 = document.querySelector(".swiper-container2");

    const section2mainHeight = document.querySelector('.section2-main-container')?.offsetHeight / 2;

    const mainlikedislike = document.querySelector('.main-likedislike-container');
    const mainmatches = document.querySelector('.main-matches-container');

    if (mainlikedislike) {
        mainlikedislike.style.height = `${section2mainHeight}px`;
    }

    if (mainmatches) {
        mainmatches.style.height = `${section2mainHeight}px`;
    }

    if (swiperContainer1) {
        swiperContainer1.style.width = `${document.querySelector(".top-container").offsetWidth - 30}px`;
        swiperContainer1.style.height = `${document.querySelector(".main-likedislike-container").offsetHeight - document.querySelector(".main-header-container").offsetHeight - 30}px`;
    }

    if (swiperContainer2) {
        swiperContainer2.style.width = `${document.querySelector(".top-container").offsetWidth - 30}px`;
        swiperContainer2.style.height = `${document.querySelector(".main-likedislike-container").offsetHeight - document.querySelector(".main-header-container").offsetHeight - 30}px`;
    }
}

updateSwiperContainerWidth();

window.addEventListener("resize", updateSwiperContainerWidth);

function checkAndUpdateSwiper() {
    const sectionm2 = document.querySelector("#sectionm2");

    if (sectionm2.classList.contains("active")) {
        updateSwiperContainerWidth();
    }
}

const observer3 = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            checkAndUpdateSwiper();
        }
    });
});

observer3.observe(sectionm2, { attributes: true });

checkAndUpdateSwiper();

const swiper1 = new Swiper(".swiper-container1", {
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".scroll-right-likedislike-mobile",
        prevEl: ".scroll-left-likedislike-mobile",
    },
    loop: false,

});

const swiper2 = new Swiper(".swiper-container2", {
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".scroll-right-matches-mobile",
        prevEl: ".scroll-left-matches-mobile",
    },
    loop: false,
});

document
    .querySelectorAll(
        ".scroll-left, .scroll-left-matches, .scroll-right, .scroll-right-matches, .scroll-left-likedislike-mobile, .scroll-right-likedislike-mobile, .scroll-left-matches-mobile, .scroll-right-matches-mobile"
    )
    .forEach((button) => {
        button.addEventListener("mousedown", (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    });

var tinderContainerA = document.querySelector('.swipe-imagecontainer');
var tinderContainerM = document.querySelector('.swipe-imagecontainerm');
var nope = document.querySelector('.reject-btn');
var love = document.querySelector('.heart-btn');

var swipedCardsState = {};

function detachEventListeners(card) {
    if (card.hammertime) {
        card.hammertime.off('pan');
        card.hammertime.off('panend');
    }
}

function initCard(card, className, container) {
    card.style.zIndex = container.querySelectorAll(className).length - Array.from(container.querySelectorAll(className)).indexOf(card);
    card.style.opacity = (10 - Array.from(container.querySelectorAll(className)).indexOf(card)) / 10;

    var hammertime = new Hammer(card, {
        inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchMouseInput
    });
    card.hammertime = hammertime;

    hammertime.on('pan', function (event) {
        card.classList.add('moving');

        if (event.deltaX === 0) return;

        container.classList.toggle('tinder_love', event.deltaX > 0);
        container.classList.toggle('tinder_nope', event.deltaX < 0);

        var xMulti = event.deltaX * 0.03;
        var yMulti = event.deltaY / 80;
        var rotate = xMulti * yMulti;

        card.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
    });

    hammertime.on('panend', function (event) {
        card.classList.remove('moving');
        container.classList.remove('tinder_love');
        container.classList.remove('tinder_nope');

        var moveOutWidth = document.body.clientWidth;
        var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

        card.classList.toggle('removed', !keep);

        if (keep) {
            card.style.transform = '';
        } else {
            var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
            var toX = event.deltaX > 0 ? endX : -endX;
            var endY = Math.abs(event.velocityY) * moveOutWidth;
            var toY = event.deltaY > 0 ? endY : -endY;
            var xMulti = event.deltaX * 0.03;
            var yMulti = event.deltaY / 80;
            var rotate = xMulti * yMulti;

            card.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
            sendSwipeAction(card.dataset.id, event.deltaX > 0 ? 'love' : 'nope');
            swipedCardsState[card.dataset.id] = true;
            synchronizeCards();
            initCardsA()
            initCardsM()
        }
    });
}

function initCards(container, className) {
    container.querySelectorAll(className).forEach(card => {
        detachEventListeners(card);
        card.style.transform = '';
        card.classList.remove('moving', 'removed');
    });

    swipedCardsState = {};

    var newCards = container.querySelectorAll(className + ':not(.removed)');
    newCards.forEach(card => initCard(card, className, container));

    container.classList.add('loaded');
}

function initCardsA() {
    initCards(tinderContainerA, '.swipecard');
    synchronizeCards()
}

function initCardsM() {
    initCards(tinderContainerM, '.swipecardm');
    synchronizeCards();
}

function escapeSelector(id) {
    return id.replace(/([.#])/g, '\\$1');
}

function synchronizeCards() {
    Object.keys(swipedCardsState).forEach(cardId => {
        var escapedId = escapeSelector(cardId);

        var cardA = tinderContainerA.querySelector(`[data-id="${escapedId}"]`);
        var cardM = tinderContainerM.querySelector(`[data-id="${escapedId}"]`);

        if (cardA) cardA.remove();
        if (cardM) cardM.remove();
    });
}

initCardsA();
initCardsM();

function createButtonListener(love) {
    return function (event) {
        var cardsA = document.querySelectorAll('.swipecard:not(.removed)');
        var moveOutWidth = document.body.clientWidth * 1.5;

        if (!cardsA.length) return false;

        var cardA = cardsA[0];
        cardA.classList.add('removed');

        if (love) {
            cardA.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';

            cardA.addEventListener('transitionend', function onTransitionEnd() {
                sendSwipeAction(cardA.dataset.id, 'love');
                swipedCardsState[cardA.dataset.id] = true;
                synchronizeCards();
                initCardsA();
                initCardsM();
                cardA.removeEventListener('transitionend', onTransitionEnd);
            });
        } else {
            cardA.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';

            cardA.addEventListener('transitionend', function onTransitionEnd() {
                sendSwipeAction(cardA.dataset.id, 'nope');
                swipedCardsState[cardA.dataset.id] = true;
                synchronizeCards();
                initCardsA();
                initCardsM();
                cardA.removeEventListener('transitionend', onTransitionEnd);
            });
        }
        event.preventDefault();
    };
}

var nopeListener = createButtonListener(false);
var loveListener = createButtonListener(true);

nope.addEventListener('click', nopeListener);
love.addEventListener('click', loveListener);

let swipecount = 0;
let totalcount = 0;

async function makerecommendation() {
    swipecount += 1;

    if (swipecount == totalcount) {
        startLoader();
        try {
            await fetchdata();
        } finally {
            swipecount = 0;
        }
    }
}

function sendSwipeAction(id, action) {
    makerecommendation();

    const data = { swipedid: id, action: action };

    fetch('/saveswipes', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

async function fetchdata() {
    try {
        const response = await fetch('/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data && data.recommendations && data.recommendations.length > 0) {
            const userprofiles = data.recommendations;
            totalcount = userprofiles.length
            displayUserProfiles(userprofiles);
        } else {
            displaynomatch();
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        stopLoader();
    }
}

//startLoader()
//fetchdata()

function startLoader() {

    document.querySelectorAll(".loader-container").forEach(loader => {
        loader.style.display = "flex";
    })

    document.querySelectorAll(".loader-text").forEach(loaderText => {
        loaderText.textContent = "Finding your perfect match...";
    });

    let messages = [
        "Searching for connections...",
        "Loading potential profiles...",
        "Almost there...",
        "Matching you with the best...",
        "Creating your ideal match...",
        "Connecting hearts...",
        "Preparing your swipe list...",
        "Bringing you closer to your match...",
        "Searching for sparks...",
        "Fetching your potential dates...",
        "Finding your next favorite swipe...",
        "Curating top profiles for you...",
        "Getting your matches ready...",
    ];
    let index = 0;

    intervalId = setInterval(() => {
        index = (index + 1) % messages.length;
        document.querySelectorAll(".loader-text").forEach(loaderText => {
            loaderText.textContent = messages[index];
        });
    }, 2000);
}

function stopLoader() {
    document.querySelectorAll(".loader-container").forEach(loader => {
        loader.style.display = "none";
    })
    document.querySelectorAll(".loader-text").forEach(loaderText => {
        loaderText.textContent = "";
    });

    clearInterval(intervalId);
}


function base64ToImage(base64) {
    const img = new Image();
    img.src = base64;
    img.alt = "Swipe Image";
    img.draggable = false;
    return img;
}

function createSwipeCard(profile) {
    const card = document.createElement('div');
    card.classList.add('swipecard');
    card.dataset.id = profile.id;

    const img = base64ToImage(profile.photo.data);
    const age = profile.dateOfBirth;
    const text = document.createElement('p');

    text.textContent = `${profile.firstName} ${profile.lastName} ${age}`;

    card.appendChild(img);
    card.appendChild(text);
    return card;
}

function createSwipeCardm(profile) {
    const card = document.createElement('div');
    card.classList.add('swipecardm');
    card.dataset.id = profile.id;

    const img = base64ToImage(profile.photo.data);
    const age = profile.dateOfBirth;
    const text = document.createElement('p');

    text.textContent = `${profile.firstName} ${profile.lastName} ${age}`;

    card.appendChild(img);
    card.appendChild(text);
    return card;
}

async function displayUserProfiles(userprofiles) {
    const container = document.getElementById('swipe-imagecontainer');
    const containerm = document.getElementById('swipe-imagecontainerm');

    userprofiles.forEach(profile => {
        const card = createSwipeCard(profile);
        container.appendChild(card);
    });

    userprofiles.forEach(profile => {
        const card = createSwipeCardm(profile);
        containerm.appendChild(card);
    });

    initCardsA();
    initCardsM();
}

async function displaynomatch() {
    const swipeimagecontainer = document.getElementById('swipe-imagecontainer')
    const swipeimagecontainerm = document.getElementById('swipe-imagecontainerm')

    const nomoreswipes1 = document.createElement('div')
    nomoreswipes1.classList.add('no-more-swipes')

    const nomoreswipesp1 = document.createElement('p')
    nomoreswipesp1.classList.add('no-more-swipesp1')
    nomoreswipesp1.textContent = "Oops!"

    const nomoreswipesp2 = document.createElement('p')
    nomoreswipesp2.classList.add('no-more-swipesp2')
    nomoreswipesp2.textContent = "There are currently no matches for you. Please come back later."

    const nomoreswipesp3 = document.createElement('p')
    nomoreswipesp3.classList.add('no-more-swipesp3')
    nomoreswipesp3.textContent = "Try again"

    nomoreswipes1.appendChild(nomoreswipesp1)
    nomoreswipes1.appendChild(nomoreswipesp2)
    nomoreswipes1.appendChild(nomoreswipesp3)

    swipeimagecontainer.appendChild(nomoreswipes1)

    const nomoreswipes2 = document.createElement('div')
    nomoreswipes2.classList.add('no-more-swipes')

    const nomoreswipesp1m = document.createElement('p')
    nomoreswipesp1m.classList.add('no-more-swipesp1')
    nomoreswipesp1m.textContent = "Oops!"

    const nomoreswipesp2m = document.createElement('p')
    nomoreswipesp2m.classList.add('no-more-swipesp2')
    nomoreswipesp2m.textContent = "There are currently no matches for you. Please come back later."

    const nomoreswipesp3m = document.createElement('p')
    nomoreswipesp3m.classList.add('no-more-swipesp3')
    nomoreswipesp3m.textContent = "Try again"

    nomoreswipes2.appendChild(nomoreswipesp1m)
    nomoreswipes2.appendChild(nomoreswipesp2m)
    nomoreswipes2.appendChild(nomoreswipesp3m)

    swipeimagecontainerm.appendChild(nomoreswipes2)
}

async function fetchInitialData() {
    try {
        const likedUsersResponse = await fetch('/likedusers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!likedUsersResponse.ok) {
            throw new Error('Failed to fetch liked users');
        }

        const likedUsers = await likedUsersResponse.json();
        if (likedUsers.length > 0) {
            populateLikedUsers(likedUsers);
        }

        const matchesResponse = await fetch('/getMatches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!matchesResponse.ok) {
            throw new Error('Failed to fetch matches');
        }

        const matches = await matchesResponse.json();
        if (matches.length > 0) {
            populateMatches(matches);
            popualatechatusers(matches)
        }

        connectToSocket();
    } catch (error) {
        console.error('Error fetching initial data:', error);
    }
}

function populateLikedUsers(users) {
    const likedUsersContainer = document.getElementById('user-list1');
    likedUsersContainer.innerHTML = '';

    const swiperwrapper1 = document.getElementById('swiper-wrapper1')
    swiperwrapper1.innerHTML = '';

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('usercard');
        userCard.setAttribute('data-userid', user.id);

        const userImageDiv = document.createElement('div');
        userImageDiv.classList.add('user-image');
        const userImage = document.createElement('img');
        userImage.classList.add('userprofile-icon');
        userImage.src = user.photo.data;
        userImage.alt = 'User Profile';
        userImageDiv.appendChild(userImage);

        const rightContainer = document.createElement('div');
        rightContainer.classList.add('right-container-usercard');

        const usernameWrapper = document.createElement('div');
        usernameWrapper.classList.add('username-wrapper');
        const usernameSpan = document.createElement('span');
        usernameSpan.classList.add('username');
        usernameSpan.textContent = user.firstName + ' ' + user.lastName;
        usernameWrapper.appendChild(usernameSpan);

        const dislikeParent = document.createElement('div');
        dislikeParent.classList.add('dislike-parent');

        const dislikeIcon = document.createElement('img');
        dislikeIcon.classList.add('dislike-icon');
        dislikeIcon.id = 'dislike-icon';
        dislikeIcon.src = 'media/dislike.png';
        dislikeIcon.alt = 'Dislike';

        const likeIcon = document.createElement('img');
        likeIcon.classList.add('like-icon');
        likeIcon.id = 'like-icon';
        likeIcon.src = 'media/like.png';
        likeIcon.alt = 'Like';

        dislikeParent.appendChild(dislikeIcon);
        dislikeParent.appendChild(likeIcon);

        rightContainer.appendChild(usernameWrapper);
        rightContainer.appendChild(dislikeParent);

        userCard.appendChild(userImageDiv);
        userCard.appendChild(rightContainer);

        likedUsersContainer.appendChild(userCard);
    });

    users.forEach(user => {
        const swiperslide = document.createElement('div');
        swiperslide.classList.add('swiper-slide');

        const userCard = document.createElement('div');
        userCard.classList.add('usercard');
        userCard.setAttribute('data-userid', user.id);

        const userImageDiv = document.createElement('div');
        userImageDiv.classList.add('user-image');
        const userImage = document.createElement('img');
        userImage.classList.add('userprofile-icon');
        userImage.src = user.photo.data;
        userImage.alt = 'User Profile';
        userImageDiv.appendChild(userImage);

        const rightContainer = document.createElement('div');
        rightContainer.classList.add('right-container-usercard');

        const usernameWrapper = document.createElement('div');
        usernameWrapper.classList.add('username-wrapper');
        const usernameSpan = document.createElement('span');
        usernameSpan.classList.add('username');
        usernameSpan.textContent = user.firstName + ' ' + user.lastName;
        usernameWrapper.appendChild(usernameSpan);

        const dislikeParent = document.createElement('div');
        dislikeParent.classList.add('dislike-parent');

        const dislikeIcon = document.createElement('img');
        dislikeIcon.classList.add('dislike-icon');
        dislikeIcon.id = 'dislike-icon';
        dislikeIcon.src = 'media/dislike.png';
        dislikeIcon.alt = 'Dislike';

        const likeIcon = document.createElement('img');
        likeIcon.classList.add('like-icon');
        likeIcon.id = 'like-icon';
        likeIcon.src = 'media/like.png';
        likeIcon.alt = 'Like';

        dislikeParent.appendChild(dislikeIcon);
        dislikeParent.appendChild(likeIcon);

        rightContainer.appendChild(usernameWrapper);
        rightContainer.appendChild(dislikeParent);

        userCard.appendChild(userImageDiv);
        userCard.appendChild(rightContainer);

        swiperslide.appendChild(userCard);
        swiperwrapper1.appendChild(swiperslide);
    });
}

function populateMatches(users) {
    const matchesContainer = document.getElementById('user-list2');
    matchesContainer.innerHTML = '';

    const swiperwrapper2 = document.getElementById('swiper-wrapper2')
    swiperwrapper2.innerHTML = '';

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('usercard');
        userCard.setAttribute('data-userid', user.id);

        const userImageDiv = document.createElement('div');
        userImageDiv.classList.add('user-image');
        const userImage = document.createElement('img');
        userImage.classList.add('userprofile-icon');
        userImage.src = user.photo.data;
        userImage.alt = 'User Profile';
        userImageDiv.appendChild(userImage);

        const rightContainer = document.createElement('div');
        rightContainer.classList.add('right-container-usercard');

        const usernameWrapper = document.createElement('div');
        usernameWrapper.classList.add('username-wrapper');
        const usernameSpan = document.createElement('span');
        usernameSpan.classList.add('username');
        usernameSpan.textContent = user.firstName + ' ' + user.lastName;
        usernameWrapper.appendChild(usernameSpan);

        const age = document.createElement('p')
        age.classList.add('matchuserage')
        age.textContent = user.age

        rightContainer.appendChild(usernameWrapper);
        rightContainer.appendChild(age)

        userCard.appendChild(userImageDiv);
        userCard.appendChild(rightContainer);

        matchesContainer.appendChild(userCard);
    });

    users.forEach(user => {
        const swiperslide = document.createElement('div')
        swiperslide.classList.add('swiper-slide')

        const userCard = document.createElement('div');
        userCard.classList.add('usercard');
        userCard.setAttribute('data-userid', user.id);

        const userImageDiv = document.createElement('div');
        userImageDiv.classList.add('user-image');
        const userImage = document.createElement('img');
        userImage.classList.add('userprofile-icon');
        userImage.src = user.photo.data;
        userImage.alt = 'User Profile';
        userImageDiv.appendChild(userImage);

        const rightContainer = document.createElement('div');
        rightContainer.classList.add('right-container-usercard');

        const usernameWrapper = document.createElement('div');
        usernameWrapper.classList.add('username-wrapper');
        const usernameSpan = document.createElement('span');
        usernameSpan.classList.add('username');
        usernameSpan.textContent = user.firstName + ' ' + user.lastName;
        usernameWrapper.appendChild(usernameSpan);

        const age = document.createElement('p')
        age.classList.add('matchuserage')
        age.textContent = user.age

        rightContainer.appendChild(usernameWrapper);
        rightContainer.appendChild(age)

        userCard.appendChild(userImageDiv);
        userCard.appendChild(rightContainer);

        swiperslide.appendChild(userCard);
        swiperwrapper2.appendChild(swiperslide)
    });
}

function connectToSocket() {
    socket = io('http://localhost:4000');

    socket.on('connect', () => { });

    socket.on('update', (data) => {
        updateLikedUsers(data.data[0]);
    });

    socket.on('match', (data) => {
        updateMatches(data.data[0]);
    });

    socket.on('userOnline', (profileData) => {
        addnewuseruniverse(profileData);
    });

    socket.on('allUsers', (profiles) => {
        if (Array.isArray(profiles)) {
            updatealluseruniverse(profiles);
        }
    });

    socket.on('userOffline', ({ userId }) => {
        removetheuseruniverse(userId);
    });

    socket.on('onlineFriends', (onlineFriends) => {
        updateOnlineFriends(onlineFriends);
    });

    socket.on("messagesended", (data) => {
        const { sentMessage } = data;
        updateusersendedmessage(sentMessage)
    });

    socket.on('newmessage', (data) => {
        populatereceivedmessage(data)
    })

    socket.on('readedallm', (data) => {
        const { reqid } = data;
        markMessagesAsRead(reqid);
    });

    socket.on('readmessage', (data) => {
        const { messageid } = data;
        markamessageasread(messageid)
    })

    socket.on('disconnect', () => { });
}

async function connectionaction(userid, action) {
    const data = {
        swipeeId: userid,
        action: action
    };

    try {
        const response = await fetch('/connectionaction', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}

function removeUserCard(userId) {
    const userCardElements = document.querySelectorAll(`.usercard[data-userid='${userId}']`);

    userCardElements.forEach(card => {
        card.remove();
    });
}

async function updateLikedUsers(user) {
    const likedUsersContainer = document.getElementById('user-list1');
    const swiperwrapper1 = document.getElementById('swiper-wrapper1');

    const nodataText1 = likedUsersContainer.querySelector('.nodatatext');
    if (nodataText1) {
        likedUsersContainer.removeChild(nodataText1);
    }

    const nodataText2 = swiperwrapper1.querySelector('.nodatatext');
    if (nodataText2) {
        swiperwrapper1.removeChild(nodataText2);
    }

    const swiperslide = document.createElement('div');
    swiperslide.classList.add('swiper-slide');

    const userCard = document.createElement('div');
    userCard.classList.add('usercard');
    userCard.setAttribute('data-userid', user.id);

    const userCard1 = document.createElement('div');
    userCard1.classList.add('usercard');
    userCard1.setAttribute('data-userid', user.id);

    const userImageDiv = document.createElement('div');
    userImageDiv.classList.add('user-image');
    const userImage = document.createElement('img');
    userImage.classList.add('userprofile-icon');
    userImage.src = user.photo.data;
    userImage.alt = 'User Profile';
    userImageDiv.appendChild(userImage);

    const userImageDiv1 = document.createElement('div');
    userImageDiv1.classList.add('user-image');
    const userImage1 = document.createElement('img');
    userImage1.classList.add('userprofile-icon');
    userImage1.src = user.photo.data;
    userImage1.alt = 'User Profile';
    userImageDiv1.appendChild(userImage1);

    const rightContainer = document.createElement('div');
    rightContainer.classList.add('right-container-usercard');

    const rightContainer1 = document.createElement('div');
    rightContainer1.classList.add('right-container-usercard');

    const usernameWrapper = document.createElement('div');
    usernameWrapper.classList.add('username-wrapper');
    const usernameSpan = document.createElement('span');
    usernameSpan.classList.add('username');
    usernameSpan.textContent = user.firstName + ' ' + user.lastName;
    usernameWrapper.appendChild(usernameSpan);

    const usernameWrapper1 = document.createElement('div');
    usernameWrapper1.classList.add('username-wrapper');
    const usernameSpan1 = document.createElement('span');
    usernameSpan1.classList.add('username');
    usernameSpan1.textContent = user.firstName + ' ' + user.lastName;
    usernameWrapper1.appendChild(usernameSpan1);

    const dislikeParent = document.createElement('div');
    dislikeParent.classList.add('dislike-parent');

    const dislikeParent1 = document.createElement('div');
    dislikeParent1.classList.add('dislike-parent');

    const dislikeIcon = document.createElement('img');
    dislikeIcon.classList.add('dislike-icon');
    dislikeIcon.id = 'dislike-icon';
    dislikeIcon.src = 'media/dislike.png';
    dislikeIcon.alt = 'Dislike';

    const dislikeIcon1 = document.createElement('img');
    dislikeIcon1.classList.add('dislike-icon');
    dislikeIcon1.id = 'dislike-icon';
    dislikeIcon1.src = 'media/dislike.png';
    dislikeIcon1.alt = 'Dislike';

    const likeIcon = document.createElement('img');
    likeIcon.classList.add('like-icon');
    likeIcon.id = 'like-icon';
    likeIcon.src = 'media/like.png';
    likeIcon.alt = 'Like';


    const likeIcon1 = document.createElement('img');
    likeIcon1.classList.add('like-icon');
    likeIcon1.id = 'like-icon';
    likeIcon1.src = 'media/like.png';
    likeIcon1.alt = 'Like';

    dislikeParent.appendChild(dislikeIcon);
    dislikeParent.appendChild(likeIcon);

    dislikeParent1.appendChild(dislikeIcon1);
    dislikeParent1.appendChild(likeIcon1);

    rightContainer.appendChild(usernameWrapper);
    rightContainer.appendChild(dislikeParent);

    rightContainer1.appendChild(usernameWrapper1);
    rightContainer1.appendChild(dislikeParent1);

    userCard.appendChild(userImageDiv);
    userCard.appendChild(rightContainer);

    userCard1.appendChild(userImageDiv1);
    userCard1.appendChild(rightContainer1);

    likedUsersContainer.appendChild(userCard);
    swiperslide.appendChild(userCard1);
    swiperwrapper1.appendChild(swiperslide);
}

async function updateMatches(user) {
    const matchesContainer = document.getElementById('user-list2');

    const swiperwrapper2 = document.getElementById('swiper-wrapper2')

    const nodataText1 = swiperwrapper2.querySelector('.nodatatext');
    if (nodataText1) {
        swiperwrapper2.removeChild(nodataText1);
    }

    const nodataText2 = matchesContainer.querySelector('.nodatatext');
    if (nodataText2) {
        matchesContainer.removeChild(nodataText2);
    }


    const userCard = document.createElement('div');
    userCard.classList.add('usercard');
    userCard.setAttribute('data-userid', user.id);

    const userImageDiv = document.createElement('div');
    userImageDiv.classList.add('user-image');
    const userImage = document.createElement('img');
    userImage.classList.add('userprofile-icon');
    userImage.src = user.photo.data;
    userImage.alt = 'User Profile';
    userImageDiv.appendChild(userImage);

    const rightContainer = document.createElement('div');
    rightContainer.classList.add('right-container-usercard');

    const usernameWrapper = document.createElement('div');
    usernameWrapper.classList.add('username-wrapper');
    const usernameSpan = document.createElement('span');
    usernameSpan.classList.add('username');
    usernameSpan.textContent = user.firstName + ' ' + user.lastName;
    usernameWrapper.appendChild(usernameSpan);

    const age = document.createElement('p')
    age.classList.add('matchuserage')
    age.textContent = user.age

    rightContainer.appendChild(usernameWrapper);
    rightContainer.appendChild(age)

    userCard.appendChild(userImageDiv);
    userCard.appendChild(rightContainer);

    matchesContainer.appendChild(userCard);

    const swiperslide = document.createElement('div')
    swiperslide.classList.add('swiper-slide')

    const userCard1 = document.createElement('div');
    userCard1.classList.add('usercard');
    userCard1.setAttribute('data-userid', user.id);

    const userImageDiv1 = document.createElement('div');
    userImageDiv1.classList.add('user-image');
    const userImage1 = document.createElement('img');
    userImage1.classList.add('userprofile-icon');
    userImage1.src = user.photo.data;
    userImage1.alt = 'User Profile';
    userImageDiv1.appendChild(userImage1);

    const rightContainer1 = document.createElement('div');
    rightContainer1.classList.add('right-container-usercard');

    const usernameWrapper1 = document.createElement('div');
    usernameWrapper1.classList.add('username-wrapper');
    const usernameSpan1 = document.createElement('span');
    usernameSpan1.classList.add('username');
    usernameSpan1.textContent = user.firstName + ' ' + user.lastName;
    usernameWrapper1.appendChild(usernameSpan1);

    const age1 = document.createElement('p')
    age1.classList.add('matchuserage')
    age1.textContent = user.age

    rightContainer1.appendChild(usernameWrapper1);
    rightContainer1.appendChild(age1)

    userCard1.appendChild(userImageDiv1);
    userCard1.appendChild(rightContainer1);

    swiperslide.appendChild(userCard1);
    swiperwrapper2.appendChild(swiperslide)
}


//universe section

async function assignheightuniverse() {
    const centercontainerHeight = document.getElementById('center-container').offsetHeight;
    document.getElementById('main-universe-container1').style.height = `${centercontainerHeight}px`;
    document.getElementById('universe-scrollable-container1').style.height = `${centercontainerHeight}px`;
}

assignheightuniverse();

window.addEventListener('resize', assignheightuniverse);
function checkAndUpdateuniverse() {
    const sectionm2 = document.querySelector("#sectionm2");

    if (sectionm2 && sectionm2.classList.contains("active")) {
        assignheightuniverse();
    }
}

const sectionm3 = document.getElementById('sectionm1');

const observer4 = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            checkAndUpdateuniverse();
        }
    });
})

if (sectionm3) {
    observer4.observe(sectionm3, { attributes: true });
}

checkAndUpdateuniverse();

async function updatealluseruniverse(profiles) {
    const universescrollablecontainer1 = document.getElementById('universe-scrollable-container1')
    universescrollablecontainer1.innerHTML = "";

    const universescrollablecontainer2 = document.getElementById('universe-scrollable-container2')
    universescrollablecontainer2.innerHTML = "";

    profiles.forEach(profile => {
        const universecard = document.createElement('div')
        universecard.classList.add('universe-card')
        universecard.setAttribute('data-userid', profile.userId)

        const userImagediv = document.createElement('div');
        userImagediv.classList.add('universe-profilediv');
        const userImage = document.createElement('img')
        userImage.classList.add('universe-userprofile')
        userImage.src = profile.photo.data;
        userImagediv.appendChild(userImage)
        universecard.appendChild(userImagediv)

        const text = document.createElement('p')
        text.textContent = profile.firstName + ' ' + profile.lastName + '-' + profile.age
        universecard.appendChild(text)

        universescrollablecontainer1.appendChild(universecard)
    })

    profiles.forEach(profile => {
        const universecard = document.createElement('div')
        universecard.classList.add('universe-card')
        universecard.setAttribute('data-userid', profile.userId)

        const userImagediv = document.createElement('div');
        userImagediv.classList.add('universe-profilediv');
        const userImage = document.createElement('img')
        userImage.classList.add('universe-userprofile')
        userImage.src = profile.photo.data;
        userImagediv.appendChild(userImage)
        universecard.appendChild(userImagediv)

        const text = document.createElement('p')
        text.textContent = profile.firstName + ' ' + profile.lastName + '-' + profile.age
        universecard.appendChild(text)

        universescrollablecontainer2.appendChild(universecard)
    })
}

async function addnewuseruniverse(profileData) {
    const universescrollablecontainer1 = document.getElementById('universe-scrollable-container1');
    const universescrollablecontainer2 = document.getElementById('universe-scrollable-container2');

    const existingCards = document.querySelectorAll('.universe-card');

    if (existingCards.length === 0) {
        universescrollablecontainer1.innerHTML = '';
        universescrollablecontainer2.innerHTML = '';
    }

    if (profileData) {
        const universecard = document.createElement('div');
        universecard.classList.add('universe-card');
        universecard.setAttribute('data-userid', profileData.userId);

        const userImagediv = document.createElement('div');
        userImagediv.classList.add('universe-profilediv');
        const userImage = document.createElement('img');
        userImage.classList.add('universe-userprofile');
        userImage.src = profileData.photo.data;
        userImagediv.appendChild(userImage);
        universecard.appendChild(userImagediv);

        const text = document.createElement('p');
        text.textContent = `${profileData.firstName} ${profileData.lastName} - ${profileData.age}`;
        universecard.appendChild(text);

        universescrollablecontainer1.appendChild(universecard);
    }

    if (profileData) {
        const universecard = document.createElement('div');
        universecard.classList.add('universe-card');
        universecard.setAttribute('data-userid', profileData.userId);

        const userImagediv = document.createElement('div');
        userImagediv.classList.add('universe-profilediv');
        const userImage = document.createElement('img');
        userImage.classList.add('universe-userprofile');
        userImage.src = profileData.photo.data;
        userImagediv.appendChild(userImage);
        universecard.appendChild(userImagediv);

        const text = document.createElement('p');
        text.textContent = `${profileData.firstName} ${profileData.lastName} - ${profileData.age}`;
        universecard.appendChild(text);

        universescrollablecontainer2.appendChild(universecard);
    }
}

async function removetheuseruniverse(userid) {
    const universescrollablecontainer1 = document.getElementById('universe-scrollable-container1');
    const universescrollablecontainer2 = document.getElementById('universe-scrollable-container2');

    const universecardElements = document.querySelectorAll(`.universe-card[data-userid='${userid}']`);

    universecardElements.forEach(card => {
        card.remove();
    });

    const remainingCards = document.querySelectorAll('.universe-card');

    if (remainingCards.length === 0) {
        universescrollablecontainer1.innerHTML = '';
        universescrollablecontainer2.innerHTML = '';

        const messageElement1 = document.createElement('p');
        messageElement1.classList.add('nodatatext-universe')
        messageElement1.textContent = " It looks like you're the only one here at the moment. Try refreshing in a bit! ";

        const messageElement2 = document.createElement('p');
        messageElement2.classList.add('nodatatext-universe')
        messageElement2.textContent = " It looks like you're the only one here at the moment. Try refreshing in a bit! "

        universescrollablecontainer1.appendChild(messageElement1);
        universescrollablecontainer2.appendChild(messageElement2);
    }
}

async function updateOnlineFriends(onlineFriends) {
    const messageInner = document.querySelector('.message-inner');
    messageInner.innerHTML = ""

    onlineFriends.forEach(friend => {
        const messageProfile = document.createElement('div');
        messageProfile.id = friend.userId
        messageProfile.classList.add('messageprofile');
        messageProfile.style.backgroundImage = `url('${friend.photo}')`;
        messageInner.appendChild(messageProfile);
    });
}



// chat.js 


function changestyleforchat() {
    document.getElementById('app').style.height = `${window.innerHeight - 85}px`;
    document.getElementById('non-text-container').style.height = `${window.innerHeight - 85}px`
    document.getElementById('chat-container-m').style.width = `${window.innerWidth}px`;
    document.getElementById('chat-overlay2').style.height = `${window.innerHeight - 85}px`
}

changestyleforchat();
window.addEventListener('resize', changestyleforchat);

document.getElementById('chat-list1').addEventListener('click', (event) => {
    const userCard = event.target.closest('.chat-usercard');
    document.querySelectorAll('.chat-usercard').forEach(function (card) {
        card.classList.remove('active-card')
    })

    if (userCard) {
        const userid = userCard.getAttribute('data-userid');
        const userCards = document.querySelectorAll(`.chat-usercard[data-userid="${userid}"]`);
        userCards.forEach(function (card) {
            card.classList.add('active-card');
        });
        const profileImgSrc = userCard.querySelector('.chat-userimg').src;
        const username = userCard.querySelector('.chat-username').textContent;
        document.getElementById('non-text-container').classList.add('active-none')
        document.getElementById('chat-list2').classList.add('active-none')
        document.querySelectorAll('.chat-overlay').forEach(function (element) {
            element.classList.add('active-grid')
        })
        updateVisibility();
        populateuserdata(userid, profileImgSrc, username)
        addLoader()
        //getuserchat(userid)
    }
});

document.getElementById('chat-list2').addEventListener('click', (event) => {
    const userCard = event.target.closest('.chat-usercard');
    document.querySelectorAll('.chat-usercard').forEach(function (card) {
        card.classList.remove('active-card')
    })

    if (userCard) {
        const userid = userCard.getAttribute('data-userid');
        const userCards = document.querySelectorAll(`.chat-usercard[data-userid="${userid}"]`);
        userCards.forEach(function (card) {
            card.classList.add('active-card');
        });
        const profileImgSrc = userCard.querySelector('.chat-userimg').src;
        const username = userCard.querySelector('.chat-username').textContent;
        document.getElementById('non-text-container').classList.add('active-none')
        document.getElementById('chat-list2').classList.add('active-none')
        document.querySelectorAll('.chat-overlay').forEach(function (element) {
            element.classList.add('active-grid')
        })
        updateVisibility();
        populateuserdata(userid, profileImgSrc, username)
        addLoader()
        //getuserchat(userid)
    }
})

document.querySelectorAll('.back-btn').forEach(function (element) {
    element.addEventListener('click', function () {
        undoPopulateuserdata()
        document.getElementById('non-text-container').classList.remove('active-none')
        document.getElementById('chat-list2').classList.remove('active-none')
        document.querySelectorAll('.chat-overlay').forEach(function (element) {
            element.classList.remove('active-grid')
        })
        updateVisibility()
    });
});


const rightChatContainer = document.querySelector('.right-chat-container');

rightChatContainer.addEventListener('click', function (event) {
    const target = event.target;

    if (target.id === 'chat-message-sender' || target.closest('#chat-message-sender')) {

        const chatTypeField = target.closest('.chat-typefield');
        if (chatTypeField) {
            const textarea = chatTypeField.querySelector('.chat-typefield-textarea');
            if (textarea) {
                const message = textarea.value;
                const messageId = uuid.v4();
                const chatUserInfo = chatTypeField.parentElement.querySelector('.chat-userinfomation');
                const id = chatUserInfo.getAttribute('data-userid')
                addmessageinitialstage(message, id, messageId)
                const textareas = document.querySelectorAll('.chat-typefield-textarea');
                textareas.forEach(textarea => {
                    textarea.value = '';
                });
                sendMessage(id, message, messageId)
            }
        }
    }
});

const chatoverlay = document.getElementById('chat-overlay');

chatoverlay.addEventListener('click', function (event) {
    const target = event.target;

    if (target.id === 'chat-message-senderm' || target.closest('#chat-message-senderm')) {

        const chatTypeField = target.closest('.chat-typefield');
        if (chatTypeField) {
            const textarea = chatTypeField.querySelector('.chat-typefield-textarea');
            if (textarea) {
                const message = textarea.value;
                const messageId = uuid.v4();
                const chatUserInfo = chatTypeField.parentElement.querySelector('.chat-userinfomation');
                const id = chatUserInfo.getAttribute('data-userid')
                addmessageinitialstage(message, id, messageId)
                const textareas = document.querySelectorAll('.chat-typefield-textarea');
                textareas.forEach(textarea => {
                    textarea.value = '';
                });
                sendMessage(id, message, messageId)
            }
        }
    }
});

const chatoverlay2 = document.getElementById('chat-overlay2')
chatoverlay2.addEventListener('click', function (event) {
    const target = event.target;

    if (target.id === 'chat-message-sender' || target.closest('#chat-message-sender')) {

        const chatTypeField = target.closest('.chat-typefield');
        if (chatTypeField) {
            const textarea = chatTypeField.querySelector('.chat-typefield-textarea');
            if (textarea) {
                const message = textarea.value;
                const messageId = uuid.v4();
                const chatUserInfo = chatTypeField.parentElement.querySelector('.chat-userinfomation');
                const id = chatUserInfo.getAttribute('data-userid')
                addmessageinitialstage(message, id, messageId)
                const textareas = document.querySelectorAll('.chat-typefield-textarea');
                textareas.forEach(textarea => {
                    textarea.value = '';
                });
                sendMessage(id, message, messageId)
            }
        }
    }
});

async function sendMessage(receiverId, text, cmessageid) {
    socket.emit("sendmessage", { receiverId, text, cmessageid });
}

async function emitreadedmessage(messageid) {
    socket.emit("messagereaded", { messageid });
}

async function getuserchat(userid) {
    try {
        const response = await fetch('/getuserchat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: userid })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.message === 'no conversation') {
            return;
        }
        populateUserChat(data, userid);
    } catch (error) {
        console.error('Error:', error);
    }
}


async function populateuserdata(userid, profileImgSrc, username) {

    const rightContainer = document.querySelector('.right-chat-container');

    rightContainer.querySelectorAll('.chat-userinfomation').forEach(function (element) {
        element.setAttribute('data-userid', userid);
    });

    rightContainer.querySelectorAll('.chat-userimg').forEach(function (element) {
        element.src = profileImgSrc;
    });

    rightContainer.querySelectorAll('.chat-username').forEach(function (element) {
        element.textContent = username;
    });

    const chatOverlays = document.querySelectorAll('.chat-overlay');

    chatOverlays.forEach(function (overlay) {
        overlay.querySelectorAll('.chat-userinfomation').forEach(function (element) {
            element.setAttribute('data-userid', userid);
        });

        overlay.querySelectorAll('.chat-userimg').forEach(function (element) {
            element.src = profileImgSrc;
        });

        overlay.querySelectorAll('.chat-username').forEach(function (element) {
            element.textContent = username;
        });
    });

    document.querySelectorAll('.chat-userinfomation').forEach(function (element) {
        element.classList.add('active-flex')
    })

    document.querySelectorAll('.chat-message-field').forEach(function (element) {
        element.classList.add('active-flex')
        element.innerHTML = ''
    })

    document.querySelectorAll('.chat-typefield').forEach(function (element) {
        element.classList.add('active-flex')
    })
}

function updateVisibility() {
    const overlayMainContainer = document.querySelector('.chat-overlaymain-container');
    const chatlist1 = document.getElementById('chat-list1')
    const chatoverlay2 = document.getElementById('chat-overlay2')

    if (window.innerWidth <= 998) {
        if (chatoverlay2.classList.contains('active-grid')) {
            overlayMainContainer.style.display = 'block'
        }
        else {
            overlayMainContainer.style.display = 'none'
        }
    }
    else {
        if (chatoverlay2.classList.contains('active-grid')) {
            overlayMainContainer.style.display = 'none'
        }
    }
}
updateVisibility();
window.addEventListener('resize', updateVisibility);

async function undoPopulateuserdata() {
    const rightContainer = document.querySelector('.right-chat-container');

    rightContainer.querySelectorAll('.chat-userinfomation').forEach(function (element) {
        element.removeAttribute('data-userid');
    });

    rightContainer.querySelectorAll('.chat-userimg').forEach(function (element) {
        element.src = '';
    });

    rightContainer.querySelectorAll('.chat-username').forEach(function (element) {
        element.textContent = '';
    });

    const chatOverlays = document.querySelectorAll('.chat-overlay');

    chatOverlays.forEach(function (overlay) {
        overlay.querySelectorAll('.chat-userinfomation').forEach(function (element) {
            element.removeAttribute('data-userid');
        });

        overlay.querySelectorAll('.chat-userimg').forEach(function (element) {
            element.src = '';
        });

        overlay.querySelectorAll('.chat-username').forEach(function (element) {
            element.textContent = '';
        });
    });

    document.querySelectorAll('.chat-userinfomation').forEach(function (element) {
        element.classList.remove('active-flex');
    });

    document.querySelectorAll('.chat-message-field').forEach(function (element) {
        element.classList.remove('active-flex');

        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    });

    document.querySelectorAll('.chat-typefield').forEach(function (element) {
        element.classList.remove('active-flex');
    });

    const desktopTextarea = document.getElementById('chat-typefield-textarea');
    const tabTextarea = document.getElementById('chat-typefield-textaread');
    const mobileTextarea = document.getElementById('chat-typefield-textaream');

    desktopTextarea.value = ''
    tabTextarea.value = ''
    mobileTextarea.value = ''

    document.querySelectorAll('.chat-usercard').forEach(function (card) {
        card.classList.remove('active-card')
    })

}

const desktopTextarea = document.getElementById('chat-typefield-textarea');
const tabTextarea = document.getElementById('chat-typefield-textaread');
const mobileTextarea = document.getElementById('chat-typefield-textaream');

function syncTextareas(source, target) {
    target.value = source.value;
}

desktopTextarea.addEventListener('input', function () {
    syncTextareas(desktopTextarea, mobileTextarea);
    syncTextareas(desktopTextarea, tabTextarea)
});

mobileTextarea.addEventListener('input', function () {
    syncTextareas(mobileTextarea, desktopTextarea);
    syncTextareas(mobileTextarea, tabTextarea)
});

tabTextarea.addEventListener('input', function () {
    syncTextareas(tabTextarea, desktopTextarea)
    syncTextareas(tabTextarea, mobileTextarea)
})

async function popualatechatusers(users) {
    const chatlist1 = document.getElementById('chat-list1')
    const chatlist2 = document.getElementById('chat-list2')

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'chat-usercard';
        userCard.setAttribute('data-userid', user.id);

        const profileDiv = document.createElement('div');
        profileDiv.className = 'chat-usercard-profilediv';

        const userImg = document.createElement('img');
        userImg.className = 'chat-userimg';
        userImg.src = user.photo.data;

        profileDiv.appendChild(userImg);

        const userNamePara = document.createElement('p');
        userNamePara.className = 'chat-username';
        userNamePara.textContent = user.firstName + ' ' + user.lastName;

        userCard.appendChild(profileDiv);
        userCard.appendChild(userNamePara);

        chatlist1.appendChild(userCard)
    })

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'chat-usercard';
        userCard.setAttribute('data-userid', user.id);

        const profileDiv = document.createElement('div');
        profileDiv.className = 'chat-usercard-profilediv';

        const userImg = document.createElement('img');
        userImg.className = 'chat-userimg';
        userImg.src = user.photo.data;

        profileDiv.appendChild(userImg);

        const userNamePara = document.createElement('p');
        userNamePara.className = 'chat-username';
        userNamePara.textContent = user.firstName + ' ' + user.lastName;

        userCard.appendChild(profileDiv);
        userCard.appendChild(userNamePara);

        chatlist2.appendChild(userCard)
    })
}

async function populateUserChat(data, userId) {

    if (!data || !data.Messages) {
        removeMessageLoader()
        return;
    }

    const chatList1 = document.getElementById('chat-list1');
    const activeCard1 = chatList1.querySelector('.active-card');

    let activeuserid1
    if (activeCard1) {
        activeuserid1 = activeCard1.getAttribute('data-userid');
    }

    const chatlist2 = document.getElementById('chat-list2');
    const activeCard2 = chatlist2.querySelector('.active-card');

    let activeuserid2
    if (activeCard2) {
        activeuserid2 = activeCard2.getAttribute('data-userid');
    }


    if (activeuserid1 && activeuserid2 && activeuserid1 == activeuserid2 && activeuserid1 == userId) {
        removeMessageLoader()
        const messages = data.Messages;
        const chatMessageFields = document.querySelectorAll('.chat-message-field');

        chatMessageFields.forEach(function (field) {
            field.innerHTML = '';

            messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                messageDiv.setAttribute('data-messageid', message._id);

                const p = document.createElement('p');
                p.textContent = message.text;

                const metadataDiv = document.createElement('div');
                metadataDiv.className = 'metadata';

                const timeSpan = document.createElement('span');
                timeSpan.className = 'time';
                timeSpan.textContent = formatTimestamp12HourLocal(message.timestamp);

                const tickDiv = document.createElement('div');
                tickDiv.className = 'tick';

                function createSvg(width, height, viewBox, paths) {
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('width', width);
                    svg.setAttribute('height', height);
                    svg.setAttribute('viewBox', viewBox);
                    svg.setAttribute('fill', 'none');
                    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                    paths.forEach(d => {
                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', d.d);
                        if (d.stroke) path.setAttribute('stroke', d.stroke);
                        if (d.strokeWidth) path.setAttribute('stroke-width', d.strokeWidth);
                        if (d.strokeLinecap) path.setAttribute('stroke-linecap', d.strokeLinecap);
                        if (d.strokeLinejoin) path.setAttribute('stroke-linejoin', d.strokeLinejoin);
                        if (d.fill) path.setAttribute('fill', d.fill);
                        svg.appendChild(path);
                    });

                    return svg;
                }

                if (message.status === 'sent' || message.status === 'delivered' || message.status === 'read') {
                    if (message.sender !== userId) {
                        if (message.status === 'sent') {
                            const svg = createSvg('15', '12', '0 0 20 16', [{
                                d: 'M1.78125 9.28125L6.46875 13.9688L17.7188 1.78125',
                                stroke: 'rgba(0, 0, 0, .45)',
                                strokeWidth: '2.8125',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round'
                            }]);
                            tickDiv.appendChild(svg);
                        } else if (message.status === 'delivered') {
                            const svg = createSvg('18', '18', '0 0 26 16', [
                                {
                                    d: 'M2.21875 9.5L6.90625 14.1875L18.1562 2',
                                    stroke: 'rgba(0, 0, 0, .45)',
                                    strokeWidth: '2.8125',
                                    strokeLinecap: 'round',
                                    strokeLinejoin: 'round'
                                },
                                {
                                    d: 'M13.2131 12.5056L12.2188 11.5113L10.23 13.5L11.2244 14.4944L13.2131 12.5056ZM12.9062 14.1875L11.9119 15.1819C12.1825 15.4525 12.5517 15.6011 12.9344 15.5935C13.317 15.5858 13.68 15.4225 13.9396 15.1413L12.9062 14.1875ZM25.1896 2.95383C25.7164 2.38315 25.6808 1.49347 25.1101 0.966683C24.5394 0.439896 23.6497 0.475483 23.1229 1.04617L25.1896 2.95383ZM11.2244 14.4944L11.9119 15.1819L13.9006 13.1931L13.2131 12.5056L11.2244 14.4944ZM13.9396 15.1413L25.1896 2.95383L23.1229 1.04617L11.8729 13.2337L13.9396 15.1413Z',
                                    fill: 'rgba(0, 0, 0, .45)'
                                }
                            ]);
                            tickDiv.appendChild(svg);
                        } else if (message.status === 'read') {
                            const svg = createSvg('18', '18', '0 0 26 16', [
                                {
                                    d: 'M2.21875 9.5L6.90625 14.1875L18.1562 2',
                                    stroke: 'black',
                                    strokeWidth: '2.8125',
                                    strokeLinecap: 'round',
                                    strokeLinejoin: 'round'
                                },
                                {
                                    d: 'M13.2131 12.5056L12.2188 11.5113L10.23 13.5L11.2244 14.4944L13.2131 12.5056ZM12.9062 14.1875L11.9119 15.1819C12.1825 15.4525 12.5517 15.6011 12.9344 15.5935C13.317 15.5858 13.68 15.4225 13.9396 15.1413L12.9062 14.1875ZM25.1896 2.95383C25.7164 2.38315 25.6808 1.49347 25.1101 0.966683C24.5394 0.439896 23.6497 0.475483 23.1229 1.04617L25.1896 2.95383ZM11.2244 14.4944L11.9119 15.1819L13.9006 13.1931L13.2131 12.5056L11.2244 14.4944ZM13.9396 15.1413L25.1896 2.95383L23.1229 1.04617L11.8729 13.2337L13.9396 15.1413Z',
                                    fill: 'black'
                                }
                            ]);
                            tickDiv.appendChild(svg);
                        }
                    }
                }

                if (message.sender === userId) {
                    messageDiv.classList.add('received');
                } else {
                    messageDiv.classList.add('sent');
                }

                metadataDiv.appendChild(timeSpan);
                metadataDiv.appendChild(tickDiv);
                messageDiv.appendChild(p);
                messageDiv.appendChild(metadataDiv);
                field.appendChild(messageDiv);
            });
        });
    }
}

function formatTimestamp12HourLocal(timestamp) {
    const date = new Date(timestamp);

    let hours = date.getHours();
    const minutes = date.getMinutes();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

async function updateusersendedmessage(message) {
    const chatList1 = document.getElementById('chat-list1');
    const activeCard1 = chatList1.querySelector('.active-card');
    const activeuserid1 = activeCard1.getAttribute('data-userid')

    const chatlist2 = document.getElementById('chat-list2')
    const activeCard2 = chatlist2.querySelector('.active-card')
    const activeuserid2 = activeCard2.getAttribute('data-userid')

    if (activeuserid1 == activeuserid2 && activeuserid1 == message.receiverId) {

        const chatMessageFields = document.querySelectorAll('.chat-message-field');

        chatMessageFields.forEach(function (field) {
            const existingMessage = field.querySelector(`[data-messageid="${message.cmessageid}"]`);

            if (existingMessage) {
                existingMessage.setAttribute('data-messageid', message.messageid);

                const timeSpan = existingMessage.querySelector('.metadata .time');
                timeSpan.textContent = formatTimestamp12HourLocal(message.timestamp);

                const tickDiv = existingMessage.querySelector('.metadata .tick');
                tickDiv.innerHTML = '';

                appendSvgToTickDiv(tickDiv, message.status);
            }
            else {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                messageDiv.setAttribute('data-messageid', message.messageid)
                messageDiv.classList.add('sent');

                const p = document.createElement('p');
                p.textContent = message.message;

                const metadataDiv = document.createElement('div');
                metadataDiv.className = 'metadata';

                const timeSpan = document.createElement('span');
                timeSpan.className = 'time';
                timeSpan.textContent = formatTimestamp12HourLocal(message.timestamp);

                const tickDiv = document.createElement('div');
                tickDiv.className = 'tick';

                appendSvgToTickDiv(tickDiv, message.status);

                metadataDiv.appendChild(timeSpan);
                metadataDiv.appendChild(tickDiv);
                messageDiv.appendChild(p);
                messageDiv.appendChild(metadataDiv);
                field.insertBefore(messageDiv, field.firstChild);
            }
        });

    }
}

async function addmessageinitialstage(message, id, messageId) {
    const chatList1 = document.getElementById('chat-list1');
    const activeCard1 = chatList1.querySelector('.active-card');

    let activeuserid1
    if (activeCard1) {
        activeuserid1 = activeCard1.getAttribute('data-userid');
    }

    const chatlist2 = document.getElementById('chat-list2');
    const activeCard2 = chatlist2.querySelector('.active-card');

    let activeuserid2
    if (activeCard2) {
        activeuserid2 = activeCard2.getAttribute('data-userid');
    }

    if (activeuserid1 && activeuserid2 && activeuserid1 == activeuserid2 && activeuserid1 == id) {

        const chatMessageFields = document.querySelectorAll('.chat-message-field');

        chatMessageFields.forEach(function (field) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.setAttribute('data-messageid', messageId)

            const p = document.createElement('p');
            p.textContent = message;

            const metadataDiv = document.createElement('div');
            metadataDiv.className = 'metadata';

            const timeSpan = document.createElement('span');
            timeSpan.className = 'time';
            timeSpan.textContent = '';

            const tickDiv = document.createElement('div');
            tickDiv.className = 'tick';

            const svgNS = "http://www.w3.org/2000/svg";

            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("width", "15");
            svg.setAttribute("height", "15");
            svg.setAttribute("viewBox", "0 0 56 56");
            svg.setAttribute("fill", "none");
            svg.setAttribute("xmlns", svgNS);

            const path1 = document.createElementNS(svgNS, "path");
            path1.setAttribute("d", "M28 20V29.8462L34 36");
            path1.setAttribute("stroke", "rgba(0, 0, 0, .45)");
            path1.setAttribute("stroke-width", "2.112");
            path1.setAttribute("stroke-linecap", "round");
            path1.setAttribute("stroke-linejoin", "round");

            const path2 = document.createElementNS(svgNS, "path");
            path2.setAttribute("d", "M1 27.6667C1 15.0959 1 8.81048 4.90525 4.90525C8.81048 1 15.0959 1 27.6667 1C40.2373 1 46.5229 1 50.428 4.90525C54.3333 8.81048 54.3333 15.0959 54.3333 27.6667C54.3333 40.2373 54.3333 46.5229 50.428 50.428C46.5229 54.3333 40.2373 54.3333 27.6667 54.3333C15.0959 54.3333 8.81048 54.3333 4.90525 50.428C1 46.5229 1 40.2373 1 27.6667Z");
            path2.setAttribute("stroke", "rgba(0, 0, 0, .45)");
            path2.setAttribute("stroke-width", "2");

            svg.appendChild(path1);
            svg.appendChild(path2);
            tickDiv.appendChild(svg)

            messageDiv.classList.add('sent');
            metadataDiv.appendChild(timeSpan);
            metadataDiv.appendChild(tickDiv);
            messageDiv.appendChild(p);
            messageDiv.appendChild(metadataDiv);

            field.insertBefore(messageDiv, field.firstChild);
        });

    }
}

async function appendSvgToTickDiv(tickDiv, status) {
    function createSvg(width, height, viewBox, paths) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', viewBox);
        svg.setAttribute('fill', 'none');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        paths.forEach(d => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d.d);
            if (d.stroke) path.setAttribute('stroke', d.stroke);
            if (d.strokeWidth) path.setAttribute('stroke-width', d.strokeWidth);
            if (d.strokeLinecap) path.setAttribute('stroke-linecap', d.strokeLinecap);
            if (d.strokeLinejoin) path.setAttribute('stroke-linejoin', d.strokeLinejoin);
            if (d.fill) path.setAttribute('fill', d.fill);
            svg.appendChild(path);
        });

        return svg;
    }

    tickDiv.innerHTML = '';

    if (status === 'sent') {
        const svg = createSvg('15', '12', '0 0 20 16', [{
            d: 'M1.78125 9.28125L6.46875 13.9688L17.7188 1.78125',
            stroke: 'rgba(0, 0, 0, .45)',
            strokeWidth: '2.8125',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
        }]);
        tickDiv.appendChild(svg);
    } else if (status === 'delivered') {
        const svg1 = createSvg('18', '18', '0 0 26 16', [
            {
                d: 'M2.21875 9.5L6.90625 14.1875L18.1562 2',
                stroke: 'rgba(0, 0, 0, .45)',
                strokeWidth: '2.8125',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
            },
            {
                d: 'M13.2131 12.5056L12.2188 11.5113L10.23 13.5L11.2244 14.4944L13.2131 12.5056ZM12.9062 14.1875L11.9119 15.1819C12.1825 15.4525 12.5517 15.6011 12.9344 15.5935C13.317 15.5858 13.68 15.4225 13.9396 15.1413L12.9062 14.1875ZM25.1896 2.95383C25.7164 2.38315 25.6808 1.49347 25.1101 0.966683C24.5394 0.439896 23.6497 0.475483 23.1229 1.04617L25.1896 2.95383ZM11.2244 14.4944L11.9119 15.1819L13.9006 13.1931L13.2131 12.5056L11.2244 14.4944ZM13.9396 15.1413L25.1896 2.95383L23.1229 1.04617L11.8729 13.2337L13.9396 15.1413Z',
                fill: 'rgba(0, 0, 0, .45)'
            }
        ]);
        tickDiv.appendChild(svg1);
    } else if (status === 'read') {
        const svg2 = createSvg('18', '18', '0 0 26 16', [
            {
                d: 'M2.21875 9.5L6.90625 14.1875L18.1562 2',
                stroke: 'black',
                strokeWidth: '2.8125',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
            },
            {
                d: 'M13.2131 12.5056L12.2188 11.5113L10.23 13.5L11.2244 14.4944L13.2131 12.5056ZM12.9062 14.1875L11.9119 15.1819C12.1825 15.4525 12.5517 15.6011 12.9344 15.5935C13.317 15.5858 13.68 15.4225 13.9396 15.1413L12.9062 14.1875ZM25.1896 2.95383C25.7164 2.38315 25.6808 1.49347 25.1101 0.966683C24.5394 0.439896 23.6497 0.475483 23.1229 1.04617L25.1896 2.95383ZM11.2244 14.4944L11.9119 15.1819L13.9006 13.1931L13.2131 12.5056L11.2244 14.4944ZM13.9396 15.1413L25.1896 2.95383L23.1229 1.04617L11.8729 13.2337L13.9396 15.1413Z',
                fill: 'black'
            }
        ]);
        tickDiv.appendChild(svg2);
    }
}

async function populatereceivedmessage(data) {
    const message = data.newmessage

    const chatList1 = document.getElementById('chat-list1');
    const activeCard1 = chatList1.querySelector('.active-card');

    let activeuserid1
    if (activeCard1) {
        activeuserid1 = activeCard1.getAttribute('data-userid')
    }

    const chatlist2 = document.getElementById('chat-list2')
    const activeCard2 = chatlist2.querySelector('.active-card')

    let activeuserid2
    if (activeCard2) {
        activeuserid2 = activeCard2.getAttribute('data-userid')
    }

    if (activeuserid1 && activeuserid2 && activeuserid1 == activeuserid2 && activeuserid1 == message.sender) {
        const chatMessageFields = document.querySelectorAll('.chat-message-field');

        chatMessageFields.forEach(function (field) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.setAttribute('data-messageid', message.messageid)
            messageDiv.classList.add('received');

            const p = document.createElement('p');
            p.textContent = message.message;

            const metadataDiv = document.createElement('div');
            metadataDiv.className = 'metadata';

            const timeSpan = document.createElement('span');
            timeSpan.className = 'time';
            timeSpan.textContent = formatTimestamp12HourLocal(message.timestamp);

            metadataDiv.appendChild(timeSpan);
            messageDiv.appendChild(p);
            messageDiv.appendChild(metadataDiv);
            field.insertBefore(messageDiv, field.firstChild);
        });

        emitreadedmessage(message.messageid)
    }
}

async function markMessagesAsRead(userid) {
    const chatList1 = document.getElementById('chat-list1');
    const activeCard1 = chatList1.querySelector('.active-card');

    let activeuserid1
    if (activeCard1) {
        activeuserid1 = activeCard1.getAttribute('data-userid');
    }

    const chatlist2 = document.getElementById('chat-list2');
    const activeCard2 = chatlist2.querySelector('.active-card');

    let activeuserid2
    if (activeCard2) {
        activeuserid2 = activeCard2.getAttribute('data-userid');
    }

    if (activeuserid1 && activeuserid2 && activeuserid1 == activeuserid2 && activeuserid1 == userid) {
        const sentMessages = document.querySelectorAll('.sent');

        sentMessages.forEach(function (message) {
            const existingTick = message.querySelector('.tick');
            if (existingTick) {
                const svg = existingTick.querySelector('svg');
                if (svg) {
                    svg.remove();
                }

                appendSvgToTickDiv(existingTick, 'read');
            }
        });
    }
}

async function markamessageasread(messageid) {
    const messages = document.querySelectorAll(`[data-messageid="${messageid}"]`);
    if (messages.length > 0) {
        processMessages(messages);
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            const newMessages = document.querySelectorAll(`[data-messageid="${messageid}"]`);
            if (newMessages.length > 0) {
                processMessages(newMessages);
                obs.disconnect();
            }
        });

        const messageContainer = document.querySelector('.chat-message-field');
        observer.observe(messageContainer, {
            childList: true,
            subtree: true
        });
    }
}

function processMessages(messages) {
    messages.forEach(function (message) {
        const existingTick = message.querySelector('.tick');
        if (existingTick) {
            const svg = existingTick.querySelector('svg');
            if (svg) {
                svg.remove();
            }
            appendSvgToTickDiv(existingTick, 'read');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const chatMessageField = document.getElementById('chat-message-field1');

    chatMessageField.addEventListener('scroll', async function () {
        const scrollTop = chatMessageField.scrollTop;
        const containerHeight = chatMessageField.scrollHeight - chatMessageField.offsetHeight;

        let positiveNumber = Math.abs(scrollTop);
        let roundedNumber = Math.round(positiveNumber);

        if (roundedNumber >= (containerHeight - 5) && shouldLoadMoreMessages) {
            const lastChild = chatMessageField.lastElementChild
            const messageId = lastChild.getAttribute('data-messageid');
            shouldLoadMoreMessages = false;
            await loadMoreMessages(messageId);
            shouldLoadMoreMessages = true
        }
    });
});

async function loadMoreMessages(messageId) {
    const chatList1 = document.getElementById('chat-list1');
    const activeCard1 = chatList1.querySelector('.active-card');

    let activeuserid1;
    if (activeCard1) {
        activeuserid1 = activeCard1.getAttribute('data-userid');
    }

    const chatlist2 = document.getElementById('chat-list2');
    const activeCard2 = chatlist2.querySelector('.active-card');

    let activeuserid2;
    if (activeCard2) {
        activeuserid2 = activeCard2.getAttribute('data-userid');
    }

    if (activeuserid1 && activeuserid2 && activeuserid1 === activeuserid2) {
        const data = {
            messageId: messageId,
            req_id: activeuserid1
        };

        const messages = await fetchmorechatdata(data);

        if (messages.length > 0) {
            appendMessagesToChat(messages,activeuserid1);
        }

    }
}

async function fetchmorechatdata(data) {
    try {
        const response = await fetch('/getmoremessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        
        return result.Messages || [];

    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function appendMessagesToChat(data, userId) {
    const chatList1 = document.getElementById('chat-list1');
    const activeCard1 = chatList1.querySelector('.active-card');

    let activeuserid1
    if (activeCard1) {
        activeuserid1 = activeCard1.getAttribute('data-userid');
    }

    const chatlist2 = document.getElementById('chat-list2');
    const activeCard2 = chatlist2.querySelector('.active-card');

    let activeuserid2
    if (activeCard2) {
        activeuserid2 = activeCard2.getAttribute('data-userid');
    }

    if (activeuserid1 && activeuserid2 && activeuserid1 == activeuserid2 && activeuserid1 == userId) {
        const messages = data;
        const chatMessageFields = document.querySelectorAll('.chat-message-field');

        chatMessageFields.forEach(function (field) {
            messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                messageDiv.setAttribute('data-messageid', message._id);

                const p = document.createElement('p');
                p.textContent = message.text;

                const metadataDiv = document.createElement('div');
                metadataDiv.className = 'metadata';

                const timeSpan = document.createElement('span');
                timeSpan.className = 'time';
                timeSpan.textContent = formatTimestamp12HourLocal(message.timestamp);

                const tickDiv = document.createElement('div');
                tickDiv.className = 'tick';

                function createSvg(width, height, viewBox, paths) {
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('width', width);
                    svg.setAttribute('height', height);
                    svg.setAttribute('viewBox', viewBox);
                    svg.setAttribute('fill', 'none');
                    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                    paths.forEach(d => {
                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', d.d);
                        if (d.stroke) path.setAttribute('stroke', d.stroke);
                        if (d.strokeWidth) path.setAttribute('stroke-width', d.strokeWidth);
                        if (d.strokeLinecap) path.setAttribute('stroke-linecap', d.strokeLinecap);
                        if (d.strokeLinejoin) path.setAttribute('stroke-linejoin', d.strokeLinejoin);
                        if (d.fill) path.setAttribute('fill', d.fill);
                        svg.appendChild(path);
                    });

                    return svg;
                }

                if (message.status === 'sent' || message.status === 'delivered' || message.status === 'read') {
                    if (message.sender !== userId) {
                        if (message.status === 'sent') {
                            const svg = createSvg('15', '12', '0 0 20 16', [{
                                d: 'M1.78125 9.28125L6.46875 13.9688L17.7188 1.78125',
                                stroke: 'rgba(0, 0, 0, .45)',
                                strokeWidth: '2.8125',
                                strokeLinecap: 'round',
                                strokeLinejoin: 'round'
                            }]);
                            tickDiv.appendChild(svg);
                        } else if (message.status === 'delivered') {
                            const svg = createSvg('18', '18', '0 0 26 16', [
                                {
                                    d: 'M2.21875 9.5L6.90625 14.1875L18.1562 2',
                                    stroke: 'rgba(0, 0, 0, .45)',
                                    strokeWidth: '2.8125',
                                    strokeLinecap: 'round',
                                    strokeLinejoin: 'round'
                                },
                                {
                                    d: 'M13.2131 12.5056L12.2188 11.5113L10.23 13.5L11.2244 14.4944L13.2131 12.5056ZM12.9062 14.1875L11.9119 15.1819C12.1825 15.4525 12.5517 15.6011 12.9344 15.5935C13.317 15.5858 13.68 15.4225 13.9396 15.1413L12.9062 14.1875ZM25.1896 2.95383C25.7164 2.38315 25.6808 1.49347 25.1101 0.966683C24.5394 0.439896 23.6497 0.475483 23.1229 1.04617L25.1896 2.95383ZM11.2244 14.4944L11.9119 15.1819L13.9006 13.1931L13.2131 12.5056L11.2244 14.4944ZM13.9396 15.1413L25.1896 2.95383L23.1229 1.04617L11.8729 13.2337L13.9396 15.1413Z',
                                    fill: 'rgba(0, 0, 0, .45)'
                                }
                            ]);
                            tickDiv.appendChild(svg);
                        } else if (message.status === 'read') {
                            const svg = createSvg('18', '18', '0 0 26 16', [
                                {
                                    d: 'M2.21875 9.5L6.90625 14.1875L18.1562 2',
                                    stroke: 'black',
                                    strokeWidth: '2.8125',
                                    strokeLinecap: 'round',
                                    strokeLinejoin: 'round'
                                },
                                {
                                    d: 'M13.2131 12.5056L12.2188 11.5113L10.23 13.5L11.2244 14.4944L13.2131 12.5056ZM12.9062 14.1875L11.9119 15.1819C12.1825 15.4525 12.5517 15.6011 12.9344 15.5935C13.317 15.5858 13.68 15.4225 13.9396 15.1413L12.9062 14.1875ZM25.1896 2.95383C25.7164 2.38315 25.6808 1.49347 25.1101 0.966683C24.5394 0.439896 23.6497 0.475483 23.1229 1.04617L25.1896 2.95383ZM11.2244 14.4944L11.9119 15.1819L13.9006 13.1931L13.2131 12.5056L11.2244 14.4944ZM13.9396 15.1413L25.1896 2.95383L23.1229 1.04617L11.8729 13.2337L13.9396 15.1413Z',
                                    fill: 'black'
                                }
                            ]);
                            tickDiv.appendChild(svg);
                        }
                    }
                }

                if (message.sender === userId) {
                    messageDiv.classList.add('received');
                } else {
                    messageDiv.classList.add('sent');
                }

                metadataDiv.appendChild(timeSpan);
                metadataDiv.appendChild(tickDiv);
                messageDiv.appendChild(p);
                messageDiv.appendChild(metadataDiv);
                field.appendChild(messageDiv);
            });
        });
    }
}

async function addLoader() {
    const messageField = document.querySelectorAll('.chat-message-field');
    
    messageField.forEach(function(field) {
        const loader = document.createElement('div');
        loader.classList.add('message-loader-container');
        
        const load = document.createElement('div')
        load.classList.add('message-loader')

        loader.appendChild(load)
        field.appendChild(loader);
    });
}

async function removeMessageLoader() {
    const loaderContainers = document.querySelectorAll('.message-loader-container');
    
    loaderContainers.forEach(function(container) {
        container.remove();
    });
}