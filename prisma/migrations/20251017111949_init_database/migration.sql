-- CreateTable
CREATE TABLE "users" (
    "id" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "role" VARCHAR NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" BIGINT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "candidate_needed" BIGINT NOT NULL,
    "job_type" VARCHAR,
    "status" TEXT DEFAULT 'draft',
    "salary_min" BIGINT,
    "salary_max" BIGINT,
    "currency" TEXT DEFAULT 'IDR',
    "created_by" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_configurations" (
    "id" BIGINT NOT NULL,
    "job_id" BIGINT NOT NULL,
    "field_key" VARCHAR NOT NULL,
    "label" VARCHAR NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "job_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "job_id" BIGINT NOT NULL,
    "applied_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT DEFAULT 'submitted',

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_attributes" (
    "id" BIGINT NOT NULL,
    "candidate_id" BIGINT NOT NULL,
    "key" VARCHAR NOT NULL,
    "label" VARCHAR,
    "value" TEXT,
    "order_index" INTEGER,

    CONSTRAINT "candidate_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" BIGINT NOT NULL,
    "candidate_id" BIGINT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "gesture_detected" VARCHAR,
    "captured_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_slug_key" ON "jobs"("slug");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_configurations" ADD CONSTRAINT "job_configurations_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_attributes" ADD CONSTRAINT "candidate_attributes_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
