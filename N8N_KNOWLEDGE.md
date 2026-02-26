# n8n Knowledge Base

**Purpose:** Reference guide for building automations with n8n  
**Created:** 2026-02-26  
**Category:** Research

---

## 🎯 What is n8n?

n8n is a **free, open-source workflow automation tool**. It lets you:
- Connect APIs and services
- Automate repetitive tasks
- Build complex workflows without coding
- Self-host or use cloud version

---

## 🔑 Key Concepts

### Nodes
Nodes are building blocks. Each node performs a specific action:
- **Trigger Nodes** — Start workflows (Webhooks, Cron, RSS, etc.)
- **Action Nodes** — Do something (HTTP Request, Slack, Gmail, etc.)
- **Logic Nodes** — Control flow (IF, Switch, Merge, etc.)

### Connections
Nodes connect via **ports**:
- **Main input** (left) → receives data
- **Main output** (right) → sends data
- **Additional outputs** → for branching (Error, Always)

### Data Flow
- n8n uses **JSON** internally
- Data passes between nodes
- Use **Item Lists** node for arrays
- **Expressions** for dynamic values

---

## 📦 Essential Nodes

### Triggers
| Node | Use Case |
|------|----------|
| **Webhook** | Receive HTTP requests |
| **Cron** | Schedule workflows (time-based) |
| **RSS Read** | Monitor RSS feeds |
| **IMAP** | Watch email inbox |
| **Slack** | Listen for commands/events |

### Actions
| Node | Use Case |
|------|----------|
| **HTTP Request** | Call any API |
| **Slack** | Send messages, channels |
| **Gmail** | Send emails |
| **Google Sheets** | Read/write spreadsheets |
| **Discord** | Send webhooks |
| **Telegram** | Send messages |
| **Airtable** | Database operations |

### Logic
| Node | Use Case |
|------|----------|
| **IF** | Conditional branching |
| **Switch** | Multi-branch logic |
| **Merge** | Combine data streams |
| **Split In Batches** | Loop over items |
| **Loop Over Items** | Process arrays |
| **Wait** | Pause workflow |
| **Error Trigger** | Handle errors |

---

## 🔧 Common Patterns

### 1. Webhook → Process → Respond
```
Webhook → IF → HTTP Request (process) → Respond to Webhook
```

### 2. Schedule → Fetch → Transform → Store
```
Cron → HTTP Request → Set → Google Sheets
```

### 3. Watch → Filter → Action
```
IMAP (new email) → IF (filter) → Slack (notify)
```

### 4. API Chain
```
Webhook → HTTP 1 → HTTP 2 → HTTP 3 → Respond
```

---

## 💡 Pro Tips

### Expressions
- Use `{{ }}` for dynamic values
- Access node data: `{{ $json.property }}`
- Access previous node: `{{ $('Node Name').json.property }}`
- Functions: `{{ $now.format('YYYY-MM-DD') }}`

### Error Handling
- Connect "Error" output to error handler
- Use **Continue On Fail** for non-critical errors
- Set **Retry On Fail** for temporary failures
- Use **Error Trigger** node for centralized error handling

### Performance
- Use **Split In Batches** for large datasets
- Enable **Batch Size** for API limits
- Disable nodes when not needed
- Use **Disable / Enable** instead of delete

### Debugging
- Use **Code** node with `console.log()` 
- Check **Execution Data** in workflow
- Use **Manual** trigger for testing
- Enable **Saved Executions** for debugging

---

## 🌐 Popular Integrations

### Communication
- Slack, Discord, Telegram, Microsoft Teams
- Gmail, Email (SMTP)
- SMS (Twilio), WhatsApp

### Databases
- MySQL, PostgreSQL, MongoDB
- Airtable, Google Sheets
- Notion

### Marketing
- Mailchimp, ConvertKit
- HubSpot, Salesforce
- WordPress

### AI
- OpenAI (GPT)
- Anthropic (Claude)
- Google AI, Azure AI

### Social
- Twitter/X, LinkedIn
- Instagram, Facebook

---

## 🔗 Useful Resources

- **Docs:** https://docs.n8n.io
- **Forum:** https://community.n8n.io
- **Templates:** https://n8n.io/workflows/
- **Blog:** https://n8n.io/blog/

---

## 🤖 Atlas's n8n Expertise

This knowledge base helps me:
1. **Build workflows** from scratch
2. **Debug issues** in existing automations
3. **Suggest integrations** for your needs
4. **Optimize** workflows for performance
5. **Handle errors** properly

**To request an automation:**
1. Describe the goal
2. List the apps/services involved
3. Specify triggers and actions
4. I'll design and build it!

---

*Last updated: 2026-02-26*
