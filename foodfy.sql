
CREATE TABLE "chefs" (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    file_id integer
);

CREATE TABLE "files" (
    id integer NOT NULL,
    name text,
    path text NOT NULL
);

CREATE TABLE "recipes" (
    id integer NOT NULL,
    chef_id integer NOT NULL,
    title text NOT NULL,
    ingredients text[],
    preparation text[],
    information text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone DEFAULT now(),
    user_id integer
);

CREATE TABLE "recipe_files" (
    id integer NOT NULL,
    recipe_id integer,
    file_id integer
);

CREATE TABLE "users" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    reset_token text,
    reset_token_expires text,
    is_admin boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE "session" (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE ONLY "chefs"
    ADD CONSTRAINT chefs_pkey PRIMARY KEY (id);


ALTER TABLE ONLY "files"
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);

    
ALTER TABLE ONLY "recipes"
    ADD CONSTRAINT receipts_pkey PRIMARY KEY (id);

    
ALTER TABLE ONLY "recipe_files"
    ADD CONSTRAINT recipe_files_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "session"
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);

ALTER TABLE ONLY "users"
    ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE ONLY "users"
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


ALTER TABLE ONLY "chefs"
    ADD CONSTRAINT chefs_file_id_fkey FOREIGN KEY (file_id) REFERENCES files(id);



ALTER TABLE ONLY "recipe_files"
    ADD CONSTRAINT recipe_files_file_id_fkey FOREIGN KEY (file_id) REFERENCES files(id);

ALTER TABLE ONLY "recipe_files"
    ADD CONSTRAINT recipe_files_recipe_fkey FOREIGN KEY (recipe_id) REFERENCES recipes(id);


ALTER TABLE ONLY "recipes"
    ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE FUNCTION trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN

	NEW.updated_at = NOW();
  RETURN NEW;

END;



$$;

CREATE TRIGGER set_timestamp BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

