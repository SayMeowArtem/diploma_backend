import { model, Schema, Document} from 'mongoose';


export interface UserModelInterface {
    _id?: string;
    email: string;
    fullname: string;
    username: string;
    password: string;
    confirmHash: string;
    // select: string;
    avatar?: string;
    confirmed?: boolean;
    discription?: string;
    about?: string;
}

export type UserModelDocumentInterface = UserModelInterface & Document;


const UserSchema = new Schema<UserModelInterface>({
    email: {
        unique: true,
        required: true,
        type: String
    },
    fullname: {
        required: true,
        type: String
    },
    username: {
        unique: true,
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    confirmHash: {
        required: true,
        type: String
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
    },
    // select: {
    //     type: String,
    //     required: true
    // },
    discription: String,
    about: String
}, {
    timestamps: true
});


UserSchema.set('toJSON', {
    transform: function(_,obj) {
        delete obj.password,
        delete obj.confirmHash;
        return obj;
    }
});

export const UserModel = model<UserModelDocumentInterface>('User', UserSchema)

