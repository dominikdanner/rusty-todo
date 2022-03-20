use diesel::{PgConnection, prelude::*};
use actix_web::{HttpRequest};
use qstring::QString;
use dotenv::dotenv;
use std::env;

pub struct AppState {
    pub dbconn: PgConnection,
}

pub fn get_url_querys(req: HttpRequest) -> QString {
    QString::from(req.query_string())
}

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}