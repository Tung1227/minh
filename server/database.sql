-- CREATE DATABASE webnhatro

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE account(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL ,
    user_password VARCHAR(255) NOT NULL,
    jwt_token VARCHAR(255) ,
    is_verify boolean DEFAULT 'false',
    account_type VARCHAR(10) DEFAULT 'user'
);

CREATE TABLE userInfo(
    info_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(255),
    first_name VARCHAR(255) ,
    last_name VARCHAR(255) ,
    city VARCHAR(255) ,
    district VARCHAR(255) ,
    street_address VARCHAR(10) ,
    avatar_img VARCHAR(255),
    user_id uuid NOT NULL,
    FOREIGN KEY(user_id) 
	  	REFERENCES account(user_id)
);


CREATE TABLE post(
    post_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    create_on TIMESTAMP,
    user_id uuid NOT NULL,
    FOREIGN KEY(user_id) 
	  	REFERENCES account(user_id)
);

CREATE TABLE detail_post(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id uuid,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    ward VARCHAR(50) NOT NULL,
    acreage VARCHAR(255),
    image_file text NOT NULL,
    price VARCHAR(255) NOT NULL,
    acreage VARCHAR(50),
    air_condition boolean DEFAULT 'false',
    washing boolean DEFAULT 'false',
    electric_price VARCHAR(50) NOT NULL,
    water_price VARCHAR(50) NOT NULL,
    CONSTRAINT fk_postdetail
      FOREIGN KEY(post_id) 
	  	REFERENCES post(post_id)
);

CREATE TABLE report(
    report_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    content VARCHAR(255) NOT NULl,
    post_id uuid NOT NULL,
    create_on TIMESTAMP,
    FOREIGN KEY(user_id) 
	  	REFERENCES account(user_id),
    FOREIGN KEY(post_id) 
	  	REFERENCES post(post_id)
);

--  https://github.com/ThangLeQuoc/vietnamese-provinces-database/blob/master/postgresql/CreateTables_vn_units.sql 
-- Việt Nam table unit

