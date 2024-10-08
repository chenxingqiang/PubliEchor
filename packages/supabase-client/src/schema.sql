-- Create users table
CREATE TABLE USERS (
    ID UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    EMAIL TEXT UNIQUE NOT NULL,
    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create search_queries table
CREATE TABLE SEARCH_QUERIES (
    ID UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    USER_ID UUID REFERENCES USERS(ID),
    QUERY TEXT NOT NULL,
    OPTIMIZED_QUERY TEXT,
    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create search_results table
CREATE TABLE SEARCH_RESULTS (
    ID UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    QUERY_ID UUID REFERENCES SEARCH_QUERIES(ID),
    TITLE TEXT NOT NULL,
    AUTHORS TEXT[],
    ABSTRACT TEXT,
    URL TEXT,
    PUBLISHED_YEAR INTEGER,
    CITATION_COUNT INTEGER,
    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create author_relationships table
CREATE TABLE AUTHOR_RELATIONSHIPS (
    ID UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    AUTHOR1 TEXT NOT NULL,
    AUTHOR2 TEXT NOT NULL,
    CO_AUTHORED_COUNT INTEGER DEFAULT 1,
    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_settings table
CREATE TABLE USER_SETTINGS (
    USER_ID UUID PRIMARY KEY REFERENCES USERS(ID),
    DEFAULT_SEARCH_COUNT INTEGER DEFAULT 10,
    MIN_YEAR INTEGER,
    MAX_YEAR INTEGER,
    PREFERRED_LANGUAGES TEXT[],
    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create RLS policies
ALTER TABLE USERS ENABLE ROW LEVEL SECURITY;

ALTER TABLE SEARCH_QUERIES ENABLE ROW LEVEL SECURITY;

ALTER TABLE SEARCH_RESULTS ENABLE ROW LEVEL SECURITY;

ALTER TABLE AUTHOR_RELATIONSHIPS ENABLE ROW LEVEL SECURITY;

ALTER TABLE USER_SETTINGS ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only access their own data" ON USERS
  FOR ALL USING (AUTH.UID() = ID);

CREATE POLICY "Users can only access their own search queries" ON SEARCH_QUERIES
  FOR ALL USING (AUTH.UID() = USER_ID);

CREATE POLICY "Users can only access their own search results" ON SEARCH_RESULTS
  FOR ALL USING (AUTH.UID() = (
    SELECT
                                             USER_ID
    FROM
                                             SEARCH_QUERIES
    WHERE
                                             ID = SEARCH_RESULTS.QUERY_ID
));

CREATE POLICY "All users can access author relationships" ON AUTHOR_RELATIONSHIPS
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can only access their own settings" ON USER_SETTINGS
  FOR ALL USING (AUTH.UID() = USER_ID);