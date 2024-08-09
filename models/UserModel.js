import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    // id: { type: String, default: uuidv4 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    hobby: [{ type: String, required: true }],
    email: { type: String, required: true }, //unique: true
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    loginCount: { type: Number, default: 0 },
    isBlock: { type: Boolean, default: false },
    isAdminApproved: { type: Boolean, default: false }
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

const userModels = mongoose.model('users',userSchema);

export default userModels;
