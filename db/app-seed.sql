-- both test users have the password "password"

INSERT INTO users (username, password)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q'
        ),
       ('testuser2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q'
        );

INSERT INTO albums  (album_title, user_username)
  VALUES 
    ("album 1", "testuser"),
    ("album 2", "testuser"),
    ("album 3", "testuser2")

INSERT INTO photos (photo_url, album_id)
  VALUES 
    ("room1.jpg", 1),
    ("room2.jpg",2)



