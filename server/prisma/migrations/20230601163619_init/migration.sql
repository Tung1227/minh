-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_name" VARCHAR(255) NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "user_password" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "account" (
    "user_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_name" VARCHAR(255) NOT NULL,
    "user_email" VARCHAR(255) NOT NULL,
    "user_password" VARCHAR(255) NOT NULL,
    "jwt_token" VARCHAR(255) NOT NULL,
    "is_verify" BIT(1) DEFAULT (0)::bit(1),
    "account_type" VARCHAR(10) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "detail_post" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "post_id" UUID,
    "title" VARCHAR(255) NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "district" VARCHAR(50) NOT NULL,
    "ward" VARCHAR(50) NOT NULL,
    "image_file" VARCHAR(255) NOT NULL,
    "price" VARCHAR(255) NOT NULL,
    "acreage" VARCHAR(50) NOT NULL,
    "air_condition" BIT(1) DEFAULT (0)::bit(1),
    "washing" BIT(1) DEFAULT (0)::bit(1),
    "electric_price" VARCHAR(50) NOT NULL,
    "water_price" VARCHAR(50) NOT NULL,

    CONSTRAINT "detail_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "post_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "create_on" TIMESTAMP(6),

    CONSTRAINT "post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "report" (
    "report_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "post_id" UUID NOT NULL,
    "create_on" TIMESTAMP(6),

    CONSTRAINT "report_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "userinfo" (
    "info_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "phone_number" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "city" VARCHAR(255),
    "district" VARCHAR(255),
    "street_address" VARCHAR(10),
    "avatar_img" VARCHAR(255),
    "user_id" UUID NOT NULL,

    CONSTRAINT "userinfo_pkey" PRIMARY KEY ("info_id")
);

-- AddForeignKey
ALTER TABLE "detail_post" ADD CONSTRAINT "fk_postdetail" FOREIGN KEY ("post_id") REFERENCES "post"("post_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("post_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "account"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userinfo" ADD CONSTRAINT "userinfo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "account"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
