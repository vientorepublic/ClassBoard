import mongoose from "mongoose";
const { Schema } = mongoose;

/**
 * Permissions
 * 1 = Superuser
 * 2 = Admin
 * 3 = User
 * 4 = Blocked
 */

const schema = new Schema({
    // 계정 상태
    permission: { type: Number, default: 3 },

    // 메인
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Number, required: true },
    refresh_token: { type: String, unique: true },

    // 기타 정보
    latest_ipaddr: { type: String }
});

export const userSchema = mongoose.models.users || mongoose.model('users', schema);