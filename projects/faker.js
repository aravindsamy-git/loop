const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { UserProfile } = require("./public/js/db");
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

// Function to convert image to Base64
const imageToBase64 = (filePath) => {
    const image = fs.readFileSync(filePath);
    return `data:image/${path.extname(filePath).substring(1)};base64,${image.toString('base64')}`;
};

const usedPhoneNumbers = new Set(); // Set to track used phone numbers

const generatePhoneNumber = () => {
    let phoneNumber;
    do {
        // Ensure the phone number starts with 9
        const startDigit = '9';
        const remainingDigits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
        phoneNumber = startDigit + remainingDigits;
    } while (usedPhoneNumbers.has(phoneNumber)); // Check if phone number is already used

    usedPhoneNumbers.add(phoneNumber); // Add new phone number to the set
    return phoneNumber;
};

// Load photos from a folder
const loadPhotosFromFolder = (folderPath) => {
    const photoFiles = fs.readdirSync(folderPath);
    return photoFiles.map(file => {
        const filePath = path.join(folderPath, file);
        return {
            data: imageToBase64(filePath),
            count: 5
        };
    });
};

// Load names from CSV file
const loadNamesFromCSV = (csvPath) => {
    return new Promise((resolve, reject) => {
        const names = [];
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (data) => names.push(data))
            .on('end', () => resolve(names))
            .on('error', (err) => reject(err));
    });
};

const interestsList = [
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

const interestedInOptions = ['Male', 'Female', 'Everyone'];
const lookingForOptions = ['Casual Dating', 'Serious Relationship', 'Friendship', 'Activity Partners', 'Open to Possibilities', 'Not Sure yet'];
const sexualOrientations = ['Aromantic', 'Bicurious', 'Queer', 'Pansexual', 'Demisexual', 'Asexual', 'Bisexual', 'Lesbian', 'Gay', 'Straight'];

// MongoDB connection
mongoose.connect('mongodb+srv://Aravind:loop-social-pass@cluster0.swesybz.mongodb.net/loop-main?retryWrites=true&w=majority&appName=Cluster0');

const generateFakeUser = async (numUsers, names, photos) => {
    for (let i = 0; i < numUsers; i++) {
        const password = faker.internet.password();
        const hashedPassword = await bcrypt.hash(password, 10);
        const randomInterests = faker.helpers.shuffle(interestsList).slice(0, 5);

        const randomPhoto = photos[i % photos.length];

        const nameParts = names[i].name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        const newUser = new UserProfile({
            _id: new mongoose.Types.ObjectId(),
            phoneNumber: generatePhoneNumber(),
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: faker.date.past({ years: 30, refDate: new Date(2000, 0, 1) }),
            gender: 'Female',
            currentlyIm: faker.lorem.sentence(),
            interestedIn: faker.helpers.arrayElement(interestedInOptions),
            lookingFor: faker.helpers.arrayElement(lookingForOptions),
            sexualOrientation: faker.helpers.arrayElements(sexualOrientations, { min: 1, max: 3 }).join(', '),
            interests: randomInterests.join(', '),
            photos: [randomPhoto],
            bio: faker.lorem.paragraph()
        });

        await newUser.save();
        console.log(`User ${i + 1} created: ${newUser.firstName} ${newUser.lastName}`);
    }
    mongoose.connection.close();
    console.log(`All ${numUsers} users created successfully.`);
};

const folderPath = './LOOPS Models';
const photos = loadPhotosFromFolder(folderPath);
const csvPath = './Indian-Female-Names.csv';

loadNamesFromCSV(csvPath).then(names => {
    const numberOfPhotos = photos.length;
    const numberOfNames = names.length;
    const numUsers = Math.min(numberOfPhotos, numberOfNames);

    generateFakeUser(numUsers, names, photos);
}).catch(err => {
    console.error('Error loading names from CSV:', err);
});
