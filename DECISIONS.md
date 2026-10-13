# DECISIONS — locked product and engineering choices

| ID | Decision | Reason / constraint |
|---|---|---|
| D-001 | Product name **Groove '66**; Android portrait-first | Matches reference branding |
| D-002 | Approved four-phone poster is the visual master | Avoid visual drift from vibe coding |
| D-003 | Keep **Discover, Records, Favorites, Search** on bottom bar | Exactly matches 3 visible reference tabs + Search; player is separate |
| D-004 | **Now Playing** is a full-screen view, never a fifth tab | Reference player has independent dark-wood composition |
| D-005 | Warm cream UI surfaces; dark wood reserved for full player | Reference contrast/hierarchy |
| D-006 | Rebuild art with original assets; no screenshot backgrounds or unlicensed album covers | Editable UI, lawful distribution |
| D-007 | Expo + TypeScript; preserve current SDK until tested migration | Reduce compatibility risk |
| D-008 | UI fidelity before actual playback; label simulated controls | Honest milestones and faster iteration |
| D-009 | Favor local device/library; backend optional and out of MVP | Personal music player simplicity |
| D-010 | Use real Android device screenshots as fidelity gates | A rendered concept is not actual layout code |
| D-011 | Mini-player appears only with an active/selected track, not in initial static reference state | Keeps first three screens matching master |
| D-012 | No ad placements, sign-in gate, or subscription UI | Not present in visual reference |
| D-013 | Source titles/cover art in reference are illustrative, not bundled media rights | Avoid misrepresenting commercial content |
