PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_medication_substances` (
	`medication_id` integer NOT NULL,
	`substance_id` integer NOT NULL,
	`concentration` text,
	PRIMARY KEY(`medication_id`, `substance_id`),
	FOREIGN KEY (`medication_id`) REFERENCES `medications`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`substance_id`) REFERENCES `active_substances`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_medication_substances`("medication_id", "substance_id", "concentration") SELECT "medication_id", "substance_id", "concentration" FROM `medication_substances`;--> statement-breakpoint
DROP TABLE `medication_substances`;--> statement-breakpoint
ALTER TABLE `__new_medication_substances` RENAME TO `medication_substances`;--> statement-breakpoint
PRAGMA foreign_keys=ON;