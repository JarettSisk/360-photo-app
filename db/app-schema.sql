

CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL
);

CREATE TABLE albums (
  id SERIAL PRIMARY KEY,
  album_title TEXT NOT NULL,
  FOREIGN KEY (user_username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  photo_url TEXT NOT NULL,
  FOREIGN KEY (album_id) REFERENCES album(id) ON DELETE CASCADE
)
