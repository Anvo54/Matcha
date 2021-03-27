use crate::application::profile::load_profile_dto;
use crate::errors::AppError;
use crate::models::profile::Gender;
use crate::models::profile::Profile;
use crate::models::profile::PublicProfileDto;
use crate::models::profile::SexualPreference;
use crate::models::user::User;

pub async fn list(user: &User) -> Result<Vec<PublicProfileDto>, AppError> {
	let my_profile = Profile::get(&user.profile).await?;
	let profiles: Vec<Profile> = Profile::get_all()
		.await?
		.into_iter()
		.filter(|x| filter_profile(&my_profile, &x))
		.collect();
	let mut profile_dtos: Vec<PublicProfileDto> = vec![];
	for p in profiles {
		let pdto = load_profile_dto(user, &p.key).await?;
		profile_dtos.push(pdto);
	}

	Ok(profile_dtos)
}

fn filter_profile(my_profile: &Profile, their_profile: &Profile) -> bool {
	sexually_compatible(my_profile, their_profile)
		&& sexually_compatible(their_profile, my_profile)
		&& my_profile.key != their_profile.key
}

fn sexually_compatible(a: &Profile, b: &Profile) -> bool {
	match a.sexual_preference {
		SexualPreference::Both => true,
		SexualPreference::Female => b.gender.as_ref().unwrap() == &Gender::Female,
		SexualPreference::Male => b.gender.as_ref().unwrap() == &Gender::Male,
	}
}