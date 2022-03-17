use actix_web::{web, delete, get, post, error, HttpRequest};
use diesel::prelude::*;
use derive_more::{Display, Error};
use serde::{Serialize, Deserialize};
use serde_json;

#[derive(Debug, Display, Error)]
pub enum Error {
  DbError,
}

impl error::ResponseError for Error {}

use crate::models;
use crate::lib::{AppState, get_url_querys};
use crate::schema::todos::dsl::*;

pub fn config(cfg: &mut web::ServiceConfig) {
  cfg.service(
    web::scope("/todo")
      .service(get_todo)
      .service(insert_todo)
      .service(delete_todo)
  );
}

#[get("/")]
async fn get_todo(req: HttpRequest, state: web::Data<AppState>) -> Result<String, Error> {
  let dbconn = &state.dbconn;
  let limit: i64 = get_url_querys(req)
    .get("limit")
    .unwrap_or("5")
    .parse::<i64>()
    .expect("Parsing `Limit` query failed");

  let result: Vec<models::Todo> = todos.limit(limit)
    .load::<models::Todo>(dbconn)
    .expect("Selecting Todo failed");

    Ok(serde_json::to_string(&result).unwrap())
}

#[post("/")]
async fn insert_todo(state: web::Data<AppState>, info: web::Json<models::NewTodo>) -> Result<String, Error> {
  let dbconn = &state.dbconn;

  diesel::insert_into(todos)
    .values(models::NewTodo {
      title: info.title.clone(),
      description: info.description.clone(),
      done: info.done.clone(),
    })
    .execute(dbconn)
    .expect("New Todo insertion failed");

  Ok(String::from("New Todo insertion successful"))
}

#[delete("/")]
async fn delete_todo(state: web::Data<AppState>, req: HttpRequest) -> Result<String, Error> {
  let dbconn = &state.dbconn;
  let todo_id: i32 = get_url_querys(req)
    .get("id").unwrap()
    .parse::<i32>()
    .expect("Parsing `Limit` query failed");

  diesel::delete(todos.filter(id.eq(todo_id))).execute(dbconn).unwrap();

  Ok(String::from("Deleted"))
}