import { IProfileThumbnail } from "./profile";

export interface IChat {
	chatId: string,
	messages: IMessage[];
	participant: IProfileThumbnail;
	unread: boolean;
}

export interface IMessage {
	from: string;
	timestamp: number;
	message: string;
}

export interface IWsOnlineMessage {
	profileId: string;
}

export interface IWsChatMessage {
	chatId: string,
	message: string;
	to: string,
	from: string,
	timestamp: number,
}
