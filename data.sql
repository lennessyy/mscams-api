-- CREATE TYPE user_type AS ENUM ('student', 'club', 'admin');

CREATE TABLE public.users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text,
    last_name text,
    email text UNIQUE,
    category user_type,
    balance integer
);

CREATE TYPE application_type AS ENUM ('club', 'pdf');
CREATE TYPE application_status as ENUM ('open', 'approved', 'rejected')

CREATE TABLE public.applications(
    category application_type NOT NULL,
    id SERIAL PRIMARY KEY,
    event text NOT NULL,
    event_date text NOT NULL,
    amount integer NOT NULL,
    description text NOT NULL,
    budget text NOT NULL,
    applicant text REFERENCES users(username),
    status application_status NOT NULL DEFAULT 'open',
    submitted_at TIMESTAMP without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.votes(
    application_id integer REFERENCES applications(id),
    vote boolean NOT NULL,
    voter text REFERENCES users(username),
    PRIMARY KEY (application_id, voter)
);