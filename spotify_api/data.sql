-- database name
CREATE DATABASE "music_babel";

--to create user
CREATE TABLE "user"
(
    "id" serial primary key,
    "username" varchar(15) not null,
    "password" varchar(100) not null,
    "profile_pic" text,
    "logged_in" TIMESTAMP
); 
--to create recommendation
CREATE TABLE "recommendation"
(
    "id" serial primary key,
    "user_id" INT REFERENCES "user",
    "username" varchar(15),
    "profile_pic" TEXT,
    "song" varchar(255) not null,
    "artist" varchar(255) not null,
    "album" varchar(255) not null,
    "created_at" TIMESTAMP,
    "updated_at" TIMESTAMP
); 
--sample insert value for recommendation for testing purposes
INSERT INTO "recommendation"
    ("song", "artist", "album")
VALUES
    ('Settle', 'Two Door Cinema Club', 'Beacon');

    --to create rate table
CREATE TABLE "rate"
(
    "id" serial primary key,
    "rate_id" INT REFERENCES "recommendation" ON DELETE CASCADE,
    "rate" INT,
    "created_at" TIMESTAMP,
    "updated_at" TIMESTAMP
); 


--to create comment table
CREATE TABLE "comment"
(
    "id" serial primary key,
    "comment_id" INT REFERENCES "recommendation" ON DELETE CASCADE,
    "usercomment" varchar(20),
    "comment" TEXT,
    "created_at" TIMESTAMP,
    "updated_at" TIMESTAMP
); 
