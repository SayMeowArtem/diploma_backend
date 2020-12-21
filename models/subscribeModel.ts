import { model, Schema, Document } from "mongoose";


export interface SubscribesModelInterface {
    _id?: string;
    author: string;
    subscriber: string;
}

export type SubscribesModelDocumentInterface= SubscribesModelInterface & Document;

const SubscribeSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    subscriber:  {type: Schema.Types.ObjectId, ref: "User", required: true}
}, { timestamps: true})

export const SubscribeModel = model<SubscribesModelDocumentInterface>('Subscribes', SubscribeSchema);