--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

-- Started on 2020-05-25 17:35:07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 213 (class 1255 OID 65551)
-- Name: trigger_set_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

BEGIN

	NEW.updated_at = NOW();
  RETURN NEW;

END;



$$;


ALTER FUNCTION public.trigger_set_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 205 (class 1259 OID 24587)
-- Name: chefs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chefs (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    file_id integer
);


ALTER TABLE public.chefs OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 24585)
-- Name: chefs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chefs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chefs_id_seq OWNER TO postgres;

--
-- TOC entry 2892 (class 0 OID 0)
-- Dependencies: 204
-- Name: chefs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chefs_id_seq OWNED BY public.chefs.id;


--
-- TOC entry 207 (class 1259 OID 49162)
-- Name: files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.files (
    id integer NOT NULL,
    name text,
    path text NOT NULL
);


ALTER TABLE public.files OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 49160)
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.files_id_seq OWNER TO postgres;

--
-- TOC entry 2893 (class 0 OID 0)
-- Dependencies: 206
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- TOC entry 203 (class 1259 OID 24579)
-- Name: recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipes (
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


ALTER TABLE public.recipes OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 24577)
-- Name: receipts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.receipts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.receipts_id_seq OWNER TO postgres;

--
-- TOC entry 2894 (class 0 OID 0)
-- Dependencies: 202
-- Name: receipts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.receipts_id_seq OWNED BY public.recipes.id;


--
-- TOC entry 209 (class 1259 OID 57444)
-- Name: recipe_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe_files (
    id integer NOT NULL,
    recipe_id integer,
    file_id integer
);


ALTER TABLE public.recipe_files OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 57442)
-- Name: recipe_files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recipe_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recipe_files_id_seq OWNER TO postgres;

--
-- TOC entry 2895 (class 0 OID 0)
-- Dependencies: 208
-- Name: recipe_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recipe_files_id_seq OWNED BY public.recipe_files.id;


--
-- TOC entry 212 (class 1259 OID 73789)
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 73767)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
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


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 73765)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 2896 (class 0 OID 0)
-- Dependencies: 210
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2723 (class 2604 OID 24590)
-- Name: chefs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chefs ALTER COLUMN id SET DEFAULT nextval('public.chefs_id_seq'::regclass);


--
-- TOC entry 2724 (class 2604 OID 49165)
-- Name: files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- TOC entry 2725 (class 2604 OID 57447)
-- Name: recipe_files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_files ALTER COLUMN id SET DEFAULT nextval('public.recipe_files_id_seq'::regclass);


--
-- TOC entry 2721 (class 2604 OID 24582)
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.receipts_id_seq'::regclass);


--
-- TOC entry 2726 (class 2604 OID 73770)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2879 (class 0 OID 24587)
-- Dependencies: 205
-- Data for Name: chefs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chefs (id, name, created_at, file_id) FROM stdin;
\.


--
-- TOC entry 2881 (class 0 OID 49162)
-- Dependencies: 207
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.files (id, name, path) FROM stdin;
\.


--
-- TOC entry 2883 (class 0 OID 57444)
-- Dependencies: 209
-- Data for Name: recipe_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipe_files (id, recipe_id, file_id) FROM stdin;
\.


--
-- TOC entry 2877 (class 0 OID 24579)
-- Dependencies: 203
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipes (id, chef_id, title, ingredients, preparation, information, created_at, updated_at, user_id) FROM stdin;
\.


--
-- TOC entry 2886 (class 0 OID 73789)
-- Dependencies: 212
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
\.


--
-- TOC entry 2885 (class 0 OID 73767)
-- Dependencies: 211
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, reset_token, reset_token_expires, is_admin, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 2897 (class 0 OID 0)
-- Dependencies: 204
-- Name: chefs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chefs_id_seq', 35, true);


--
-- TOC entry 2898 (class 0 OID 0)
-- Dependencies: 206
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.files_id_seq', 1184, true);


--
-- TOC entry 2899 (class 0 OID 0)
-- Dependencies: 202
-- Name: receipts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receipts_id_seq', 736, true);


--
-- TOC entry 2900 (class 0 OID 0)
-- Dependencies: 208
-- Name: recipe_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recipe_files_id_seq', 604, true);


--
-- TOC entry 2901 (class 0 OID 0)
-- Dependencies: 210
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 214, true);


--
-- TOC entry 2733 (class 2606 OID 24592)
-- Name: chefs chefs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chefs
    ADD CONSTRAINT chefs_pkey PRIMARY KEY (id);


--
-- TOC entry 2735 (class 2606 OID 49170)
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- TOC entry 2731 (class 2606 OID 24584)
-- Name: recipes receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT receipts_pkey PRIMARY KEY (id);


--
-- TOC entry 2737 (class 2606 OID 57449)
-- Name: recipe_files recipe_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_files
    ADD CONSTRAINT recipe_files_pkey PRIMARY KEY (id);


--
-- TOC entry 2743 (class 2606 OID 73796)
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 2739 (class 2606 OID 73780)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 2741 (class 2606 OID 73778)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2748 (class 2620 OID 65553)
-- Name: recipes set_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.recipes FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- TOC entry 2749 (class 2620 OID 73788)
-- Name: users set_timestamp_users; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- TOC entry 2745 (class 2606 OID 57460)
-- Name: chefs chefs_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chefs
    ADD CONSTRAINT chefs_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id);


--
-- TOC entry 2746 (class 2606 OID 81996)
-- Name: recipe_files recipe_files_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_files
    ADD CONSTRAINT recipe_files_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id);


--
-- TOC entry 2747 (class 2606 OID 82011)
-- Name: recipe_files recipe_files_recipe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe_files
    ADD CONSTRAINT recipe_files_recipe_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id);


--
-- TOC entry 2744 (class 2606 OID 81981)
-- Name: recipes recipes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2020-05-25 17:35:07

--
-- PostgreSQL database dump complete
--

