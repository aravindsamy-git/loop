const mongoose = require('mongoose');

const temporaryUserSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationCode: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    verifyattempt: { type: Number, default: 0 }
}, { timestamps: true });

const userProfileSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String},
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Not to mention'], required: true },
    currentlyIm: { type: String },
    interestedIn: { type: String, enum: ['Male', 'Female', 'Everyone'], required: true },
    lookingFor: { type: String, enum: ['Casual Dating', 'Serious Relationship', 'Friendship', 'Activity Partners', 'Open to Possibilities', 'Not Sure yet'], required: true },
    sexualOrientation: { type: String },
    interests: { type: String },
    photos: [{
        data: { type: String, required: true },
        count: { type: Number, required: true }
    }],
    bio: { type: String }
});


const swipeSchema = new mongoose.Schema({
    swiperId: { type: String, required: true },
    swipeCount: { type: Number, default: 0 },
    swipeHistory: [
        {
            swipeeId: { type: String, required: true },
            action: { type: String, required: true },
            timestamp: { type: Date, required: true, default: Date.now }
        }
    ]
});

const otpschema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    attempts: { type: Number, required: true, default: 0 },
    resendattempt: { type: Number, required: true, default: 0 }
});

otpschema.index({ createdAt: 1 }, { expireAfterSeconds: 12 * 60 * 60 });

const otpVerifySchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    verificationCode: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    verifiyattempt: { type: Number, default:0},
    isVerified: { type: Boolean, default: false }
});

otpVerifySchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const matchSchema = new mongoose.Schema({
    userAId: { type: String, required: true },
    userBId: { type: String, required: true },
    matchedAt: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
    userAId: { type: String, required: true },
    userBId: { type: String, required: true },
});

const messageSchema = new mongoose.Schema({
    conversationId: { type: String, required: true },
    sender: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
const Swipe = mongoose.model('Swipe', swipeSchema);
const TemporaryUser = mongoose.model('TemporaryUser', temporaryUserSchema);
const otpdata = mongoose.model('otpauth', otpschema);
const otpVerify = mongoose.model('otpverify', otpVerifySchema)
const Match = mongoose.model('Match',matchSchema)
const conversation = mongoose.model('Conversion',conversationSchema)
const Message = mongoose.model('Message',messageSchema)

module.exports = { UserProfile, Swipe, TemporaryUser, otpdata, otpVerify, Match, conversation, Message };
