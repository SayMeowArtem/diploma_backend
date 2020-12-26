import { model, Schema, Document} from 'mongoose';
import { UserModelDocumentInterface } from './UserModel';
import { VideoModelInterface } from './VideoModel';

export interface PlaylistModelInterface {
    _id?: string;
    owner: UserModelDocumentInterface;
    title: string;
    coverURL: string;
    videos: VideoModelInterface[];
    popularity?: Number;
    free?: boolean;
}

export type PlaylistModelDocumentInterface = PlaylistModelInterface & Document;

const PlaylistSchema = new Schema(
    {
        owner: {type: Schema.Types.ObjectId, ref:"User" , required: true} ,
        coverURL: {type: String},
        popularity: { type: Number},
        title: {type: String, required: true},
        free: {type: String}
    },
    {
        timestamps: true,
    }
);

export const PlaylistModel = model<PlaylistModelDocumentInterface>('Playlists', PlaylistSchema);