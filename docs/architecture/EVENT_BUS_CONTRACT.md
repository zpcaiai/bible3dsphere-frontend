# Event Bus Contract

Every significant module action emits a `formation_event`.

Required categories:

- scripture
- prayer
- virtue
- vice
- habit
- worldview
- suffering
- crisis
- healing
- community
- calling
- bible
- doctrine
- ai_tutor
- analytics
- billing
- admin
- ops

Event shape:

```json
{
  "user_id": "uuid",
  "event_type": "gift_assessment_completed",
  "event_category": "calling",
  "source_module": "gift_calling",
  "source_entity_id": "uuid",
  "payload": {},
  "created_at": "timestamp"
}
```

Outbox events are used for async processing, audit, analytics aggregation, and notification hooks.
