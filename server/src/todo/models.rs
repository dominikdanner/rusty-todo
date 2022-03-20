extern crate serde;
use super::schema::*;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Queryable, Debug, Identifiable)]
#[primary_key(id)]
pub struct Todo {
    pub id: i32,
    pub title: String,
    pub description: String,
    pub done: bool,
}

#[derive(Deserialize, Insertable, Debug, Clone)]
#[table_name="todos"]
pub struct NewTodo {
    pub title: String,
    pub description: String,
    pub done: bool,
}