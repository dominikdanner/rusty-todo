#[macro_use]
extern crate diesel;
extern crate dotenv;

use actix_web::{App, web, HttpServer};
use actix_cors::Cors;

pub mod todo;
use todo::models;
use todo::schema;

pub mod lib;
use lib::{AppState, establish_connection};

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
            .configure(todo::controllers::config)
        
    }
    )
    .bind(("localhost", 8080))?
    .run()
    .await
}
