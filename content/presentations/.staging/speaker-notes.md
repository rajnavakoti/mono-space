# AI Engineer Workshop — Speaker Script & Production Notes

## Timing Guide

| Time | Slide | Section | Duration |
|------|-------|---------|----------|
| 0:00 | 1 | Title + welcome | 2 min |
| 0:02 | 2 | Act 1 transition | 30 sec |
| 0:03 | 3 | The Knowledge (cab drivers) | 3 min |
| 0:06 | 4 | What every team does instead | 3 min |
| 0:09 | 5 | Meet LEO | 3 min |
| 0:12 | 6 | LEO's first day (Billy bookcase) | 2 min |
| 0:14 | 7 | Jira tickets (green/red) | 4 min |
| 0:18 | 8 | What I tried (4 attempts) | 5 min |
| 0:23 | 9 | Plot twist — it's me | 2 min |
| 0:25 | 10 | Context engineering gap | 3 min |
| 0:28 | 11 | Act 2 transition | 30 sec |
| 0:29 | 12 | TDD parallel | 3 min |
| 0:32 | 13 | One DDC cycle explained | 3 min |
| 0:35 | 14-15 | TMUX live DDC cycle | 10 min |
| 0:45 | 16 | 20 cycles later | 3 min |
| 0:48 | 17 | TMUX 20-cycle evidence | 5 min |
| 0:53 | 18 | The honest bit | 3 min |
| 0:56 | 19 | What if automated? | 3 min |
| 0:59 | 20 | Act 3 transition | 30 sec |
| 1:00 | 21-22 | Scanner live demo | 12 min |
| 1:12 | 23 | BREAK | 10 min |
| 1:22 | 24 | Act 4 transition | 30 sec |
| 1:23 | 25 | Context lake | 4 min |
| 1:27 | 26 | Entity format | 3 min |
| 1:30 | 27 | Meta model / store map | 3 min |
| 1:33 | 28 | Act 5 transition | 30 sec |
| 1:34 | 29-30 | Hands-on session | 15 min |
| 1:49 | 31 | Act 6 transition | 30 sec |
| 1:50 | 32 | What value it created | 4 min |
| 1:54 | 33 | Where it breaks | 3 min |
| 1:57 | 34 | The positioning | 2 min |
| 1:59 | 35 | What you take home | 2 min |
| 2:01 | 36 | Thank you | 1 min |
| 2:02 | 37 | Q&A | 10 min |

**Total: ~2h 12min** — cut hands-on to 10 min if running over.

---

## Key Moments to Nail

### 1. The Jira Tickets Slide (slide 7)
This is your visual proof. The green/red highlighting must be clear on the projector. If you can't do colored text, use VISIBLE vs ████ redacted blocks. The audience should instantly see: "the redacted parts are the hard parts."

### 2. The Plot Twist (slide 9)
Pause after "It's me." Let it land. Don't rush to the next point. This is the moment the audience shifts from "cool agent talk" to "this is about the human problem."

### 3. The Live DDC Cycle (slide 15)
Have a backup. If tmux breaks, if the API is slow, if anything goes wrong — have screenshots of the cycle ready to show. Never depend entirely on a live demo.

### 4. The Honest Bit (slide 18)
This is what makes you credible. Don't rush through it. "By cycle 15, I was questioning my life choices" — the audience will laugh because they recognize the pain. That laughter is trust.

### 5. The Scanner Demo (slide 22)
Pre-run 3 domains before the workshop. Have screenshots. If someone from the audience wants to try their domain live — let them. That's the best possible outcome. But have a fallback ready.

---

## Audience Interaction Points

- **Slide 1:** "Show of hands — how many have built an AI agent for your company?"
- **Slide 3:** "How many of you have been to London?"
- **Slide 4:** "Show of hands — who's been in that room arguing over what the agent needs to know?"
- **Slide 6:** "How many of you have built IKEA furniture?"
- **Slide 12:** "Has anyone here practiced TDD?"
- **Slide 22:** "Who wants to try with their own domain?"
- **Slide 37:** "What did I get wrong? What would you do differently?"

Aim for audience interaction every 8-10 minutes. If the room is quiet, ask directed questions: "You in the front — what domain does your company operate in?"

---

## Demo Fallback Plan

| Demo | Primary | Backup |
|------|---------|--------|
| Live DDC cycle | Tmux, real API call | Pre-recorded screencast or screenshots |
| 20-cycle evidence | Tmux, pre-done results | Side-by-side screenshots on slides |
| Scanner | Live browser, real API | Pre-run screenshots with results |
| Audience scanner | Live, audience input | You type a generic domain live |

**Rule: never spend more than 60 seconds debugging a broken demo on stage. Switch to backup.**

---

## What to Bring

- [ ] Laptop with tmux set up
- [ ] Scanner deployed and tested (run it 30 min before the workshop)
- [ ] API key with credits loaded ($5 minimum)
- [ ] Backup screenshots of all demos (on a USB stick too)
- [ ] Problem cards printed (10-15 copies)
- [ ] Water bottle
- [ ] Phone on silent
