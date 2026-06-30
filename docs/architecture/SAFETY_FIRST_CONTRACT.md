# Safety First Contract

Every AI-facing or user-reflective endpoint must call:

```text
route_safety_first(user_id, text, source_module)
```

If risk is high or imminent:

- Block normal flow.
- Create safety flag.
- Emit crisis risk event.
- Return crisis triage route.

Risk categories:

- self-harm
- suicide
- violence
- abuse
- coercion
- spiritual abuse
- unsafe reconciliation pressure
- medical emergency
- crisis despair

Safety flows must soft-fail open: billing, plan limits, or usage limits must never block crisis routing.
