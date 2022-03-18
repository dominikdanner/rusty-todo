use actix_web::{web, delete, put, get, post, error, HttpRequest};
use diesel::prelude::*;
use derive_more::{Display, Error};
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
      .service(get_todo_by_id)
      .service(insert_todo)
      .service(update_todo)
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
    .unwrap_or(vec![])
    .into_iter()
    .rev()
    .collect();

    Ok(serde_json::to_string(&result).unwrap())
}

#[get("/{id}")]
async fn get_todo_by_id(state: web::Data<AppState>, path: web::Path<i32>) -> Result<String, Error> {
  let dbconn = &state.dbconn;
  let todo_id = path.into_inner();

  let result: Vec<models::Todo> = todos.filter(id.eq(todo_id))
    .load::<models::Todo>(dbconn)
    .expect("Selecting Todo failed");

    Ok(serde_json::to_string(&result[0]).unwrap())
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

  Ok(String::from("Inserted"))
}

#[put("/{id}")]
async fn update_todo(state: web::Data<AppState>, info: web::Json<models::NewTodo>, path: web::Path<i32>) -> Result<String, Error> {
  let dbconn = &state.dbconn;
  let todo_id = path.into_inner();

  let target = todos.filter(id.eq(todo_id));

  diesel::update(target).set((
    title.eq(&info.title), 
    description.eq(&info.description),
  )).execute(dbconn).unwrap();

  Ok(String::from("Updated"))
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