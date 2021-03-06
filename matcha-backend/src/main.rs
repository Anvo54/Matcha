mod api;
mod application;
mod database;
mod errors;
mod infrastructure;
mod models;
#[cfg(test)]
mod tests;

use crate::chat::server::WsServer;
use actix::Actor;
use actix::Addr;
use actix_cors::Cors;
use actix_files::Files;
use actix_files::NamedFile;
use actix_web::middleware::Logger;
use actix_web::Error;
use actix_web::{get, web, App, HttpResponse, HttpServer};
use application::chat;
use database::seed_data;
use dotenv::dotenv;
use log::info;
use std::fs;
use std::path::PathBuf;

#[get("/seed")]
async fn seed(ws_srv: web::Data<Addr<WsServer>>) -> Result<HttpResponse, Error> {
	seed_data::seed_data(ws_srv.get_ref().clone()).await?;
	Ok(HttpResponse::Ok().body("Success"))
}

async fn index() -> Result<NamedFile, Error> {
	let path: PathBuf = "./front/index.html".parse()?;
	Ok(NamedFile::open(path)?)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
	dotenv().ok();
	env_logger::init();
	database::setup::arango_setup()
		.await
		.expect("DB setup failed");

	let server = chat::server::WsServer::new().start();

	fs::create_dir_all("images")?;
	let server = HttpServer::new(move || {
		App::new()
			.data(server.clone())
			.wrap(Logger::new("%a \"%r\" %s"))
			.wrap(Cors::permissive())
			.service(seed)
			.service(Files::new("/img", "./images"))
			.configure(api::controllers::user::routes)
			.configure(api::controllers::profile::routes)
			.configure(api::controllers::browse::routes)
			.configure(api::controllers::research::routes)
			.configure(api::controllers::chat::routes)
			.configure(api::controllers::matches::routes)
			.configure(api::controllers::notification::routes)
			.service(Files::new("/.*", "./front"))
			.default_service(web::resource("").route(web::get().to(index)))
	})
	.bind("127.0.0.1:8080")?;
	info!("Starting server");
	server.run().await
}
