# Data Model

## Entities

### Medication
An item in your inventory with a commercial name, presentation (pill, syrup, nasal spray, etc.), and expiration date. Either you have it or you don't — no quantity tracking.

### ActiveSubstance
The actual drug compound (e.g., ibuprofen, acetaminophen). Multiple medications may contain the same active substance under different brand names.

### User
A person with an account who can view and manage the medication inventory.

## Relationships

- Medication can contain many ActiveSubstances
- ActiveSubstance can be in many Medications
- User can manage all Medications (single shared inventory)
