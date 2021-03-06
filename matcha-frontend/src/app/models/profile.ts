export interface IProfile {
	id: string;
	firstName: string;
	lastName: string;
	sexualPreference: SexualPreference;
	gender: Gender;
	biography: string;
	interests: string[];
	images: IImage[];
	fameRating: number;
}

export interface IPrivateProfile extends IProfile {
	locationOverride: boolean;
	likes: IProfileThumbnail[];
	location: ILocation;
	visits: IProfileThumbnail[];
	birthDate?: Date;
}

export interface IReportFormData {
	reason: string;
}

export interface IPublicProfile extends IProfile {
	age: number;
	username: string;
	distance: number;
	connected: boolean;
	liked: boolean;
	mutualInterests: number;
	interests: string[];
	compatibilityRating: number;
	lastSeen: string,
	blocked: boolean;
}

export interface IProfileThumbnail {
	id: string;
	firstName: string;
	image: IImage;
}

export interface IProfileFormValues {
	firstName: string;
	lastName: string;
	birthDate?: Date;
	gender: string;
	biography: string;
	sexualPreference: string;
	interests: string[];
	locationOverride: boolean;
	location: ILocation;
}

export interface ILocation {
	latitude: number;
	longitude: number;
}

export interface IImage {
	id: string;
	url: string;
	isMain: boolean;
}

export enum SexualPreference {
	Male = 'Male',
	Female = 'Female',
	Both = 'Both',
}

export enum Gender {
	Male = 'Male',
	Female = 'Female',
}

export const stringToGender = (data: string): Gender => {
	if (data === 'Male') return Gender.Male;
	return Gender.Female;
};

export const stringToSexPref = (data: string): SexualPreference => {
	if (data === 'Male') return SexualPreference.Male;
	if (data === 'Female') return SexualPreference.Female;
	return SexualPreference.Both;
};

export interface ILikeResponse {
	connected: boolean;
}

export const profileToFormValues = (
	profile: IPrivateProfile
): IProfileFormValues => {
	return {
		firstName: profile.firstName,
		lastName: profile.lastName,
		birthDate: profile.birthDate ? new Date(profile.birthDate) : undefined,
		gender: profile.gender,
		sexualPreference: profile.sexualPreference,
		biography: profile.biography,
		locationOverride: profile.locationOverride,
		location: profile.location,
		interests: profile.interests,
	};
};
