# Taskboard UI Analysis Report

**Date:** 2026-02-26
**Analyst:** Atlas

---

## Current Features
- 5 columns: New → Queued → In Progress → Review → Done
- Drag & drop between columns
- Assignee system (Atlas/Jarno)
- Priority indicators (colored dots)
- Category labels
- Auto-refresh every 5 seconds
- Custom confirmation dialog for delete
- Fade-in animations
- Responsive design

---

## Issues Identified

### 1. UI/Visual
- [ ] Column headers could be more prominent
- [ ] Task cards feel a bit cramped
- [ ] No visual distinction when hovering over columns
- [ ] Status dropdowns are small and hard to tap on mobile

### 2. Interactions
- [ ] No keyboard shortcuts
- [ ] Can't reorder tasks within a column (only drag between columns)
- [ ] No quick-add from column header
- [ ] No due date support

### 3. Data/Organization
- [ ] No description field visible on cards
- [ ] Can't filter by assignee
- [ ] Can't search tasks
- [ ] No tags/categories visible in UI (stored but not displayed)

### 4. Polish
- [ ] Loading state could be a skeleton/spinner
- [ ] No empty state illustrations
- [ ] Delete animation could be smoother

---

## Suggested Improvements (Priority Order)

### High Priority
1. **Filter by assignee** — Quick toggle to show only "My tasks" or "Jarno's tasks"
2. **Search tasks** — Find tasks quickly
3. **Better mobile experience** — Larger tap targets for status/assignee dropdowns

### Medium Priority
4. **Show description on cards** — Expand card or show preview
5. **Keyboard shortcuts** — 'n' for new task, arrows to navigate
6. **Column reordering** — Drag to reorder within column

### Low Priority
7. **Due dates** — Add optional due date field
8. **Custom card colors** — Color-code by category
9. **Dark mode toggle** — Already have dark, but could add theme switch

---

## Notes
- The board is functional and clean
- Core workflow (drag & drop, assign, status) works well
- Auto-refresh is a nice touch
- Redis backend is working smoothly

---

*End of report*
