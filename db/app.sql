\echo 'Delete and recreate photo-app db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE photo-app;
CREATE DATABASE photo-app;
\connect photo-app

\i app-schema.sql
\i app-seed.sql

\echo 'Delete and recreate photo-app_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE photo-app_test;
CREATE DATABASE photo-app_test;
\connect photo-app_test

\i app-schema.sql
