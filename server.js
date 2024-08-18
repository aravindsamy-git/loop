const express = require("express");
require("dotenv").config({ path: "loop.env" });
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const pako = require("pako");
const { UserProfile, Swipe, TemporaryUser, otpdata, otpVerify, Match, conversation, Message } = require("./public/js/db");
const cookieParser = require("cookie-parser");
const { spawn } = require("child_process");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const http = require("http");
const socketIo = require("socket.io");
const cookie = require("cookie");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

const server = http.createServer(app);
const io = socketIo(server);

const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const OTPAUTHKEY = process.env.OTPAUTHKEY

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        startLikeChangeStream();
        startMatchChangeStream();
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
});

io.use((socket, next) => {
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    const token = cookies.authToken;

    if (!token) {
        return next(new Error("Authentication error"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (err) {
        next(new Error("Authentication error"));
    }
});

const userSockets = {};

io.on("connection", (socket) => {
    userSockets[socket.userId] = socket;

    updateOnlineFriends(socket.userId);
    broadcastUserProfileToAll(socket.userId);
    fetchAndSendOnlineProfiles(socket);
    fetchOnlineFriends(socket.userId, socket);

    socket.on("sendmessage", async (data) => {
        const { receiverId, text , cmessageid } = data;
    
        try {
            const { Conversation, message } = await savedMessage(receiverId, text, socket.userId);
            let receiver;
            let sender

            if (message.sender === Conversation.userAId) {
                receiver = Conversation.userBId
                sender = Conversation.userAId
            } else {
                receiver = Conversation.userAId
                sender = Conversation.userBId
            }
    
            if (userSockets[receiverId]) {

                const newmessage = {
                    sender: sender,
                    message: message.text,
                    timestamp: message.timestamp,
                    messageid: message.id
                }

                userSockets[receiverId].emit("newmessage", {newmessage});
    
                await Message.updateOne(
                    { _id: message._id },
                    { $set: { status: 'delivered' } }
                );
    
                const updatedMessage = await Message.findById(message._id);
    
                const sentMessage = {
                    receiverId: receiver,
                    message: updatedMessage.text,
                    status: updatedMessage.status,
                    timestamp: updatedMessage.timestamp,
                    messageid: updatedMessage.id,
                    cmessageid: cmessageid
                };
    
                socket.emit("messagesended", { sentMessage });
            } else {
                const sentMessage = {
                    receiverId: receiver,
                    message: message.text,
                    status: message.status,
                    timestamp: message.timestamp,
                    messageid: message.id,
                    cmessageid: cmessageid
                };
    
                socket.emit("messagesended", { sentMessage });
            }
    
        } catch (err) {
            console.error("Error handling message:", err);
            socket.emit("error", "Failed to send message");
        }
    });

    socket.on('messagereaded', async (data) => {
        const { messageid } = data;

        try{
            await Message.updateOne(
                { _id: messageid },
                { $set: { status: 'read' } }
            );
            
            const updatedMessage = await Message.findById(messageid);

            if(userSockets[updatedMessage.sender]) {
                userSockets[updatedMessage.sender].emit("readmessage", {messageid});
            }
        }
        catch (error) {
            console.error("Error saving message:", error);
            throw error;
        }
    })

    socket.on("disconnect", () => {
        updateOnlineFriends(socket.userId);
        broadcastUserOffline(socket.userId);
        delete userSockets[socket.userId];
    });
});

async function savedMessage(receiverId, messageText, senderId) {
    try {
        let Conversation = await conversation.findOne({
            $or: [
                { userAId: senderId, userBId: receiverId },
                { userAId: receiverId, userBId: senderId }
            ]
        });

        if (!Conversation) {
            Conversation = new conversation({
                userAId: senderId,
                userBId: receiverId
            });
            await Conversation.save();
        }

        const message = new Message({
            conversationId: Conversation._id,
            sender: senderId,
            text: messageText,
            status: 'sent',
            timestamp: new Date()
        });

        await message.save();

        return {Conversation,message};

    } catch (error) {
        console.error("Error saving message:", error);
        throw error;
    }
}


const verifythetoken = async (req, res, next) => {
    const rememberMeToken = req.cookies.authToken;

    if (!rememberMeToken) {
        return res.redirect("/");
    }

    try {
        const decoded = jwt.verify(rememberMeToken, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await UserProfile.findById(userId);
        if (!user) {
            return res.redirect("/");
        }
        req.user = user;
        next();
    } catch (err) {
        console.error("Token verification failed:", err);

        if (err.name === "JsonWebTokenError") {
            return res.redirect("/");
        } else if (err.name === "TokenExpiredError") {
            return res.redirect("/");
        } else {
            return res.redirect("/");
        }
    }
};

const verifytheuser = async (req, res, next) => {
    const rememberMeToken = req.cookies.authToken;

    if (rememberMeToken) {
        const decoded = jwt.verify(rememberMeToken, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await UserProfile.findById(userId);
        if (!user) {
            next();
        }
        return res.redirect("/home");
    }

    next();
};

function generateToken(userid) {
    const token = jwt.sign(
        { id: userid },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return token;
};

app.get("/", verifytheuser, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "/main.html"));
});

app.get("/plans", verifytheuser, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "/plans.html"));
});

app.get("/policy", verifytheuser, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "/policy.html"));
});

app.get("/signup", verifytheuser, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "/register.html"));
});

app.get("/home", verifythetoken, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "homepage.html"));
});

app.post("/getuser", verifythetoken, (req, res) => {
    const user = req.user;
    const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        photo: user.photos[0],
    };

    res.json(userData);
});

app.post("/userprofiles", verifythetoken, (req, res) => {
    const data = req.user;

    const user = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        currentlyIm: data.currentlyIm,
        interestedIn: data.interestedIn,
        lookingFor: data.lookingFor,
        sexualOrientation: data.sexualOrientation,
        interests: data.interests,
        bio: data.bio,
        photos: data.photos,
    };

    res.json(user);
});

app.get("/login", verifytheuser, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "/login.html"));
});

app.get("/premium", verifythetoken, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "premium.html"));
});

app.get("/profile", verifythetoken, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "profile.html"));
});

app.get("/editprofile", verifythetoken, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "editprofile.html"));
});

app.get("/personalinfo", async (req, res) => {
    try {
        const userNumber = req.query.userNumber;
        const verifiedUser = await TemporaryUser.findOne({
            phoneNumber: userNumber,
        });

        if (verifiedUser && verifiedUser.isVerified) {
            res.sendFile(
                path.join(__dirname, "public", "html", "personalinformation.html")
            );
        } else {
            res.redirect("/");
        }
    } catch (error) {
        console.error("Error fetching user information:", error);
        res.status(500).send("Internal Server Error");
    }
});

function generateVerificationCode() {
    const randomCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return randomCode.toString();
}

function sendSmsVerification(otp, user) {
    var number = user;
    var authkey = OTPAUTHKEY;
    var cc = "+91";

    fetch(
        `https://api.authkey.io/request?authkey=${authkey}&mobile=${number}&country_code=+91&sid=12190&otp=${otp}&company=LoopSocial Account`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + btoa(authkey + ":"),
            },
            body: JSON.stringify({
                authkey: authkey,
                country_code: cc,
                mobile: number,
                sid: "12190",
                otp: otp,
            }),
        }
    )
        .then((response) => response.json())
        .then((data) => { })
        .catch((error) => {
            console.error("Error:", error);
        });
}

//User Registration

app.post("/register", async (req, res) => {
    const userData = req.body;
    const { phoneNumber, password } = userData;

    try {
        const existingUser = await UserProfile.findOne({
            phoneNumber: phoneNumber,
        });

        if (existingUser) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        let existingOTPData = await otpdata.findOne({ phoneNumber: phoneNumber });
        if (existingOTPData) {
            if (existingOTPData.attempts > 10) {
                return res
                    .status(400)
                    .json({ message: "Maximum OTP attempts reached" });
            }
        }

        const existingUsers = await TemporaryUser.find({ phoneNumber }).exec();
        if (existingUsers.length > 0) {
            await TemporaryUser.deleteOne({ phoneNumber }).exec();
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let verificationCode;
        do {
            verificationCode = generateVerificationCode();
        } while (await TemporaryUser.exists({ verificationCode }));

        const newUser = new TemporaryUser({
            phoneNumber: phoneNumber,
            password: hashedPassword,
            verificationCode: verificationCode,
        });

        if (existingOTPData) {
            await otpdata.updateOne(
                { phoneNumber: phoneNumber },
                { $inc: { attempts: 1 } }
            );
        } else {
            const newOTPData = new otpdata({
                phoneNumber: phoneNumber,
                createdAt: new Date(),
                attempts: 1,
            });
            await newOTPData.save();
        }
        await newUser.save();

        sendSmsVerification(verificationCode, phoneNumber);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error registering user:", error);
        res.sendStatus(500);
    }
});

function deleteTemporaryUserData(phoneNumber) {
    TemporaryUser.deleteOne({ phoneNumber: phoneNumber })
        .then(() => { })
        .catch((error) => { });
}

app.post("/resendotp", async (req, res) => {
    const phoneNumber = req.body.phoneNumber;

    try {
        let existingOTPData = await otpdata.findOne({ phoneNumber: phoneNumber });

        if (existingOTPData) {
            if (existingOTPData.resendattempt >= 4) {
                deleteTemporaryUserData(phoneNumber);
                return res
                    .status(400)
                    .json({ message: "Maximum OTP attempts reached" });
            }

            await otpdata.updateOne(
                { phoneNumber: phoneNumber },
                { $inc: { attempts: 1, resendattempt: 1 } }
            );
        } else {
            const newOTPData = new otpdata({
                phoneNumber: phoneNumber,
                attempts: 1,
                resendattempt: 1,
            });
            await newOTPData.save();
        }

        let verificationCode;
        do {
            verificationCode = generateVerificationCode();
        } while (await TemporaryUser.exists({ verificationCode }));

        await TemporaryUser.updateOne(
            { phoneNumber: phoneNumber },
            { verificationCode: verificationCode }
        );

        sendSmsVerification(verificationCode, phoneNumber);
        return res.sendStatus(200);
    } catch (error) {
        console.error("Error resending OTP:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/verifyotp", async (req, res) => {
    const otpdata = req.body;
    const { phoneNumber, otp } = otpdata;

    try {
        let user = await TemporaryUser.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await TemporaryUser.updateOne(
            { phoneNumber },
            { $inc: { verifyattempt: 1 } }
        );

        user = await TemporaryUser.findOne({ phoneNumber });

        const now = new Date().getTime();
        const createdAtTime = user.createdAt.getTime();
        const updatedAtTime = user.updatedAt ? user.updatedAt.getTime() : createdAtTime;
        const fiveMinutesInMillis = 5 * 60 * 1000;

        if (now - createdAtTime <= fiveMinutesInMillis || (user.updatedAt && now - updatedAtTime <= fiveMinutesInMillis)) {
            if (user.verifyattempt <= 5) {
                if (user.verificationCode === otp) {
                    await TemporaryUser.updateOne(
                        { phoneNumber },
                        { isVerified: true }
                    );
                    res.status(200).json({ message: "OTP verification successful" });
                } else {
                    res.status(400).json({ message: "Invalid OTP" });
                }
            } else {
                await TemporaryUser.deleteOne({ phoneNumber });
                res.status(400).json({ message: "You reached the maximum OTP attempts" });
            }
        } else {
            res.status(400).json({ message: "OTP expired" });
        }
    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/userprofiledata", async (req, res) => {
    try {
        var compressedData = req.body;
        var decompressedData = pako.inflate(compressedData, { to: "string" });
        var userdata = JSON.parse(decompressedData);
        var phoneNumber = userdata.phoneNumber;

        var temporaryUserData = await TemporaryUser.findOne({
            phoneNumber: phoneNumber,
        });

        if (!temporaryUserData) {
            return res.status(400).json({ message: "Temporary user data not found" });
        }

        if (
            !temporaryUserData.phoneNumber ||
            !temporaryUserData.password ||
            !temporaryUserData.isVerified
        ) {
            return res
                .status(400)
                .json({ message: "Incomplete or invalid temporary user data" });
        }

        const transformPhotos = (photos) => {
            return Object.keys(photos).map((key) => ({
                data: photos[key].data,
                count: photos[key].count,
            }));
        };

        var transformedphotos = transformPhotos(userdata.photos);

        const UserProfileData = new UserProfile({
            _id: new mongoose.Types.ObjectId(),
            phoneNumber: temporaryUserData.phoneNumber,
            password: temporaryUserData.password,
            firstName: userdata.firstName,
            lastName: userdata.lastName,
            dateOfBirth: userdata.dateOfBirth,
            gender: userdata.gender,
            currentlyIm: userdata.currentlyIm,
            interestedIn: userdata.interestedIn,
            lookingFor: userdata.lookingFor,
            sexualOrientation: userdata.sexualOrientation,
            interests: userdata.interests,
            photos: transformedphotos,
            bio: userdata.bio,
        });

        if (temporaryUserData.isVerified) {
            const savedUserProfile = await UserProfileData.save();
            const userId = savedUserProfile._id;

            deleteTemporaryUserData(phoneNumber);

            const vectordata = {
                interests: userdata.interests,
                userid: userId.toString(),
                usergender: userdata.gender,
            };

            mainaddvector(vectordata);

            const token = generateToken(userId.toString());

            res.cookie("authToken", token, {
                httpOnly: false,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).send({ message: "user data is stored" });
        } else {
            res.status(400).json({ message: "User data is not verified" });
        }
    } catch (error) {
        console.error("Error handling user profile data:", error);
        res.status(500).send("Internal Server Error");
    }
});

//Forgot Passowrd

app.post("/forgotpassword", async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        let userprofilecheck = await UserProfile.findOne({
            phoneNumber: phoneNumber,
        });
        if (!userprofilecheck) {
            return res.status(400).json({ message: "Phonenumber is not exist" });
        }

        let existingOTPData = await otpdata.findOne({ phoneNumber: phoneNumber });
        if (existingOTPData) {
            if (existingOTPData.attempts > 10) {
                return res
                    .status(400)
                    .json({ message: "Maximum OTP attempts reached" });
            }
        }

        let existingverifydata = await otpVerify.findOne({
            phoneNumber: phoneNumber,
        });
        if (existingverifydata) {
            await otpVerify.deleteOne({ phoneNumber: phoneNumber });
        }

        let verificationCode;
        do {
            verificationCode = generateVerificationCode();
        } while (await otpVerify.exists({ verificationCode }));

        const userotpdata = new otpVerify({
            phoneNumber: phoneNumber,
            verificationCode: verificationCode,
        });

        await userotpdata.save();

        if (existingOTPData) {
            await otpdata.updateOne(
                { phoneNumber: phoneNumber },
                { $inc: { attempts: 1 } }
            );
        } else {
            const newotpdata = new otpdata({
                phoneNumber: phoneNumber,
                attempts: 1,
            });
            await newotpdata.save();
        }

        sendSmsVerification(verificationCode, phoneNumber);

        res.status(200).json({ message: "OTP sent successfully." });
    } catch (error) {
        console.error("Error while sending OTP:", error);
        res.status(500).json({ message: "Error while sending OTP." });
    }
});

app.post("/forgototpverify", async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
        const otpverifydata = await otpVerify.findOne({ phoneNumber: phoneNumber });

        if (otpverifydata) {
            await otpVerify.updateOne(
                { phoneNumber: phoneNumber },
                { $inc: { verifiyattempt: 1 } }
            );
        }

        if (otpverifydata.verifiyattempt <= 5) {
            if (
                otpverifydata.phoneNumber == phoneNumber &&
                otpverifydata.verificationCode == otp
            ) {
                await otpVerify.updateOne(
                    { phoneNumber: phoneNumber },
                    { isVerified: true }
                );
                res.status(200).json({ message: "OTP verification successfull" });
            } else {
                res.status(400).json({ message: "Invalid OTP" });
            }
        } else {
            await otpVerify.deleteOne({ phoneNumber: phoneNumber });
            res.status(400).json({ message: "You reached the maximum otp attempt" });
        }
    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/forgotresendotp", async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        let existingOTPData = await otpdata.findOne({ phoneNumber: phoneNumber });

        if (existingOTPData) {
            if (existingOTPData.resendattempt >= 4) {
                await otpVerify.deleteOne({ phoneNumber: phoneNumber });
                return res
                    .status(400)
                    .json({ message: "Maximum OTP attempts reached" });
            }

            await otpdata.updateOne(
                { phoneNumber: phoneNumber },
                { $inc: { attempts: 1, resendattempt: 1 } }
            );
        } else {
            const newOTPData = new otpdata({
                phoneNumber: phoneNumber,
                attempts: 1,
                resendattempt: 1,
            });
            await newOTPData.save();
        }

        let verificationCode;
        do {
            verificationCode = generateVerificationCode();
        } while (await otpVerify.exists({ verificationCode }));

        await otpVerify.updateOne(
            { phoneNumber: phoneNumber },
            { verificationCode: verificationCode }
        );

        sendSmsVerification(verificationCode,phoneNumber)
        return res.sendStatus(200);
    } catch (error) {
        console.error("Error resending OTP:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/changepassword", async (req, res) => {
    const { Password, phoneNumber } = req.body;

    try {
        const rememberMeToken = req.cookies.authToken;

        let existinguserdata = await UserProfile.findOne({
            phoneNumber: phoneNumber,
        });
        if (!existinguserdata) {
            return res.status(404).json({ message: "User Not Found" });
        }

        if (rememberMeToken) {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    const newToken = generateToken(
                        existinguserdata.id,
                        existinguserdata.phoneNumber
                    );

                    res.cookie("authToken", newToken, {
                        httpOnly: false,
                        secure: false,
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    });
                }
            });
        } else {
            const newToken = generateToken(
                existinguserdata.id,
                existinguserdata.phoneNumber
            );

            res.cookie("authToken", newToken, {
                httpOnly: false,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);
        await UserProfile.updateOne(
            { phoneNumber: phoneNumber },
            { password: hashedPassword }
        );
        res.status(200).json({ message: "Password Updated Successfully" });
    } catch (error) {
        console.error("Error resending OTP:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//User Login

app.post("/Userlogin", async (req, res) => {
    var userData = req.body;
    var { phoneNumber, password } = userData;

    try {
        var existingUserlogin = await UserProfile.findOne({
            phoneNumber: phoneNumber,
        });

        if (!existingUserlogin) {
            return res.status(400).json({ message: "Invalid login credentials" });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            existingUserlogin.password
        );

        if (passwordMatch) {

            const newToken = generateToken(existingUserlogin.id);

            res.cookie("authToken", newToken, {
                httpOnly: false,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({ message: "Login successful" });

        } else {
            return res.status(400).json({ message: "Invalid login credentials" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Swipes

app.post("/recommendations", verifythetoken, async (req, res) => {
    const user = req.user;

    const sanitizedPhoneNumber = user.phoneNumber.trim();

    try {
        const recommendations = await getRecommendations(sanitizedPhoneNumber);
        res.status(200).json({ recommendations });
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        res.status(500).json({ error: "Failed to get recommendations" });
    }
});

async function getRecommendations(phoneNumber) {
    try {
        const userProfile = await UserProfile.findOne({ phoneNumber });
        if (!userProfile) {
            throw new Error("User not found");
        }

        const swiperdetails = await Swipe.findOne({ swiperId: userProfile.id });

        const swipedUserIds = swiperdetails ? swiperdetails.swipeHistory.map((entry) => entry.swipeeId) : [];
        swipedUserIds.push(userProfile.id);
        const swipeCount = swiperdetails ? swiperdetails.swipeCount : 0;
        const swiperInterestedin = userProfile.interestedIn;

        let requiredRecommendations = 26;
        let recommendationBatchSize = requiredRecommendations + swipeCount;

        const querydata = {
            interests: userProfile.interests,
            recommendationBatchSize: recommendationBatchSize,
            swiperInterestedin: swiperInterestedin,
        };

        const recommendations = JSON.parse(await mainQuery(querydata));

        if (recommendations.length == 0) {
            return []
        }

        swipedUserIds.push(userProfile.id);
        if (!Array.isArray(recommendations)) {
            throw new Error('Recommendations are not an array');
        }

        const filteredRecommendations = recommendations.filter(id => !swipedUserIds.includes(id));

        if (filteredRecommendations == 0) {
            return []
        }

        const userDetails = await getUserDetails(filteredRecommendations);

        return userDetails;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

async function getUserDetails(userIds) {
    try {
        const userDetailsPromises = userIds.map((id) =>
            UserProfile.findById(id).lean()
        );
        const userDetails = await Promise.all(userDetailsPromises);

        return userDetails.map((user) => ({
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: calculateAge(user.dateOfBirth),
            photo: user.photos.length > 1 ? user.photos[1] : user.photos.length > 0 ? user.photos[0] : null,
        }));
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
    }
}

function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

function runPythonScript(scriptPath, args) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn("python", [scriptPath, ...args]);

        let output = "";
        pythonProcess.stdout.on("data", (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            const errorMessage = data.toString();
            console.error("stderr:", errorMessage);
            reject(new Error(errorMessage));
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Python script exited with code ${code}`));
            }
        });
    });
}

const interestGroups = {
    "Education & Learning": [
        "Reading", "Education", "Language Exchange", "Exchange Program"
    ],
    "Rights & Activism": [
        "LGBTQIA+ Rights", "Youth Empowerment", "Politics", "Activism",
        "Environmental Protection", "Pride", "Equality", "Human Rights",
        "Voter Rights", "Climate Change", "Environmentalism", "Disability Rights",
        "Black Lives Matter", "Feminism", "Inclusivity", "Social Development", "Volunteering", "World Peace"
    ],
    "Events & Entertainment": [
        "Marathon", "Sci-Fi", "Film Festival", "Concerts", "Museum", "Podcasts",
        "Cinema", "Musicals", "Broadway", "West End Musicals", "Escape Cafe",
        "Drive Thru Cinema", "Festivals", "Nightlife", "Rave", "Ludo",
        "Horror Movies", "Bar Chilling", "Happy hour", "House Parties",
        "Brunch", "Shopping", "Exhibition", "Walking Tour", "Town Festivities",
        "Parties", "Binge-Watching TV shows", "Walking My Dog",
        "Movies", "Expositions", "Pub Quiz", "Comedy", "Baking", "Blackpink", "K-Pop", "BTS", "Memes", "Tarot", "Marvel"
    ],
    "Technology & Finance": [
        "Tech", "Coding", "DAOs", "Startup", "Online Broker", "NFTs",
        "Metaverse", "Investment", "Investing", "Stocks", "Stock Exchange", "Start ups", "Entrepreneurship"
    ],
    "Business & Industry": [
        "Real Estate", "Car Racing", "Motor Sports", "Bicycle Racing", "Motorbike Racing", "Motorcycling"
    ],
    "Arts & Culture": [
        "Photography", "Dance", "Theatre", "Fashion", "Literature", "Singing",
        "Poetry", "Painting", "Drawing", "Flamenco", "Dancing", "Art",
        "Musical Writing", "Art galleries", "Artistic Gymnastics", "Museum",
        "Bollywood", "Slam Poetry", "Choir", "Street Food", "Art",
        "Theater", "Film Festival", "Voguing", "Ballet", "Vinyasa", "Tattoos", "Fashion & Lifestyle"
    ],
    "Outdoor & Adventure": [
        "Hiking", "Mountains", "Backpacking", "Fishing", "Camping", "Climbing",
        "Rock Climbing", "Outdoors", "Picnicking", "Walking", "Running",
        "Jetski", "Sailing", "Canoeing", "Kayaking", "Cycling", "Motorcycles",
        "Beach Bars", "Picnicking", "Paragliding",
        "Free Diving", "Surfing", "Paddle Boarding", "Hiking", "Snowboarding", "Skiing", "Inline Skate", "Beach Tennis", "Gardening", "Equestrian", "Astrology"
    ],
    "Sports & Fitness": [
        "Sports", "Pentathlon", "Gym", "Home Workout", "Hot Yoga", "Meditation",
        "Yoga", "Self Care", "Fitness", "Bodycombat", "Bodyjam", "Bodypump",
        "Bodystep", "Pilates", "Running", "Skateboarding", "Weightlifting",
        "Crossfit", "Triathlon", "Boxing", "Martial Arts", "Jiu-jitsu",
        "Muay Thai", "Freeletics",
        "Gymnastics", "Hockey", "Basketball", "Cricket", "Jogging", "Football", "Tennis", "Ice Skating", "Cheerleading", "Five-a-side Football", "Volleyball", "Wrestling", "Badminton", "Active Lifestyle", "Swimming", "Table Tennis", "Baseball", "High School Sports",
        "Soccer", "Amateur Cook", "Working out", "Olympic Gymnastics", "Fencing", "NBA", "MLB", "Rugby", "Killing time"
    ],
    "Music & Performing Arts": [
        "Heavy Metal", "Hip Hop", "J-Pop", "Gospel", "Country Music", "Reggaeton",
        "90s Britpop", "Funk music", "Electronic Music", "Rock", "Trap Music",
        "Karaoke", "Guitarists", "Stand up Comedy", "Saxophonist", "Pole Dancing",
        "Drummer", "Live Music", "Musical Instrument", "DJ", "Musical Writing",
        "Band", "Tango", "Singing"
    ],
    "Music Platforms": [
        "SoundCloud", "Spotify", "Grime", "Bassist", "Music"
    ],
    "Games & Hobbies": [
        "Gaming", "Atari", "Cosplay", "Board Games", "Bowling", "Trivia",
        "Online Games", "90s Kid", "Harry Potter", "Potterhead", "PlayStation",
        "Xbox", "Nintendo", "Roblox", "Dungeons & Dragons", "Catan", "Twitch",
        "League of Legends", "Fortnite", "Among Us", "Collecting", "Anime",
        "Manga", "Acapella", "Ludo", "Songwriter", "Freelance", "Upcycling",
        "E-Sports", "Battle Ground", "Rollerskating", "Clubbing", "Gardening", "Indoor Activities", "Trying New Things", "Archery", "Padel"
    ],
    "Podcasts & Media": [
        "Podcasts", "Content Creation", "Instagram", "Blogging", "Vlogging",
        "YouTube", "Twitter", "TikTok", "Social Media", "Netflix", "Disney", "Comedy", "Podcasts", "Pinterest"
    ],
    "Online Activities": [
        "Language Exchange", "Online Shopping", "Online Games", "Virtual Reality",
        "VR Room", "Drive Thru Cinema"
    ],
    "Food & Drink": [
        "Maggi", "Biryani", "Sushi", "Bhangra", "Coffee", "Karaoke", "Pimms",
        "BBQ", "Craft Beer", "Iced Tea", "Pho", "Boba tea", "Cooking", "Foodie Tour",
        "Tempeh", "Sake", "Korean Food", "Street Food", "Tea", "Wine", "Ramen",
        "Ice Cream", "Pig Roast", "Ice Tea", "Gin tonic", "Caipirinha", "Vermut",
        "Samba", "Açaí", "Coffee Stall", "Cafe hopping", "Shisha", "Pubs", "Bar Hopping"
    ],
    "Travel & Exploration": [
        "Travel", "Road Trips", "Mountains", "Backpacking", "Camping",
        "Couchsurfing", "Vintage fashion", "Second-hand apparel", "Aquarium", "Hot Springs"
    ],
    "Self-Development & Well-being": [
        "Self Care", "Mental Health Awareness", "Meditation", "Self Development",
        "Skincare", "Spa", "Sauna", "Mindfulness", "Self-Improvement"
    ],
    "Indoor Activities": [
        "Board Games", "Catan", "Bodycombat", "Bodyjam", "Bodypump", "Bodystep",
        "Yoga", "Freelance", "Skincare", "Ludo", "Collecting", "Writing", "DIY",
    ],
    "Environmental & Sustainability": [
        "Environmental Protection", "Environmentalism", "Climate Change", "Upcycling", "Sustainability", "World Peace"
    ],
    "Fashion & Lifestyle": [
        "Fashion", "Sneakers", "Vintage fashion", "Anime", "Cosplay", "Makeup",
        "Vegan Cooking", "Second-hand apparel", "Fashion", "Tattoos", "Active Lifestyle", "Military", "Cars"
    ]
};


const indexCategory = {
    "Education & Learning": 1,
    "Rights & Activism": 2,
    "Events & Entertainment": 3,
    "Technology & Finance": 4,
    "Business & Industry": 5,
    "Arts & Culture": 6,
    "Outdoor & Adventure": 7,
    "Sports & Fitness": 8,
    "Music & Performing Arts": 9,
    "Music Platforms": 10,
    "Games & Hobbies": 11,
    "Podcasts & Media": 12,
    "Online Activities": 13,
    "Food & Drink": 14,
    "Travel & Exploration": 15,
    "Self-Development & Well-being": 16,
    "Indoor Activities": 17,
    "Environmental & Sustainability": 18,
    "Fashion & Lifestyle": 19
};

function mapInterestsToCategory(userInterests, interestGroups, indexCategory) {
    const categoryIndices = [];
    userInterests.forEach((interest) => {
        for (const category in interestGroups) {
            if (interestGroups[category].includes(interest)) {
                const categoryIndex = indexCategory[category];
                categoryIndices.push(categoryIndex);
                break;
            }
        }
    });
    return categoryIndices;
}

function separateWords(inputString) {
    return inputString.split(",").map((word) => word.trim());
}

// Recommendation - add

const addRequestQueue = [];
let addProcessing = false;

async function processAddQueue() {
    if (addProcessing || buildingInProgress) {
        return;
    }
    addProcessing = true;

    while (addRequestQueue.length > 0) {
        const { interests, userId, userGender, resolve, reject } =
            addRequestQueue.shift();
        try {
            const encodedInterests = mapInterestsToCategory(
                interests,
                interestGroups,
                indexCategory
            );
            await runPythonScript("annoy_script.py", [
                "add",
                JSON.stringify(encodedInterests),
                userId,
                JSON.stringify(userGender),
            ]);
            resolve();
        } catch (error) {
            console.error("Error adding vector to the ANN index:", error.message);
            reject(error);
        }
    }

    addProcessing = false;
    if (addRequestQueue.length > 0 && !buildingInProgress) {
        processAddQueue();
    }
}

function queueAddRequest(interests, userId, userGender) {
    return new Promise((resolve, reject) => {
        addRequestQueue.push({ interests, userId, userGender, resolve, reject });
        processAddQueue();
    });
}

function mainaddvector(vectordata) {
    const interestlist = separateWords(vectordata.interests);
    const userid = vectordata.userid;
    const usergender = vectordata.usergender;

    queueAddRequest(interestlist, userid, usergender);
}

//Recomendation - Query

const queryRequestQueue = [];
let queryProcessing = false;

async function processQueryQueue() {
    if (queryProcessing || buildingInProgress) {
        return;
    }
    queryProcessing = true;

    while (queryRequestQueue.length > 0) {
        const { interests, gender, recommendation_batch_size, resolve, reject } =
            queryRequestQueue.shift();
        try {
            const encodedInterests = mapInterestsToCategory(
                interests,
                interestGroups,
                indexCategory
            );
            const output = await runPythonScript("annoy_script.py", [
                "query",
                JSON.stringify(encodedInterests),
                recommendation_batch_size,
                JSON.stringify(gender),
            ]);
            resolve(output);
        } catch (error) {
            console.error("Error querying recommendations:", error.message);
            reject(error);
        }
    }

    queryProcessing = false;
    if (queryRequestQueue.length > 0 && !buildingInProgress) {
        processQueryQueue();
    }
}

function queueQueryRequest(interests, recommendation_batch_size, gender) {
    return new Promise((resolve, reject) => {
        queryRequestQueue.push({
            interests,
            gender,
            recommendation_batch_size,
            resolve,
            reject,
        });
        processQueryQueue();
    });
}

function mainQuery(querydata) {
    const interestList = separateWords(querydata.interests);
    const recommendationBatchSize = querydata.recommendationBatchSize;
    const swiperInterestedin = querydata.swiperInterestedin;

    return queueQueryRequest(
        interestList,
        recommendationBatchSize,
        swiperInterestedin
    );
}

// saveswiped and Get Batch data 

app.post("/saveswipes", verifythetoken, async (req, res) => {
    const userid = req.user.id;
    const { swipedid, action } = req.body;

    try {
        const swiperdetails = await UserProfile.findById(userid);

        if (!swiperdetails) {
            return res.status(404).json({ message: "Swiper details not found" });
        }

        let swiperRecord = await Swipe.findOne({ swiperId: swiperdetails.id });


        if (swiperRecord) {
            const alreadySwiped = swiperRecord.swipeHistory.some(swipe => swipe.swipeeId === swipedid);

            if (alreadySwiped) {
                return res.status(200).json({ message: "Swipe already recorded" });
            }

            await Swipe.updateOne(
                { swiperId: swiperdetails.id },
                {
                    $inc: { swipeCount: 1 },
                    $push: {
                        swipeHistory: {
                            swipeeId: swipedid,
                            action: action,
                            timestamp: new Date(),
                        },
                    },
                }
            );
        } else {
            swiperRecord = new Swipe({
                swiperId: swiperdetails.id,
                swipeCount: 1,
                swipeHistory: [
                    {
                        swipeeId: swipedid,
                        action: action,
                        timestamp: new Date(),
                    },
                ],
            });

            await swiperRecord.save();
        }

        res.status(200).json({ message: "Swipe saved successfully" });
    } catch (error) {
        console.error("Error saving swipe:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// ANN index build

let indexBuilding = false;
let buildingInProgress = false;

async function buildIndex(retryCount = 3, retryDelay = 1000) {
    if (buildingInProgress) {
        console.log("Index building already in progress.");
        return;
    }
    indexBuilding = true;
    buildingInProgress = true;

    await waitForCompletion();

    let attempts = 0;
    while (attempts < retryCount) {
        try {
            await runPythonScript("annoy_script.py", ["update"]);
            console.log("Index built successfully.");
            break;
        } catch (error) {
            attempts++;
            console.error(`Error building index. Attempt ${attempts}/${retryCount}:`, error.message);
            if (attempts < retryCount) {
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            } else {
                console.error("Failed to build index after multiple attempts.");
            }
        }
    }

    buildingInProgress = false;
    indexBuilding = false;

    if (queryRequestQueue.length > 0) {
        processQueryQueue();
    }
    if (addRequestQueue.length > 0) {
        processAddQueue();
    }
}

async function waitForCompletion() {
    while (queryProcessing || addProcessing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}

cron.schedule('0 * * * *', () => {
    buildIndex();
});


async function processbuild() {
    try {
        const output = await runPythonScript("annoy_script.py", ["build"]);
    } catch (error) {
        console.error("Error initiating index build:", error);
    }
}

app.post("/updateuserprofiledata", verifythetoken, async (req, res) => {
    try {
        var compressedData = req.body;
        var decompressedData = pako.inflate(compressedData, { to: "string" });
        var userdata = JSON.parse(decompressedData);

        const result = await UserProfile.updateOne(
            { _id: userdata.id },
            {
                $set: {
                    firstName: userdata.firstName,
                    lastName: userdata.lastName,
                    dateOfBirth: userdata.dateOfBirth,
                    gender: userdata.gender,
                    currentlyIm: userdata.currentlyIm,
                    interestedIn: userdata.interestedIn,
                    lookingFor: userdata.lookingFor,
                    sexualOrientation: userdata.sexualOrientation,
                    interests: userdata.interests,
                    photos: userdata.photos,
                    bio: userdata.bio,
                },
            }
        );

        if (result.matchedCount > 0) {
            if (result.modifiedCount > 0) {
                res.status(200).json({ message: "Document updated successfully." });
            } else {
                res
                    .status(200)
                    .json({ message: "Document matched but no changes were made." });
            }
        } else {
            res.status(404).json({ message: "No document matched the filter." });
        }
    } catch (error) {
        console.error("Error handling user profile data:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/getswipedata", verifythetoken, async (req, res) => {
    try {
        const data = req.user;
        const userId = data.id;

        const swipeData = await Swipe.findOne({ swiperId: userId });

        if (!swipeData) {
            return res.json({
                swipesMade: 0,
                likesReceived: 0,
                dislikesReceived: 0,
            });
        }

        const swipesMade = swipeData.swipeCount;

        const likesReceived = await Swipe.countDocuments({
            "swipeHistory.swipeeId": userId,
            "swipeHistory.action": "love",
        });
        const dislikesReceived = await Swipe.countDocuments({
            "swipeHistory.swipeeId": userId,
            "swipeHistory.action": "nope",
        });

        res.json({
            swipesMade,
            likesReceived,
            dislikesReceived,
        });
    } catch (error) {
        console.error("Error handling user profile data:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/logoutuser", verifythetoken, async (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: false,
        secure: false,
    });
    res.status(200).send("Logout sucessfull");
});

// Connections

app.post("/likedusers", verifythetoken, async (req, res) => {
    try {
        const userdata = req.user;
        const userId = userdata.id;

        const swipesData = await Swipe.find(
            { "swipeHistory.swipeeId": userId, "swipeHistory.action": "love" },
            { swiperId: 1, _id: 0 }
        );

        const swiperIds = swipesData.map((doc) => doc.swiperId);

        const userSwipeHistory = await Swipe.findOne(
            { swiperId: userId },
            { "swipeHistory.swipeeId": 1, _id: 0 }
        );

        const alreadySwipedIds = userSwipeHistory ? userSwipeHistory.swipeHistory.map((history) => history.swipeeId) : [];
        const filteredUserIds = swiperIds.filter((id) => !alreadySwipedIds.includes(id));

        const userDetailsPromises = filteredUserIds.map((id) => UserProfile.findById(id).lean());
        const allUserDetails = await Promise.all(userDetailsPromises);

        const userDetails = allUserDetails.map((user) => ({
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            photo: user.photos[0]
        }));

        res.json(userDetails);
    } catch (error) {
        console.error(
            "Error while retrieving users who liked the current user:",
            error
        );
        res.status(500).json({
            message: "Error while retrieving users who liked the current user.",
        });
    }
});

app.post("/connectionaction", verifythetoken, async (req, res) => {
    const userid = req.user.id;
    const { swipeeId, action } = req.body;

    try {
        let swiperRecord = await Swipe.findOne({ swiperId: userid });

        if (swiperRecord) {
            await Swipe.updateOne(
                { swiperId: userid },
                {
                    $push: {
                        swipeHistory: {
                            swipeeId: swipeeId,
                            action: action,
                            timestamp: new Date(),
                        },
                    },
                }
            );
        } else {
            swiperRecord = new Swipe({
                swiperId: userid,
                swipeHistory: [
                    {
                        swipeeId: swipeeId,
                        action: action,
                        timestamp: new Date(),
                    },
                ],
            });

            await swiperRecord.save();
        }

        if (action === "love") {
            const match = await Match.findOne({
                $or: [
                    { userAId: userid, userBId: swipeeId },
                    { userAId: swipeeId, userBId: userid },
                ],
            });

            if (match) {
                return res.status(200).json({ message: "Users already matched" });
            }

            const newMatch = new Match({
                userAId: userid,
                userBId: swipeeId,
            });

            await newMatch.save();
        }

        res.status(200).json({ message: "Swipe saved successfully" });
    } catch (error) {
        console.error("Error saving swipe:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/getMatches", verifythetoken, async (req, res) => {
    try {
        const userId = req.user.id;

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const matches = await Match.aggregate([
            {
                $match: {
                    $or: [{ userAId: userId }, { userBId: userId }],
                    matchedAt: { $gte: oneWeekAgo },
                },
            },
            {
                $project: {
                    matchedUserId: {
                        $cond: {
                            if: { $eq: ["$userAId", userId] },
                            then: "$userBId",
                            else: "$userAId"
                        }
                    }
                }
            }
        ]);

        const matchedUserIds = matches.map(match => match.matchedUserId);

        if (matchedUserIds.length === 0) {
            return res.json([])
        }

        const userDetailsPromises = matchedUserIds.map(id => UserProfile.findById(id).lean());
        const allUserDetails = await Promise.all(userDetailsPromises);

        const userDetails = allUserDetails.map(user => ({
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            photo: user.photos[0],
            age: calculateAge(user.dateOfBirth),
        }));

        res.json(userDetails);
    } catch (error) {
        console.error("Error while retrieving recent matches:", error);
        res.status(500).json({ message: "Error while retrieving recent matches." });
    }
});


const startLikeChangeStream = () => {
    const changeStream = Swipe.watch([], { fullDocument: "updateLookup" });

    changeStream.on("change", async (change) => {
        const { operationType, fullDocument, updateDescription } = change;

        if (operationType === "insert") {
            const userId = fullDocument.swipeHistory[0].swipeeId;
            const targetId = fullDocument.swiperId;
            const action = fullDocument.swipeHistory[0].action;

            if (action == "love") {
                if (userSockets[userId]) {
                    try {
                        const data = await checktheuser(userId, targetId);
                        if (data.length > 0) {
                            userSockets[userId].emit("update", {
                                message: "New swipe action recorded!",
                                data,
                            });
                        }
                    } catch (error) {
                        console.error("Error checking user:", error);
                    }
                }
            }
        } else if (operationType === "update") {
            const updatedFields = updateDescription.updatedFields;
            const swipeHistoryKey = Object.keys(updatedFields).find((key) =>
                key.startsWith("swipeHistory.")
            );

            if (swipeHistoryKey) {
                const updatedSwipeHistory = updatedFields[swipeHistoryKey];

                if (
                    updatedSwipeHistory &&
                    updatedSwipeHistory.action &&
                    updatedSwipeHistory.swipeeId
                ) {
                    const action = updatedSwipeHistory.action;
                    const userId = updatedSwipeHistory.swipeeId;
                    const targetId = fullDocument.swiperId;

                    if (action == "love") {
                        if (userSockets[userId]) {
                            try {
                                const data = await checktheuser(userId, targetId);
                                if (data.length > 0) {
                                    userSockets[userId].emit("update", {
                                        message: "New swipe action recorded!",
                                        data,
                                    });
                                }
                            } catch (error) {
                                console.error("Error Checking user:", error);
                            }
                        }
                    }
                } else {
                    console.error("Invalid swipeHistory data:", updatedSwipeHistory);
                }
            }
        }
    });
};

const startMatchChangeStream = () => {
    const changeStream = Match.watch([], { fullDocument: "updateLookup" });

    changeStream.on("change", async (change) => {
        const { operationType, fullDocument } = change;

        if (operationType === "insert") {
            const userAId = fullDocument.userAId;
            const userBId = fullDocument.userBId;
            const matchedAt = fullDocument.matchedAt;

            if (userSockets[userAId]) {
                const to = "A";
                const data = await checkthematch(userAId, userBId, matchedAt, to);
                if (data.length > 0) {
                    userSockets[userAId].emit("match", {
                        message: "You have a new match!",
                        data,
                    });
                }
            }

            if (userSockets[userBId]) {
                const to = "B";
                const data = await checkthematch(userAId, userBId, matchedAt, to);
                if (data.length > 0) {
                    userSockets[userBId].emit("match", {
                        message: "You have a new match!",
                        data,
                    });
                }
            }
        }
    });
};

async function checktheuser(userId, targetId) {
    try {
        const userSwipeHistory = await Swipe.findOne(
            { swiperId: userId },
            { "swipeHistory.swipeeId": 1, _id: 0 }
        );

        const alreadySwipedId = userSwipeHistory
            ? userSwipeHistory.swipeHistory.map((history) => history.swipeeId)
            : [];
        const isNewSwipe = !alreadySwipedId.includes(targetId);

        if (isNewSwipe) {
            const userdata = await UserProfile.findById(targetId);
            if (userdata) {
                const userDetails = {
                    id: userdata._id,
                    firstName: userdata.firstName,
                    lastName: userdata.lastName,
                    photo: userdata.photos[0],
                };

                return [userDetails];
            }
        }

        return [];
    } catch (error) {
        console.error("Error in checktheuser function:", error);
        return [];
    }
}

async function checkthematch(userAId, userBId, matchedAt, to) {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        if (matchedAt >= oneWeekAgo) {
            let userDetails;

            if (to == "A") {
                const userB = await UserProfile.findById(userBId);
                userDetails = {
                    id: userB._id,
                    firstName: userB.firstName,
                    lastName: userB.lastName,
                    photo: userB.photos[0],
                    age: calculateAge(userB.dateOfBirth)
                };
            } else {
                const userA = await UserProfile.findById(userAId);
                userDetails = {
                    id: userA._id,
                    firstName: userA.firstName,
                    lastName: userA.lastName,
                    photo: userA.photos[0],
                    age: calculateAge(userA.dateOfBirth)
                };
            }

            return [userDetails];
        }

        return [];
    } catch (error) {
        console.error("Error in checkthematch function:", error);
        return [];
    }
}

// Socket functions

function broadcastUserProfileToAll(userId) {
    UserProfile.findById(userId)
        .then((user) => {
            if (user) {
                const profileData = {
                    userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: calculateAge(user.dateOfBirth),
                    photo: user.photos[0],
                };

                const onlineSocketIds = Object.keys(userSockets);

                if (onlineSocketIds.length > 1) {
                    onlineSocketIds.forEach((socketId) => {
                        const socket = userSockets[socketId];
                        if (socket.userId !== userId) {
                            socket.emit("userOnline", profileData);
                        }
                    });
                }
            } else {
                console.error("User not found:", userId);
            }
        })
        .catch((error) => {
            console.error("Error fetching user profile:", error);
        });
}

function fetchAndSendOnlineProfiles(socket) {
    const onlineUserIds = Object.keys(userSockets);
    const currentUserId = socket.userId;

    UserProfile.find({
        _id: { $in: onlineUserIds.filter((id) => id !== currentUserId) },
    })
        .then((users) => {
            const profiles = users.map((user) => ({
                userId: user._id.toString(),
                firstName: user.firstName,
                lastName: user.lastName,
                age: calculateAge(user.dateOfBirth),
                photo: user.photos[0],
            }));

            if (profiles.length > 0) {
                socket.emit("allUsers", profiles);
            } else {
                socket.emit("allUsers", { message: "No other users are online now." });
            }
        })
        .catch((error) => {
            console.error("Error fetching online user profiles:", error);
        });
}

function broadcastUserOffline(userId) {
    io.emit("userOffline", { userId });
}

async function getOrderedMatchedUserIds(userId) {
    try {
        const matches = await Match.find({
            $or: [{ userAId: userId }, { userBId: userId }],
        }).sort({ matchedAt: -1 });

        const matchedUserIds = matches.map((match) =>
            match.userAId === userId ? match.userBId : match.userAId
        );

        return matchedUserIds;
    } catch (error) {
        console.error("Error fetching ordered matched user IDs:", error);
        return [];
    }
}

async function fetchOnlineFriends(userId, socket) {
    try {
        const matchedUserIds = await getOrderedMatchedUserIds(userId);

        let onlineFriends = [];
        for (const matchedUserId of matchedUserIds) {
            if (onlineFriends.length >= 5) break;

            if (userSockets[matchedUserId]) {
                const userProfile = await UserProfile.findById(matchedUserId);

                if (userProfile) {
                    onlineFriends.push({
                        userId: userProfile._id.toString(),
                        photo: userProfile.photos[0].data
                    });
                }
            }
        }

        socket.emit("onlineFriends", onlineFriends);
    } catch (error) {
        console.error("Error fetching online friends:", error);
    }
}

async function updateOnlineFriends(userId) {
    try {
        const matchedUserIds = await getOrderedMatchedUserIds(userId);

        for (const matchedUserId of matchedUserIds) {
            if (userSockets[matchedUserId]) {
                const socket = userSockets[matchedUserId];
                await fetchOnlineFriends(matchedUserId, socket);
            }
        }
    } catch (error) {
        console.error("Error notifying users of new online:", error);
    }
}

async function deleteExpiredUsers() {
    const expirationTime = new Date(Date.now() - 5 * 60 * 1000);

    try {
        await TemporaryUser.deleteMany({ updatedAt: { $lt: expirationTime } });
    } catch (error) {
        console.error('Error deleting expired users:', error);
    }
}

setInterval(deleteExpiredUsers, 60 * 1000);

//messages

app.post('/getuserchat', verifythetoken, async (req, res) => {
    try {
        const user_id = req.user.id;
        const req_id = req.body.userid;

        const Conversation = await conversation.findOne({
            $or: [
                { userAId: user_id, userBId: req_id },
                { userAId: req_id, userBId: user_id }
            ]
        });

        if (Conversation) {
            const Messages = await Message.find({
                conversationId: Conversation._id
            }).sort({ timestamp: -1 }).limit(100);

            await Message.updateMany(
                {
                    sender: req_id,
                    status: { $ne: 'read' }
                },
                {
                    $set: { status: 'read' }
                }
            );

            await infotheuser(req_id, user_id);

            return res.status(200).json({ Messages });
        } else {
            return res.status(200).json({ message: 'No conversation' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/getmoremessages', verifythetoken, async (req, res) => {
    try {
        const user_id = req.user.id;
        const req_id = req.body.req_id;
        const messageId = req.body.messageId;

        const Conversation = await conversation.findOne({
            $or: [
                { userAId: user_id, userBId: req_id },
                { userAId: req_id, userBId: user_id }
            ]
        });

        if (!Conversation) {
            return res.status(200).json({ Messages: [] });
        }

        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.status(400).json({ message: 'Message not found' });
        }

        const timestampBeforeMessage = message.timestamp;

        const messages = await Message.find({
            conversationId: Conversation._id,
            timestamp: { $lt: timestampBeforeMessage }
        }).sort({ timestamp: -1, _id: -1 })
        .limit(100);

        return res.status(200).json({ Messages: messages });

    } catch (error) {
        console.error('Error fetching more messages:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

async function infotheuser(userid,reqid) {
    if(userSockets[userid]) {
        userSockets[userid].emit("readedallm", { reqid });
    }
}

const port = 4000;
const hostname = "::";

server.listen(port, hostname, () => {
    console.log(`NodejsServer running at http://${hostname}:${port}/`);
});