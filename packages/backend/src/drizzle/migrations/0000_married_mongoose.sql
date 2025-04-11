CREATE TABLE "receipt_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"receipt_id" integer NOT NULL,
	"name" text NOT NULL,
	"amount" integer DEFAULT 1 NOT NULL,
	"cost" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receipt" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_name" text NOT NULL,
	"store_phone" varchar(10) NOT NULL,
	"store_address" text NOT NULL,
	"store_website" text,
	"payment_method" text NOT NULL,
	"datetime" timestamp with time zone NOT NULL,
	"total_amount" real NOT NULL,
	"owner" integer
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"role" varchar(10) NOT NULL,
	"department" text NOT NULL,
	CONSTRAINT "user_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "receipt_item" ADD CONSTRAINT "receipt_item_receipt_id_receipt_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."receipt"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_owner_user_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;