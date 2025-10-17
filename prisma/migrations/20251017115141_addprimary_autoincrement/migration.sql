-- AlterTable
CREATE SEQUENCE candidate_attributes_id_seq;
ALTER TABLE "candidate_attributes" ALTER COLUMN "id" SET DEFAULT nextval('candidate_attributes_id_seq');
ALTER SEQUENCE candidate_attributes_id_seq OWNED BY "candidate_attributes"."id";

-- AlterTable
CREATE SEQUENCE candidates_id_seq;
ALTER TABLE "candidates" ALTER COLUMN "id" SET DEFAULT nextval('candidates_id_seq');
ALTER SEQUENCE candidates_id_seq OWNED BY "candidates"."id";

-- AlterTable
CREATE SEQUENCE job_configurations_id_seq;
ALTER TABLE "job_configurations" ALTER COLUMN "id" SET DEFAULT nextval('job_configurations_id_seq');
ALTER SEQUENCE job_configurations_id_seq OWNED BY "job_configurations"."id";

-- AlterTable
CREATE SEQUENCE jobs_id_seq;
ALTER TABLE "jobs" ALTER COLUMN "id" SET DEFAULT nextval('jobs_id_seq');
ALTER SEQUENCE jobs_id_seq OWNED BY "jobs"."id";

-- AlterTable
CREATE SEQUENCE photos_id_seq;
ALTER TABLE "photos" ALTER COLUMN "id" SET DEFAULT nextval('photos_id_seq');
ALTER SEQUENCE photos_id_seq OWNED BY "photos"."id";

-- AlterTable
CREATE SEQUENCE users_id_seq;
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq');
ALTER SEQUENCE users_id_seq OWNED BY "users"."id";
