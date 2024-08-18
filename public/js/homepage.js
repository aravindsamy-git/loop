document.addEventListener("DOMContentLoaded", function () {
    function updateOptionHeight() {
        var screenHeight = window.innerHeight;
        if (screenHeight <= 560) {
            document.getElementById("option1").style.height = "7vh"
            document.getElementById("option2").style.height = "7vh"
            document.getElementById("option3").style.height = "7vh"
            document.getElementById("option4").style.height = "7vh"
            document.getElementById("option5").style.height = "7vh"
            document.getElementById("option6").style.height = "7vh"
            document.getElementById("option7").style.height = "7vh"
        }
    }
    updateOptionHeight();
    window.addEventListener("resize", updateOptionHeight);
});

function adjustLayout() {
    const viewportHeight = window.innerHeight;
    const headerHeight = 60;
    const footerHeight = 50;

    const contentHeight = viewportHeight - headerHeight - footerHeight;

    document.getElementById('chat-container-m').style.height = `${contentHeight}px`;
    document.querySelector('.middle-container').style.height = `${contentHeight}px`;
}

window.addEventListener('resize', adjustLayout);
window.addEventListener('load', adjustLayout);


document.addEventListener('DOMContentLoaded', function () {
    fetch('/getuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            updateuserdata(data)
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    function updateuserdata(data) {

        const userprofileimg = document.getElementById('userprofileimg')
        userprofileimg.src = data.photo.data;
        const username = document.getElementById('username')
        username.textContent = data.firstName + ' ' + data.lastName;
        
        const profilem = document.getElementById('profilem')
        profilem.src = data.photo.data

    }
});

function updateContentAndOptions(sectionId) {
    var sections = document.querySelectorAll('.sectiond');
    var options = document.querySelectorAll('.option');

    var sectionToOptionMap = {
        'section1': 'option1',
        'section2': 'option2',
        'section3': 'option3',
        'section4': 'option4'
    };

    sections.forEach(function (section) {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    options.forEach(function (option) {
        option.classList.remove('active');
    });

    var selectedOptionId = sectionToOptionMap[sectionId];
    var selectedOptions = document.querySelectorAll('#' + selectedOptionId);

    selectedOptions.forEach(function (selectedOption) {
        selectedOption.classList.add('active');
    });

    updateContainerPosition();
    synchronizesection(sectionId, "B")
}

updateContentAndOptions('section1');

function updateContentAndOptionsm(sectionId) {

    var sections = document.querySelectorAll('.sectionm')
    var menus = document.querySelectorAll('.menu')

    var sectionToMenunMap = {
        'sectionm1': 'menu1',
        'sectionm2': "menu2",
        'sectionm3': 'menu3',
        'sectionm4': 'menu4'
    }

    sections.forEach(function (section) {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    menus.forEach(function (menu) {
        menu.classList.remove('active');
    });

    var selectedOptionId = sectionToMenunMap[sectionId];
    var selectedOptions = document.querySelectorAll('#' + selectedOptionId);

    selectedOptions.forEach(function (selectedOption) {
        selectedOption.classList.add('active');
    });

    synchronizesection(sectionId, 'A')
}

updateContentAndOptionsm('sectionm3')

function synchronizesection(sectionid, option) {

    if (option == 'A') {
        var sectionmToSectionMap = {
            'sectionm1': 'section3',
            'sectionm2': "section2",
            'sectionm3': 'section1',
            'sectionm4': 'section4'
        }

        var sections = document.querySelectorAll('.sectiond');
        var options = document.querySelectorAll('.option');

        var sectionToOptionMap = {
            'section1': 'option1',
            'section2': 'option2',
            'section3': 'option3',
            'section4': 'option4'
        };

        sections.forEach(function (section) {
            if (section.id === sectionmToSectionMap[sectionid]) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        options.forEach(function (option) {
            option.classList.remove('active');
        });

        var selectedOptionId = sectionToOptionMap[sectionmToSectionMap[sectionid]];
        var selectedOptions = document.querySelectorAll('#' + selectedOptionId);

        selectedOptions.forEach(function (selectedOption) {
            selectedOption.classList.add('active');
        });

    }
    else {
        var sectionToSectionmMap = {
            'section1': 'sectionm3',
            'section2': "sectionm2",
            'section3': 'sectionm1',
            'section4': 'sectionm4'
        }

        var sections = document.querySelectorAll('.sectionm')
        var menus = document.querySelectorAll('.menu')

        var sectionToMenunMap = {
            'sectionm1': 'menu1',
            'sectionm2': "menu2",
            'sectionm3': 'menu3',
            'sectionm4': 'menu4'
        }

        sections.forEach(function (section) {
            if (section.id === sectionToSectionmMap[sectionid]) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        menus.forEach(function (menu) {
            menu.classList.remove('active');
        });

        var selectedOptionId = sectionToMenunMap[sectionToSectionmMap[sectionid]];
        var selectedOptions = document.querySelectorAll('#' + selectedOptionId);

        selectedOptions.forEach(function (selectedOption) {
            selectedOption.classList.add('active');
        });
    }
}

function calculateScreenWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

function updateContainerPosition() {
    const container = document.getElementById('swipe-imagecontainer');
    const containerWidth = container.offsetWidth;
    const leftoptions = document.getElementById('swipe-options')
    const leftoptionswidth = leftoptions.offsetWidth
    const leftcontainer = document.getElementById('left-container').offsetWidth
    const screenWidth = calculateScreenWidth();
    const position = (screenWidth / 2);


    const left = position - (containerWidth / 2.5)
    const lefto = position - (leftoptionswidth / 2.4)

    container.style.left = `${left - leftcontainer}px`;
    leftoptions.style.left = `${lefto - leftcontainer}px`
}

const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        updateContainerPosition();
    }
});

resizeObserver.observe(document.documentElement);

updateContainerPosition();

function handleuserdetails() {
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (screenWidth <= 750) {
        var userdetails = document.getElementById("userdetails")
        userdetails.style.display = "none"
    }
    if (screenWidth > 750) {
        var userdetails = document.getElementById("userdetails")
        userdetails.style.display = "flex"
    }
}

handleuserdetails()
window.addEventListener("resize", handleuserdetails)

document.addEventListener("DOMContentLoaded", function () {
    const option6 = document.getElementById("option6")
    const option5 = document.getElementById("option5")
    const menu5 = document.getElementById('menu5')

    option6.addEventListener('click', function () {
        window.location.href = '/premium';
    })

    option5.addEventListener('click', function () {
        window.location.href = '/profile'
    })

    menu5.addEventListener('click', function () {
        window.location.href = "/profile"
    })

    function activelogoutcontainer() {
        const otppopup = document.getElementById("logout-popup");
        otppopup.style.display = "flex";
    }

    function deactivatelogoutcontainer() {
        const otppopup = document.getElementById("logout-popup");
        otppopup.style.display = "none";
    }

    const logout = document.getElementById('option7')
    logout.addEventListener('click', function () {
        activelogoutcontainer()
    })

    const logoutbtn2 = document.getElementById('logout-btn2')
    logoutbtn2.addEventListener('click', function () {
        deactivatelogoutcontainer()
    })

    const logoutbtn1 = document.getElementById('logout-btn1')
    logoutbtn1.addEventListener('click', function () {
        logoutuser()
    })

    async function logoutuser() {

        const response = await fetch('/logoutuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        window.location.href = '/'
    }
})