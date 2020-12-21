import { model, Schema, Document } from "mongoose";
import { UserModelDocumentInterface } from "./UserModel";
import { VideoModelDocumentInterface } from "./VideoModel";


export interface CommentsModelInterface {
    _id?: string;
    owner: UserModelDocumentInterface;
    video: VideoModelDocumentInterface;
    text: string;
}

export type CommentsModelDocumentInterface = CommentsModelInterface & Document;

const CommentsChema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
    video: {type: Schema.Types.ObjectId, ref: "Video", required: true},
    text: {type: String, required: true}
}, { timestamps: true});

export const CommentsModel = model<CommentsModelDocumentInterface>('Comments', CommentsChema);

