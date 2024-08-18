document.addEventListener('DOMContentLoaded', function () {
    showLoader();
})

function showLoader() {
    document.getElementById("loader").style.display = "flex";
    document.body.style.overflow = 'hidden'
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
    document.body.style.overflowY = 'auto'
}


window.addEventListener('load', () => {
    hideLoader();
});


function showError(message) {
    var errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    var errorContainer = document.getElementById('error-container');
    errorContainer.style.display = 'block';
    errorContainer.style.right = 5 + "px"

    setTimeout(function () {
        hideError();
    }, 5000);
}

function hideError() {
    var errorContainer = document.getElementById('error-container');
    errorContainer.style.right = '-350px';
    errorContainer.style.display = 'none';
}

document.getElementById('close-error-btn').addEventListener('click', function () {
    hideError();
});

function validateDateOfBirth(inputValue) {
    const dob = new Date(inputValue);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    const dobInput = document.getElementById('date-of-birth-input');

    if (age < 18) {
        showError("You must be at least 18 years old");
        dobInput.value = "";
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const genderoption = document.getElementById("gender-selector")
    const dropdowngender = document.getElementById("gender-option")
    var computedStyle = window.getComputedStyle(dropdowngender);

    genderoption.addEventListener("click", function () {

        if (computedStyle.display === "flex") {
            dropdowngender.style.display = "none"
        } else {
            dropdowngender.style.display = "flex"
        }
    })

    function hideDropdown() {
        dropdowngender.style.display = "none";
    }

    document.getElementById("male").addEventListener("click", function () {
        genderoption.value = "Male";
        dropdowngender.style.display = "none";
    });
    document.getElementById("female").addEventListener("click", function () {
        genderoption.value = "Female";
        dropdowngender.style.display = "none";
    });
    document.getElementById("ntm").addEventListener("click", function () {
        genderoption.value = "Not to mention";
        dropdowngender.style.display = "none";
    });

    document.addEventListener("click", function (event) {
        const targetElement = event.target;
        if (!targetElement.closest(".gender")) {
            hideDropdown();
        }
    });
})

document.addEventListener("DOMContentLoaded", function () {
    const interestedoption = document.getElementById("interested-selector");
    const dropdowninterested = document.getElementById("interested-option");

    interestedoption.addEventListener("click", function () {
        var computedStyleinterested = window.getComputedStyle(dropdowninterested);
        if (computedStyleinterested.display === "flex") {
            dropdowninterested.style.display = "none";
        } else {
            dropdowninterested.style.display = "flex";
        }
    });

    function hideDropdowninterested() {
        dropdowninterested.style.display = "none";
    }

    document.getElementById("imale").addEventListener("click", function () {
        interestedoption.value = "Male";
        dropdowninterested.style.display = "none";
    });
    document.getElementById("ifemale").addEventListener("click", function () {
        interestedoption.value = "Female";
        dropdowninterested.style.display = "none";
    });
    document.getElementById("everyone").addEventListener("click", function () {
        interestedoption.value = "Everyone";
        dropdowninterested.style.display = "none";
    });

    document.addEventListener("click", function (event) {
        const targetElement = event.target;
        if (!targetElement.closest(".interested-in")) {
            hideDropdowninterested();
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const lookingfortrigger = document.getElementById("lookingfor-popup-trigger");
    const lookingforpopup = document.getElementById("lookingfor-popup");
    const lfOptions = document.querySelectorAll(".lf-option");
    const saveButton = document.querySelector(".lf-button");
    const selectedValuePlace = document.getElementById("selected-value-looking-for");

    let selectedOption = null;

    lookingfortrigger.addEventListener("click", function () {
        lookingforpopup.style.display = "flex";
        document.body.style.overflow = "hidden";
    });

    lfOptions.forEach(option => {
        option.addEventListener("click", function () {
            if (option === selectedOption) {
                option.classList.remove('selected');
                option.querySelector('p').classList.remove('selected-text');
                selectedOption = null;
                selectedValuePlace.textContent = '';
            } else {
                if (selectedOption !== null) {
                    selectedOption.classList.remove('selected');
                    selectedOption.querySelector('p').classList.remove('selected-text');
                }
                option.classList.add('selected');
                option.querySelector('p').classList.add('selected-text');
                selectedOption = option;
                const selectedValue = selectedOption.textContent.trim();
                selectedValuePlace.textContent = selectedValue;
            }
        });
    });

    document.addEventListener("click", function (event) {
        if (event.target === lookingforpopup) {
            lookingforpopup.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    saveButton.addEventListener("click", function () {
        lookingforpopup.style.display = "none";
        document.body.style.overflow = "auto";
    });

});

document.addEventListener("DOMContentLoaded", function () {
    const sotrigger = document.getElementById("sexorientation-popup-trigger");
    const sopopup = document.getElementById("sexorientation-popup");
    const soOptions = document.querySelectorAll(".so-option");
    const saveButtonso = document.querySelector(".so-button");
    const selectedValuePlaceso = document.getElementById("selected-value-sex-orientation");

    let selectedOptions = [];

    sotrigger.addEventListener("click", function () {
        sopopup.style.display = "flex";
        document.body.style.overflow = "hidden";
    });

    soOptions.forEach(option => {
        option.addEventListener("click", function () {
            const selectedValue = option.textContent.trim();
            if (selectedOptions.includes(selectedValue)) {
                option.classList.remove('selected');
                option.querySelector('p').classList.remove('selected-text');
                selectedOptions = selectedOptions.filter(value => value !== selectedValue);
            } else if (selectedOptions.length < 3) {
                option.classList.add('selected');
                option.querySelector('p').classList.add('selected-text');
                selectedOptions.push(selectedValue);
            }
            selectedValuePlaceso.textContent = selectedOptions.join(', ');
        });
    });

    document.addEventListener("click", function (event) {
        if (event.target === sopopup) {
            sopopup.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    saveButtonso.addEventListener("click", function () {
        sopopup.style.display = "none";
        document.body.style.overflow = "auto";
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const items = [
        "90s Kid", "Harry Potter", "SoundCloud", "Spa", "Self Care", "Heavy Metal", "House Parties", "Gin tonic", "Gymnastics", "Ludo", "Maggi", "Hot Yoga", "Biryani", "Meditation", "Sushi", "Spotify",
        "Hockey", "Basketball", "Slam Poetry", "Home Workout", "Theater", "Cafe hopping", "Sneakers", "Aquarium", "Instagram",
        "Hot Springs", "Walking", "Running", "Travel", "Language Exchange", "Movies", "Guitarists", "Social Development", "Gym",
        "Social Media", "Hip Hop", "Skincare", "J-Pop", "Cricket", "Shisha", "Freelance", "K-Pop", "Skateboarding", "Gospel",
        "Potterhead", "Trying New Things", "Photography", "Bollywood", "Bhangra", "Reading", "Singing", "Sports", "Poetry",
        "Stand up Comedy", "Coffee", "Karaoke", "Fortnite", "Free Diving", "Self Development", "Mental Health Awareness",
        "Foodie Tour", "Voter Rights", "Jiu-jitsu", "Climate Change", "Exhibition", "Walking My Dog", "LGBTQIA+ Rights",
        "Feminism", "VR Room", "Escape Cafe", "Shopping", "Brunch", "Investment", "Jetski", "Reggaeton", "Second-hand apparel",
        "Black Lives Matter", "Jogging", "Road Trips", "Vintage fashion", "Voguing", "Couchsurfing", "Happy hour", "Inclusivity",
        "Country Music", "Football", "Inline Skate", "Investing", "Tennis", "Ice Cream", "Ice Skating", "Human Rights", "Expositions",
        "Pig Roast", "Skiing", "Canoeing", "West End Musicals", "Snowboarding", "Pilates", "Pentathlon", "Broadway", "PlayStation",
        "Cheerleading", "Choir", "Pole Dancing", "Five-a-side Football", "Car Racing", "Pinterest", "Festivals", "Pub Quiz",
        "Catan", "Cosplay", "Motor Sports", "Coffee Stall", "Content Creation", "E-Sports", "Bicycle Racing", "Binge-Watching TV shows",
        "Songwriter", "Bodycombat", "Tattoos", "Painting", "Bodyjam", "Paddle Boarding", "Padel", "Blackpink", "Surfing", "Bowling",
        "Grime", "90s Britpop", "Bodypump", "Beach Bars", "Bodystep", "Paragliding", "Upcycling", "Equality", "Astrology", "Motorcycles",
        "Equestrian", "Entrepreneurship", "Sake", "BTS", "Cooking", "Environmental Protection", "Fencing", "Soccer", "Saxophonist",
        "Sci-Fi", "Dancing", "Film Festival", "Freeletics", "Gardening", "Amateur Cook", "Exchange Program", "Sauna", "Art",
        "Politics", "Flamenco", "Museum", "Activism", "DAOs", "Real Estate", "Podcasts", "Disability Rights", "Rave", "Pimms",
        "Drive Thru Cinema", "Rock Climbing", "BBQ", "Craft Beer", "Iced Tea", "Drummer", "Tea", "Board Games", "Roblox", "Pubs",
        "Rock", "Tango", "Drawing", "Trivia", "Pho", "Volunteering", "Environmentalism", "Rollerskating", "Wine", "Dungeons & Dragons",
        "Vlogging", "Electronic Music", "Ramen", "Weightlifting", "Live Music", "Writing", "Xbox", "World Peace", "Wrestling",
        "Literature", "Manga", "Pride", "Marathon", "Makeup", "Youth Empowerment", "YouTube", "Martial Arts", "Marvel", "Vegan Cooking",
        "Vermut", "Korean Food", "Twitter", "Volleyball", "Walking Tour", "Vinyasa", "Virtual Reality", "League of Legends", "NFTs",
        "Bar Hopping", "Nintendo", "Baseball", "Parties", "Ballet", "Band", "Online Games", "Battle Ground", "Beach Tennis", "Nightlife",
        "Online Shopping", "Sailing", "Olympic Gymnastics", "Bassist", "Online Broker", "Military", "Memes", "Among Us", "Motorbike Racing",
        "Muay Thai", "Motorcycling", "Metaverse", "Mindfulness", "Acapella", "Musical Instrument", "Art galleries", "Musical Writing",
        "Hiking", "Artistic Gymnastics", "Mountains", "Archery", "Atari", "Backpacking", "Fishing", "Clubbing", "Street Food", "Crossfit",
        "Concerts", "Climbing", "Baking", "Camping", "Blogging", "Collecting", "Cars", "Start ups", "Boba tea", "High School Sports",
        "Badminton", "Active Lifestyle", "Fashion", "Anime", "NBA", "MLB", "Funk music", "Caipirinha", "Indoor Activities", "Tempeh",
        "DIY", "Town Festivities", "Cycling", "Outdoors", "TikTok", "Picnicking", "Twitch", "Comedy", "Trap Music", "Music", "Triathlon",
        "Netflix", "Disney", "Rugby", "Açaí", "Samba", "Tarot", "Stock Exchange", "Stocks", "Swimming", "Table Tennis", "Killing time",
        "Working out", "Yoga", "Horror Movies", "Boxing", "Bar Chilling"
    ];

    const iOptionsContainer = document.querySelector(".i-options");

    items.forEach(item => {
        const option = document.createElement("div");
        option.classList.add("i-option");
        const paragraph = document.createElement("p");
        paragraph.textContent = item;
        option.appendChild(paragraph);
        iOptionsContainer.appendChild(option);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const itrigger = document.getElementById("insterest-popup-trigger");
    const ipopup = document.getElementById("interests-popup");
    const iOptions = document.querySelectorAll(".i-option");
    const saveButtoni = document.querySelector(".i-button");
    const selectedValuePlacei = document.getElementById("selected-insterest-value");

    let selectedOptioni = [];

    itrigger.addEventListener("click", function () {
        ipopup.style.display = "flex";
        document.body.style.overflow = "hidden";
    });

    iOptions.forEach(option => {
        option.addEventListener("click", function () {
            const selectedValuei = option.textContent.trim();
            if (selectedOptioni.includes(selectedValuei)) {
                option.querySelector('p').classList.remove('selected-text');
                selectedOptioni = selectedOptioni.filter(value => value !== selectedValuei);
            } else if (selectedOptioni.length < 5) {
                option.querySelector('p').classList.add('selected-text');
                selectedOptioni.push(selectedValuei);
            }
            selectedValuePlacei.textContent = selectedOptioni.join(', ');
        });
    });

    document.addEventListener("click", function (event) {
        if (event.target === ipopup) {
            ipopup.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });

    saveButtoni.addEventListener("click", function () {
        ipopup.style.display = "none";
        document.body.style.overflow = "auto";
    });
});


document.addEventListener('DOMContentLoaded', function () {
    fetch('/userprofiles', {
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
            localStorage.setItem('id', data.id)
            updateuserdata(data)
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

    async function updateuserdata(user) {
        document.getElementById("first-name-input").value = user.firstName;
        document.getElementById("last-name-input").value = user.lastName;
        document.getElementById("date-of-birth-input").value = extractDateComponents(user.dateOfBirth);
        document.getElementById("gender-selector").value = user.gender;
        document.getElementById("currently-im").value = user.currentlyIm;
        document.getElementById("interested-selector").value = user.interestedIn;
        document.getElementById("selected-value-looking-for").textContent = user.lookingFor;
        document.getElementById("selected-value-sex-orientation").textContent = user.sexualOrientation;
        document.getElementById("selected-insterest-value").textContent = user.interests;
        document.getElementById("bioarea").value = user.bio;
        setImages(user.photos)
    }

    function extractDateComponents(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
    }

    function setImages(photoData) {
        let imageCounter = 1;

        photoData.forEach(photo => {
            for (let i = 0; i < photo.count; i++) {
                if (imageCounter <= 5) {
                    const imgElement = document.getElementById(`image${imageCounter}`);
                    if (imgElement) {
                        imgElement.src = photo.data;
                        imageCounter++;
                    }
                }
            }
        });
    }

    const save = document.getElementById('continue-btn');

    save.addEventListener('click', function () {

        const firstName = document.getElementById("first-name-input").value.trim();
        const lastName = document.getElementById("last-name-input").value.trim();
        const dateOfBirth = document.getElementById("date-of-birth-input").value.trim();
        const gender = document.getElementById("gender-selector").value.trim();
        const currentlyIm = document.getElementById("currently-im").value.trim();
        const interestedIn = document.getElementById("interested-selector").value.trim();
        const lookingFor = document.getElementById("selected-value-looking-for").textContent.trim();
        const sexualOrientation = document.getElementById("selected-value-sex-orientation").textContent.trim();
        const interests = document.getElementById("selected-insterest-value").textContent.trim();
        const bio = document.getElementById("bioarea").value.trim();

        if (!firstName || !lastName || !dateOfBirth || !gender || !currentlyIm || !interestedIn || !lookingFor || !sexualOrientation || !interests || !bio) {
            showError("Please fill in all the required fields.");
            return;
        }

        const imageSources = [
            document.getElementById('image1').src,
            document.getElementById('image2').src,
            document.getElementById('image3').src,
            document.getElementById('image4').src,
            document.getElementById('image5').src
        ];

        function areImagesEqual(imgSrc1, imgSrc2) {
            return imgSrc1 === imgSrc2;
        }

        const photos = [];

        imageSources.forEach((src, index) => {
            if (src) {
                let existingPhoto = photos.find(photo => areImagesEqual(photo.data, src));
                if (existingPhoto) {
                    existingPhoto.count++;
                } else {
                    photos.push({ data: src, count: 1 });
                }
            }
        });

        if (photos.length === 0) {
            showError("Please upload the photos");
            return;
        }

        const data = {
            id: localStorage.getItem('id'),
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            gender: gender,
            currentlyIm: currentlyIm,
            interestedIn: interestedIn,
            lookingFor: lookingFor,
            sexualOrientation: sexualOrientation,
            interests: interests,
            photos: photos,
            bio: bio
        };

        const compressedData = pako.deflate(JSON.stringify(data));
        const jsonString = JSON.stringify(Array.from(compressedData));

        fetch('/updateuserprofiledata', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonString
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Document updated successfully.") {
                    showError("Your profile has been updated successfully");
                } else {
                    showError('Failed to update your profile');
                }
            })
            .catch(error => {
                showError('Failed to update the your profile');
            });
    })
})

document.querySelectorAll('.overlay-image').forEach(overlay => {
    overlay.addEventListener('click', function () {
        const fileInput = this.querySelector('.file-input');
        fileInput.click();
    });

    const fileInput = overlay.querySelector('.file-input');
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];

            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPEG, PNG, or GIF).');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const profilePhoto = overlay.previousElementSibling;
                profilePhoto.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});
