# Problem Cards — Workshop Hands-On Exercise

Print these as cards (A5 size). Attendees pick one and run a DDC cycle.

---

## Card 1: The Silent Failure

**Domain:** E-commerce order fulfillment

**Problem:**
Merchants are reporting that settlement batches are arriving 6 hours late. No errors in the dashboard. The operations team sees nothing wrong. Customer complaints are rising but monitoring shows all green.

**What makes this hard:**
The settlement service has a silent retry mechanism that backs off exponentially when an upstream service is slow. It never alerts — it just gets slower. The upstream service is a third-party KYC provider that throttles after a daily request limit.

---

## Card 2: The Config Change

**Domain:** Multi-market retail platform

**Problem:**
Customers in one market suddenly see no delivery options at checkout. Other markets are fine. No deployment happened. No errors in logs. Order counts look normal system-wide.

**What makes this hard:**
An operations team member modified a warehouse capacity template directly in production. The change created invalid configurations for certain delivery types in certain postal codes. Every system processed the bad data correctly — no errors, just wrong results.

---

## Card 3: The Knowledge Walk-Out

**Domain:** Healthcare claims processing

**Problem:**
A senior claims analyst left the company. Within two weeks, the team encounters 3 claim types they've never seen before. The rules engine rejects them with generic error codes. The documentation says "refer to analyst guidelines" but the guidelines are a 4-year-old PDF that doesn't cover these claim types.

**What makes this hard:**
The analyst had memorized 15+ payer-specific exception rules that were never documented. Some rules contradict each other and resolution depends on context that only existed in her head.

---

## Card 4: The Integration Mystery

**Domain:** SaaS platform with third-party integrations

**Problem:**
Your API returns 200 OK for every webhook delivery. But the partner system isn't processing half of them. Their logs show the payloads arriving. Your logs show successful delivery. Both teams say "it's working on our end."

**What makes this hard:**
The partner system validates a custom header that was added 2 years ago during a migration. Your system sends it for old-format payloads but not for the new format introduced 6 months ago. Nobody documented the header requirement because it was "temporary."

---

## Card 5: The Deployment Surprise

**Domain:** Microservices platform

**Problem:**
After a routine deployment of the order service, returns processing breaks in one channel but works fine in others. The deployment only changed a logging format. Rollback fixes it. Re-deploy breaks it again.

**What makes this hard:**
The returns service parses the order service's log output (not the API response) to extract a tracking ID — a workaround from a hackathon 18 months ago that nobody remembers. The log format change broke the regex.

---

## Instructions for Attendees

Pick a card. Then:

1. **Imagine you're the AI agent.** What would you attempt with zero domain knowledge?
2. **Write your demand checklist.** What specific knowledge would you need to solve this?
3. **Look at what you wrote.** Is ANY of that in typical documentation? Or is it tribal knowledge?
4. **That checklist IS the DDC output.** The gaps you identified are exactly what needs to be curated.

The insight: **you didn't need to document everything about the domain. The problem told you exactly what was missing.**
