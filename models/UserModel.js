import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    // id: { type: String, default: uuidv4 },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    hobby: [{ type: String }],
    email: { type: String, index: true, required: true }, //unique: true
    password: { type: String, required: true },
    role: { type: String },
    loginCount: { type: Number, default: 0 },
    isBlock: { type: Boolean, index: true, default: false },
    isAdminApproved: { type: Boolean, index: true, default: false },
    isDeleted: { type: Boolean, default: false }
})

userSchema.pre('save', async function (next) {
    const user = this;
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password using the salt
        user.password = await bcrypt.hash(user.password, salt);

        next();
    } catch (err) {
        next(err);
    }
});

const userModels = mongoose.model('users', userSchema);

export default userModels;
