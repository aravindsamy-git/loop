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

let fileCountImage = 0;
const maxFiles = 5;
const uploadedImages = {};
const progressBar = document.getElementById('progress-bar');
const progressLabel = document.getElementById('progress-label');

document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const files = event.target.files;
    let remainingFiles = maxFiles - fileCountImage;

    for (let i = 0; i < Math.min(files.length, remainingFiles); i++) {
        const file = files[i];
        if (file.type.match('image.*') && file.type !== 'image/svg+xml') {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageData = e.target.result;
                const img = new Image();
                img.src = imageData;
                
                img.onload = function() {
                    // Create a canvas to resize the image
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const MAX_WIDTH = 800; // Adjust as needed
                    const MAX_HEIGHT = 600; // Adjust as needed
                    let width = img.width;
                    let height = img.height;

                    // Calculate the new dimensions
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert canvas to base64
                    const compressedImageData = canvas.toDataURL('image/jpeg', 0.8); // Adjust quality as needed

                    let imageExists = false;
                    for (const key in uploadedImages) {
                        if (uploadedImages[key].data === compressedImageData) {
                            uploadedImages[key].count += 1;
                            imageExists = true;
                            break;
                        }
                    }

                    if (!imageExists) {
                        const newKey = `image_${Object.keys(uploadedImages).length + 1}`;
                        uploadedImages[newKey] = {
                            data: compressedImageData,
                            count: 1
                        };
                    }

                    fileCountImage++;
                    updateProgress();
                };
            };
            reader.readAsDataURL(file);
        } else {
            showError('You can only upload images.');
        }
    }

    if (remainingFiles < files.length) {
        alert('You can only upload a maximum of ' + maxFiles + ' images.');
    }

    event.target.value = '';
}

function updateProgress() {
    const percent = Math.min(100, (fileCountImage / maxFiles) * 100);
    progressBar.style.width = percent + '%';
    progressLabel.textContent = fileCountImage + '/' + maxFiles;
}

document.getElementById('continue-btn').addEventListener('click', function (event) {
    const urlParams = new URLSearchParams(window.location.search);
    const pn = urlParams.get('userNumber');

    const FirstName = document.getElementById("first-name-input").value.trim();
    const SecondName = document.getElementById("last-name-input").value.trim();
    const Dob = document.getElementById("date-of-birth-input").value.trim();
    const Gender = document.getElementById("gender-selector").value.trim();
    const CurrentlyIam = document.getElementById("currently-im").value.trim();
    const InterestedP = document.getElementById("interested-selector").value.trim();
    const LookingFor = document.getElementById("selected-value-looking-for").textContent.trim();
    const SexOrientation = document.getElementById("selected-value-sex-orientation").textContent.trim();
    const Interests = document.getElementById("selected-insterest-value").textContent.trim();
    const Images = uploadedImages;
    const Bio = document.getElementById("bioarea").value.trim();

    if (!FirstName || !SecondName || !Dob || !Gender || !CurrentlyIam || !InterestedP || !LookingFor || !Bio) {
        showError("Please fill out all fields!");
        return;
    }

    if (!SexOrientation) {
        showError("Please select at least one Sexual Orientation.");
        return;
    }

    const interestsArray = Interests.split(',').map(interest => interest.trim());
    if (interestsArray.length < 5) {
        showError("Please provide at least 5 interests.");
        return;
    }

    const imageCount = Object.keys(Images).length;
    if (imageCount !== 5) {
        showError("You need to upload 5 images.");
        return;
    }

    const data = {
        phoneNumber: pn,
        firstName: FirstName,
        lastName: SecondName,
        dateOfBirth: Dob,
        gender: Gender,
        currentlyIm: CurrentlyIam,
        interestedIn: InterestedP,
        lookingFor: LookingFor,
        sexualOrientation: SexOrientation,
        interests: Interests,
        photos: Images,
        bio: Bio
    };

    const compressedData = pako.deflate(JSON.stringify(data));
    const jsonString = JSON.stringify(Array.from(compressedData));

    fetch('/userprofiledata', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: jsonString
    })
        .then(async response => {
            if (response.ok) {
                window.location.href = '/home';
            } else {
                try {
                    const data = await response.json();
                    showError('Failed to store the details. Please try again');

                    setTimeout(function () {
                        window.location.href = '/'
                    }, 5000);
                } catch (e) {
                    showError('Failed to parse server response');
                    setTimeout(function () {
                        window.location.href = '/'
                    }, 5000);
                }
            }
        })
        .catch(error => {
            showError('Failed to store the details');
        });
});
