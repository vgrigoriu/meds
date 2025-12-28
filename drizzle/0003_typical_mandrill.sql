PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_medications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`presentation` text NOT NULL,
	`expiration_year` integer NOT NULL,
	`expiration_month` integer NOT NULL,
	`deleted` integer,
	CONSTRAINT "valid_year" CHECK("__new_medications"."expiration_year" >= 2000 AND "__new_medications"."expiration_year" <= 2100),
	CONSTRAINT "valid_month" CHECK("__new_medications"."expiration_month" >= 1 AND "__new_medications"."expiration_month" <= 12),
	CONSTRAINT "valid_presentation" CHECK("__new_medications"."presentation" IN ('pill', 'syrup', 'spray', 'cream', 'drops', 'other'))
);
--> statement-breakpoint
INSERT INTO `__new_medications`("id", "name", "presentation", "expiration_year", "expiration_month", "deleted") SELECT "id", "name", "presentation", "expiration_year", "expiration_month", "deleted" FROM `medications`;--> statement-breakpoint
DROP TABLE `medications`;--> statement-breakpoint
ALTER TABLE `__new_medications` RENAME TO `medications`;--> statement-breakpoint
PRAGMA foreign_keys=ON;