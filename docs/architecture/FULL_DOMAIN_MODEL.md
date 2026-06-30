# Full Domain Model

This document maps the complete Spiritual Planet platform across all 13 batches and 52 skills.

## Identity And Tenant Core

- `app_users`
- `user_preferences`
- `organizations`
- `organization_memberships`
- `organization_roles`
- `organization_permissions`
- `user_consent_scopes`

## Formation Core

- `formation_sessions`
- `formation_events`
- `module_registry`
- `skill_registry`
- `cross_module_links`
- `shared_safety_flags`
- `system_events_outbox`

## Module Domains

- Scripture Formation: lectio, memory, examen, confession, repentance.
- Prayer Communion: prayer rules, sessions, intercession, Psalm prayer, presence.
- Virtue and Vice: virtues, vices, temptation, failure reviews, fruit.
- Holy Habit: Rule of Life, habits, Sabbath, fasting, simplicity.
- Worldview: beliefs, idols, gospel reframing, discernment.
- Suffering Care: reflections, crisis assessments, safety plans, healing journeys, pastoral care.
- Community Discipleship: paths, groups, mentors, church rhythms.
- Gift Calling Mission: gifts, calling, ministry matches, mission life.
- Bible Doctrine: characters, relationships, events, places, themes, timeline, doctrine, apologetics.
- AI Formation Agent: sessions, daily plans, weekly reviews, profile, memory, recommendations, tutor conversations.
- Analytics: metrics, timeline events, reports, audit events.
- Productization: plans, entitlements, subscriptions, usage meters, admin console, moderation, ops.

## Global Rules

- Safety before formation.
- Consent before sharing.
- Grace before metrics.
- Human care before AI care in crisis.
- Crisis routing remains available regardless of billing state.
