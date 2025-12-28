CREATE TABLE `active_substances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `medications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`presentation` text NOT NULL,
	`expiration_year` integer NOT NULL,
	`expiration_month` integer NOT NULL,
	CONSTRAINT "valid_year" CHECK("medications"."expiration_year" >= 2000 AND "medications"."expiration_year" <= 2100),
	CONSTRAINT "valid_month" CHECK("medications"."expiration_month" >= 1 AND "medications"."expiration_month" <= 12)
);
--> statement-breakpoint
CREATE TABLE `medication_substances` (
	`medication_id` integer NOT NULL,
	`substance_id` integer NOT NULL,
	`concentration` text,
	PRIMARY KEY(`medication_id`, `substance_id`),
	FOREIGN KEY (`medication_id`) REFERENCES `medications`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`substance_id`) REFERENCES `active_substances`(`id`) ON UPDATE no action ON DELETE restrict
);
