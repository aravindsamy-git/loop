document.addEventListener('DOMContentLoaded', function () {

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
        document.querySelectorAll('.chat-usercard').forEach(function(card){
            card.classList.remove('active-card')
        })

        if (userCard) {
            userCard.classList.add('active-card')
            const userid = userCard.getAttribute('data-userid');
            const profileImgSrc = userCard.querySelector('.chat-userimg').src;
            const username = userCard.querySelector('.chat-username').textContent;
            document.getElementById('non-text-container').classList.add('active-none')
            document.getElementById('chat-list2').classList.add('active-none')
            document.querySelectorAll('.chat-overlay').forEach(function (element) {
                element.classList.add('active-grid')
            })
            updateVisibility();
            populateuserdata(userid, profileImgSrc, username)
            //getuserchat(userid)
        }
    });

    document.getElementById('chat-list2').addEventListener('click', (event) => {
        const userCard = event.target.closest('.chat-usercard');
        document.querySelectorAll('.chat-usercard').forEach(function(card){
            card.classList.remove('active-card')
        })

        if (userCard) {
            userCard.classList.add('active-card')
            const userid = userCard.getAttribute('data-userid');
            const profileImgSrc = userCard.querySelector('.chat-userimg').src;
            const username = userCard.querySelector('.chat-username').textContent;
            document.getElementById('non-text-container').classList.add('active-none')
            document.getElementById('chat-list2').classList.add('active-none')
            document.querySelectorAll('.chat-overlay').forEach(function (element) {
                element.classList.add('active-grid')
            })
            updateVisibility();
            populateuserdata(userid, profileImgSrc, username)
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
                    sendMessage(message)
                    textarea.value = '';
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
                    sendMessage(message)
                    textarea.value = '';
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
                    sendMessage(message)
                    textarea.value = '';
                }
            }
        }
    });

    async function sendMessage(message) {
        console.log(message)
    }

    async function getuserchat(userid) {

        fetch('/getuserchat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userid: userid })
        })
            .then(response => response.json())
            .then(data => {
                populateuserchat(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });

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
            element.classList.add('active-block')
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
            element.classList.remove('active-block');

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

        document.querySelectorAll('.chat-usercard').forEach(function(card){
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
        syncTextareas(desktopTextarea,tabTextarea)
    });

    mobileTextarea.addEventListener('input', function () {
        syncTextareas(mobileTextarea, desktopTextarea);
        syncTextareas(mobileTextarea,tabTextarea)
    });

    tabTextarea.addEventListener('input',function(){
        syncTextareas(tabTextarea,desktopTextarea)
        syncTextareas(tabTextarea,mobileTextarea)
    })
})