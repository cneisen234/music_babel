CREATE DATABASE "music_bable";

CREATE TABLE "user"
(
    "id" serial primary key,
    "username" varchar(15) not null,
    "password" varchar(100) not null,
    "profile_pic" text,
    "logged_in" TIMESTAMP
); 

CREATE TABLE "recommendation"
(
    "id" serial primary key,
    "user_id" INT REFERENCES "user",
    "song" varchar(255) not null,
    "artist" varchar(255) not null,
    "album" varchar(255) not null,
    "created_at" TIMESTAMP,
    "updated_at" TIMESTAMP
); 
