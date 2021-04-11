use crate::errors::AppError;
use crate::infrastructure::security::jwt;
use crate::models::user::{LoginFormValues, LoginResponse, User};

pub mod credentials;
pub mod password;
pub mod register;

pub async fn login(values: LoginFormValues) -> Result<LoginResponse, AppError> {
	if let Some(user) = User::find("emailAddress", &values.email_address)
		.await?
		.pop()
	{
		if !user.verify_pw(&values.password) {
			return Err(AppError::unauthorized("Login failed"));
		}
		if user.link.is_some() {
			return Err(AppError::unauthorized("Please verify your account!"));
		}
		let token = jwt::create_token(&user)?;
		Ok(user.login_response(&token).await?)
	} else {
		return Err(AppError::unauthorized("Login failed"));
	}
}
