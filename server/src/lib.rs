use diesel::PgConnection;
use actix_web::{HttpRequest};
use qstring::QString;

pub struct AppState {
    pub dbconn: PgConnection,
}

pub fn get_url_querys(req: HttpRequest) -> QString {
    QString::from(req.query_string())
}