#[macro_use]
extern crate diesel;
extern crate dotenv;

use actix_web::{App, web, HttpServer};
use diesel::prelude::*;
use actix_cors::Cors;
use diesel::{PgConnection};
use dotenv::dotenv;
use std::env;

pub mod schema;
pub mod models;

pub mod lib;
pub mod routes;

use lib::AppState;

fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}



#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
            
        App::new()
            .app_data(web::Data::new(AppState {
                dbconn: establish_connection(),
            }))
            .wrap(cors)
            .configure(routes::todo::config)
        
    }
    )
    .bind(("localhost", 8080))?
    .run()
    .await
}
