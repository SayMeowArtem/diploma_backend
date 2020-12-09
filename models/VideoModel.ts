import { model, Schema, Document} from 'mongoose';
import { PlaylistModelInterface } from './playlistModel';
import { UserModelDocumentInterface } from './UserModel';

export interface VideoModelInterface {
    _id: string;
    owner: UserModelDocumentInterface;
    playlist: PlaylistModelInterface | string;
    title: string;
    url: string;
    likes: string;
    views: string;
}

export type VideoModelDocumentInterface = VideoModelInterface & Document;

const VideoSchema = new Schema<VideoModelInterface>({
    owner: {
        required: true,
        ref: 'User',
        type: Schema.Types.ObjectId
    },
    playlist: {
        type: Schema.Types.ObjectId,
        ref: 'Playlists',
        required: true
    },
    title: {
        required: true,
        type: String
    },
    url: {
        required: true,
        type: String
    },
    likes: {
        type: String,
        default: 0
    },
    views: {
        type: String,
        default: 0
    }
}, {
    timestamps: true
});

export const VideoModel = model<VideoModelDocumentInterface>('Video', VideoSchema);