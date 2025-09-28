
-- Without UUID as Primary key
CREATE TABLE students (
	id SERIAL PRIMARY KEY,
	uuid UUID NOT NULL,
	name TEXT NOT NULL
);

INSERT INTO students (uuid, name)
VALUES (gen_random_uuid(), 'Liis Miido');

INSERT INTO students (uuid, name)
VALUES (gen_random_uuid(), ('FirstName' || substr(md5(random()::text), 1, 10)));


CREATE TABLE students (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	data JSON NOT NULL
);

INSERT into students(data) VALUES('{
   "id": "e1b78696-cb86-448f-b1f0-20d3c8f0a3a2",
   "firstname": "Liis",
   "lastname": "miido",
   "studySets": [
     {
       "id": "e1b78696-cb86-448f-b1f0-20d3c8f0a3a2",
	   "title": "title",
       "description": "description",
       "flashcards": [
         {
           "front": "front",
           "back": "back"
         },
         {
           "front": "front",
           "back": "back"
         }
       ]
     },
	 {
       "id": "e1b78696-cb86-448f-b1f0-20d3c8f0a3a2",
	   "title": "title",
       "description": "description",
       "flashcards": [
         {
           "front": "front",
           "back": "back"
         },
         {
           "front": "front",
           "back": "back"
         }
       ]
     }
   ]
 }')



-- ############
WITH UUID as Primary key
CREATE TABLE students (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	firstname TEXT NOT NULL,
	lastname TEXT NOT NULL
);

INSERT INTO students (firstname, lastname)
 VALUES ((substr(md5(random()::text), 1, 10)), 'miido');

CREATE TABLE study_sets (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	student UUID REFERENCES students (id),
	title TEXT NOT NULL,
	description TEXT
);

INSERT INTO study_sets (student,title,description) VALUES ('a07c96e7-04ba-438a-aefc-f62f6003878e','title', 'description')



CREATE TABLE flashcards (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	study_set UUID REFERENCES study_sets (id),
	front TEXT NOT NULL,
	back TEXT NOT NULL
);

INSERT INTO flashcards (study_set,front,back) VALUES ('ced035cf-3227-4d9e-b5eb-a7c8ff4729f5','front', 'back')

