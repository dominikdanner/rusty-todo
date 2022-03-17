CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  done BOOLEAN NOT NULL DEFAULT 'f'
)