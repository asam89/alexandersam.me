<template>
  <div class="bg-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center space-x-4 mb-4">
        <h2 class="text-3xl font-bold text-gray-900">Skills & Tools</h2>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">what I use</span>
      </div>
      <p class="text-gray-500 text-sm mb-12">Hover any skill to see a real-world code example from a project where I used it.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(category, index) in skills" :key="index" class="border border-gray-200 rounded-lg p-6">
          <h3 class="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 font-mono">{{ category.title }}</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(skill, sIndex) in category.items"
              :key="sIndex"
              class="skill-chip inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border cursor-help"
              :class="skill.highlight ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-gray-50 text-gray-700 border-gray-200'"
              @mouseenter="openSnippet(index, sIndex)"
              @mouseleave="closeSnippet"
            >
              {{ skill.name }}
              <span v-if="skill.code" class="ml-1.5 text-[10px] opacity-40">&lt;/&gt;</span>

              <transition name="term-fade">
                <span v-if="isActive(index, sIndex)" class="skill-term" @mouseenter="openSnippet(index, sIndex)">
                  <span class="skill-term__bar">
                    <span class="skill-term__dot" style="background:#ff5f56"></span>
                    <span class="skill-term__dot" style="background:#ffbd2e"></span>
                    <span class="skill-term__dot" style="background:#27c93f"></span>
                    <span class="skill-term__file">{{ skill.file }}</span>
                  </span>
                  <span class="skill-term__meta">{{ skill.project }}</span>
                  <pre class="skill-term__code"><code>{{ skill.code }}</code></pre>
                </span>
              </transition>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeKey: null,
      skills: [
        {
          title: 'Cloud & Infrastructure',
          items: [
            { name: 'Microsoft Azure', highlight: false, project: 'Enterprise Cloud Migration', file: 'main.bicep', code: `resource appPlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: 'asp-prod-canadacentral'
  location: 'canadacentral'
  sku: { name: 'P1v3', tier: 'PremiumV3', capacity: 3 }
  properties: { zoneRedundant: true }
}` },
            { name: 'AWS', highlight: false, project: 'FaezSports Leagues', file: 'ecs-service.tf', code: `resource "aws_ecs_service" "leagues_api" {
  name            = "leagues-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "api"
    container_port   = 3000
  }
}` },
            { name: 'Oracle Cloud (OCI)', highlight: false, project: 'SAP S/4HANA Migration', file: 'compute.tf', code: `resource "oci_core_instance" "sap_app" {
  availability_domain = var.ad
  compartment_id      = var.compartment_ocid
  shape               = "VM.Standard.E4.Flex"
  shape_config {
    ocpus         = 8
    memory_in_gbs = 128
  }
  display_name = "sap-app-tier-01"
}` },
            { name: 'Kubernetes', highlight: false, project: 'Ignyte MSP Platform', file: 'deployment.yaml', code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: tenant-api
spec:
  replicas: 3
  strategy:
    rollingUpdate: { maxSurge: 1, maxUnavailable: 0 }
  template:
    spec:
      containers:
        - name: api
          image: ignyte/tenant-api:1.4.2
          resources:
            requests: { cpu: 250m, memory: 256Mi }` },
            { name: 'Docker', highlight: false, project: 'MyCareer Builder', file: 'Dockerfile', code: `FROM python:3.12-slim AS base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "dashboard.main:app", "--host", "0.0.0.0", "--port", "8000"]` },
            { name: 'Terraform', highlight: false, project: 'Multi-cloud IaC', file: 'main.tf', code: `module "network" {
  source  = "./modules/vpc"
  cidr    = "10.20.0.0/16"
  azs     = ["ca-central-1a", "ca-central-1b"]
  tags = {
    Environment = "production"
    ManagedBy   = "terraform"
  }
}` },
          ]
        },
        {
          title: 'Enterprise & ERP',
          items: [
            { name: 'SAP S/4HANA', highlight: false, project: 'ERP Cloud Migration', file: 'extract_gl.abap', code: `SELECT belnr, budat, dmbtr, hkont
  FROM bkpf AS h
  INNER JOIN bseg AS i ON h~belnr = i~belnr
  INTO TABLE @DATA(lt_gl)
  WHERE h~bukrs = @lv_company
    AND h~gjahr = @lv_fiscal_year.` },
            { name: 'JD Edwards', highlight: false, project: 'Finance Systems Integration', file: 'f0411_export.sql', code: `SELECT RPAN8 AS supplier, RPDGJ AS gl_date,
       RPAG AS gross_amount, RPCRRC AS currency
FROM PRODDTA.F0411
WHERE RPPST = 'A'   -- approved vouchers
  AND RPDGJ BETWEEN :start_jd AND :end_jd;` },
            { name: 'Active Directory', highlight: false, project: 'Ignyte MSP Onboarding', file: 'provision-user.ps1', code: `New-ADUser -Name "$First $Last" \`
  -SamAccountName $sam \`
  -UserPrincipalName "$sam@ignyte.local" \`
  -Path "OU=Staff,DC=ignyte,DC=local" \`
  -AccountPassword $securePw -Enabled $true
Add-ADGroupMember -Identity "M365-E3" -Members $sam` },
            { name: 'M365', highlight: false, project: 'Tenant Automation', file: 'assign-license.ps1', code: `Connect-MgGraph -Scopes "User.ReadWrite.All"
Set-MgUserLicense -UserId $upn \`
  -AddLicenses @{ SkuId = $e3SkuId } \`
  -RemoveLicenses @()` },
            { name: 'IAM', highlight: false, project: 'Zero Trust Rollout', file: 'ca-policy.json', code: `{
  "displayName": "Require MFA for admins",
  "conditions": {
    "users": { "includeRoles": ["Global Administrator"] },
    "applications": { "includeApplications": ["All"] }
  },
  "grantControls": {
    "operator": "OR",
    "builtInControls": ["mfa"]
  }
}` },
            { name: 'Zero Trust', highlight: false, project: 'Security Hardening', file: 'conditional-access.ps1', code: `# Block legacy auth, enforce compliant devices
New-MgIdentityConditionalAccessPolicy -BodyParameter @{
  DisplayName = "Block Legacy Auth"
  State       = "enabled"
  Conditions  = @{ ClientAppTypes = @("exchangeActiveSync","other") }
  GrantControls = @{ Operator = "OR"; BuiltInControls = @("block") }
}` },
          ]
        },
        {
          title: 'DevOps & Automation',
          items: [
            { name: 'CI/CD', highlight: false, project: 'alexandersam.me', file: 'deploy.yml', code: `- name: Build & deploy
  run: yarn generate
- name: FTP upload to Hostinger
  uses: SamKirkland/FTP-Deploy-Action@v4.3.5
  with:
    server: \${{ secrets.FTP_SERVER }}
    local-dir: ./dist/
    server-dir: /domains/alexandersam.me/public_html/` },
            { name: 'GitHub Actions', highlight: false, project: 'FaezSports CI', file: 'ci.yml', code: `on:
  push: { branches: [main] }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npx prisma generate
      - run: npm run test -- --coverage` },
            { name: 'Python', highlight: false, project: 'Contrarian Finance Bot', file: 'signals.py', code: `def contrarian_signal(rsi: float, sentiment: float) -> str:
    """Fade the crowd when fear/greed hits extremes."""
    if rsi < 30 and sentiment < -0.5:
        return "STRONG_BUY"
    if rsi > 70 and sentiment > 0.5:
        return "TAKE_PROFIT"
    return "HOLD"` },
            { name: 'Node.js', highlight: false, project: 'FaezSports Leagues', file: 'standings.ts', code: `export function computeStandings(games: Game[]): Standing[] {
  const table = new Map<string, Standing>()
  for (const g of games) {
    const home = table.get(g.homeId) ?? blank(g.homeId)
    home.points += g.homeScore > g.awayScore ? 3 : g.tie ? 1 : 0
    table.set(g.homeId, home)
  }
  return [...table.values()].sort((a, b) => b.points - a.points)
}` },
            { name: 'Bash', highlight: false, project: 'Backup Automation', file: 'backup.sh', code: `#!/usr/bin/env bash
set -euo pipefail
TS=$(date +%Y%m%d-%H%M)
pg_dump "$DATABASE_URL" | gzip > "/backups/db-$TS.sql.gz"
find /backups -name '*.sql.gz' -mtime +14 -delete
echo "Backup complete: db-$TS.sql.gz"` },
            { name: 'Tailscale', highlight: false, project: 'Mac Mini AI Assistant', file: 'setup.sh', code: `# Expose local Ollama over private tailnet only
tailscale up --ssh --advertise-tags=tag:ai-node
tailscale serve https / http://localhost:11434
# Now reachable at https://macmini.tail-scale.ts.net` },
          ]
        },
        {
          title: 'AI & LLM',
          items: [
            { name: 'Claude API', highlight: false, project: 'MyCareer Builder', file: 'tailor.py', code: `resp = client.messages.create(
    model="claude-sonnet-4",
    max_tokens=2000,
    system="You are an expert resume writer.",
    messages=[{
        "role": "user",
        "content": f"Tailor this resume to the JD.\\nJD:\\n{jd}\\nResume:\\n{resume}"
    }],
)
tailored = resp.content[0].text` },
            { name: 'Ollama', highlight: false, project: 'Mac Mini AI Assistant', file: 'local_llm.py', code: `import ollama
res = ollama.chat(
    model="llama3.1:8b",
    messages=[{"role": "user", "content": prompt}],
    options={"temperature": 0.2},
)
print(res["message"]["content"])` },
            { name: 'Gemini', highlight: false, project: 'Mark-It', file: 'generate_copy.py', code: `model = genai.GenerativeModel("gemini-1.5-pro")
out = model.generate_content(
    f"Write 3 ad variations for: {product}. Tone: {tone}",
    generation_config={"temperature": 0.9},
)
variations = out.text.split("\\n\\n")` },
            { name: 'Telegram Bots', highlight: false, project: 'Contrarian Finance Bot', file: 'bot.py', code: `@dp.message(Command("signal"))
async def send_signal(message: types.Message):
    ticker = message.text.split()[1].upper()
    sig = contrarian_signal(*fetch_metrics(ticker))
    await message.answer(f"{ticker}: *{sig}*", parse_mode="Markdown")` },
            { name: 'Intent Classification', highlight: false, project: 'Support Router', file: 'router.py', code: `INTENTS = ["billing", "technical", "sales", "other"]
def classify(text: str) -> str:
    resp = client.messages.create(
        model="claude-haiku-4",
        max_tokens=10,
        messages=[{"role": "user",
                   "content": f"Classify into {INTENTS}: {text}"}],
    )
    return resp.content[0].text.strip().lower()` },
          ]
        },
        {
          title: 'Data & Analytics',
          items: [
            { name: 'SQL Server', highlight: false, project: 'ERP Reporting', file: 'monthly_gl.sql', code: `WITH monthly AS (
  SELECT account, DATEFROMPARTS(YEAR(posted), MONTH(posted), 1) AS mo,
         SUM(amount) AS total
  FROM ledger GROUP BY account, YEAR(posted), MONTH(posted)
)
SELECT * FROM monthly
WHERE mo >= DATEADD(month, -12, GETDATE())
ORDER BY account, mo;` },
            { name: 'PostgreSQL', highlight: false, project: 'FaezSports Platform', file: 'schema.prisma', code: `model Registration {
  id        String   @id @default(cuid())
  leagueId  String
  playerId  String
  paidCents Int      @default(0)
  createdAt DateTime @default(now())

  @@unique([leagueId, playerId])
  @@index([leagueId])
}` },
            { name: 'SQLite', highlight: false, project: 'MyCareer Builder', file: 'db.py', code: `conn.execute("""
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY,
    company TEXT NOT NULL,
    fit_score REAL,
    status TEXT DEFAULT 'draft',
    applied_at TEXT
  )
""")` },
            { name: 'ETL', highlight: false, project: 'Data Migration Pipeline', file: 'pipeline.py', code: `def run_etl(src, dst):
    rows = extract(src)                       # pull from source
    clean = [transform(r) for r in rows if valid(r)]
    load(dst, clean, batch_size=500)          # bulk upsert
    log.info("Loaded %d / %d rows", len(clean), len(rows))` },
            { name: 'Event-Driven Architecture', highlight: false, project: 'FaezSports Leagues', file: 'events.ts', code: `emitter.on("payment.succeeded", async (evt) => {
  await confirmRegistration(evt.registrationId)
  await sendReceipt(evt.email, evt.amount)
  await notifyAdmin(\`New paid registration: \${evt.playerName}\`)
})` },
          ]
        },
        {
          title: 'Project Management',
          items: [
            { name: 'PMP Certified', highlight: true, project: 'Enterprise Cloud Migration', file: 'risk-register.md', code: `## Risk Register — Cloud Migration
| ID | Risk                     | P | I | Response          |
|----|--------------------------|---|---|-------------------|
| R1 | Data loss during cutover | L | H | Parallel run + backup |
| R2 | Vendor SLA slippage      | M | M | Weekly checkpoints    |
| R3 | Scope creep              | H | M | Change control board  |` },
            { name: 'Agile / Scrum', highlight: false, project: 'FaezSports Delivery', file: 'sprint-plan.md', code: `## Sprint 14 — Goal: Live standings
- [x] Standings calc engine        (8 pts)
- [x] Real-time box score updates  (5 pts)
- [ ] Playoff bracket generator    (13 pts)
Velocity: 26 pts avg | Capacity: 30 pts` },
            { name: 'Kanban', highlight: false, project: 'Ignyte Ops Board', file: 'board.md', code: `Backlog  →  In Progress (WIP 3)  →  Review  →  Done
─────────────────────────────────────────────────
- Tenant onboarding automation   [In Progress]
- M365 license audit             [Review]
- Backup DR test                 [Done]` },
            { name: 'Jira', highlight: false, project: 'Cross-team Delivery', file: 'jql.txt', code: `project = ERP
  AND sprint in openSprints()
  AND assignee = currentUser()
  AND status != Done
ORDER BY priority DESC, updated ASC` },
            { name: 'Confluence', highlight: false, project: 'Runbook Docs', file: 'runbook.md', code: `# Cutover Runbook — Go-Live
1. Freeze source system writes (T-2h)
2. Final delta sync + checksum validation
3. Repoint DNS / connection strings
4. Smoke test critical paths
5. Stakeholder sign-off → close change ticket` },
          ]
        },
      ]
    }
  },
  methods: {
    isActive(c, s) {
      return !!this.activeKey && this.activeKey[0] === c && this.activeKey[1] === s
    },
    openSnippet(c, s) {
      const skill = this.skills[c].items[s]
      if (skill && skill.code) this.activeKey = [c, s]
    },
    closeSnippet() {
      this.activeKey = null
    }
  }
}
</script>

<style scoped>
.skill-chip {
  position: relative;
}
.skill-term {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 40;
  display: block;
  width: 340px;
  max-width: 78vw;
  background: #0d1117;
  border: 1px solid #1f2937;
  border-radius: 0.5rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
  overflow: hidden;
  text-align: left;
  cursor: default;
}
.skill-term__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  background: #161b22;
  border-bottom: 1px solid #1f2937;
}
.skill-term__dot {
  width: 9px;
  height: 9px;
  border-radius: 9999px;
  display: inline-block;
}
.skill-term__file {
  margin-left: 6px;
  color: #8b949e;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
}
.skill-term__meta {
  display: block;
  padding: 8px 12px 0;
  color: #6e7681;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.skill-term__code {
  margin: 0;
  padding: 6px 12px 12px;
  color: #3ddc84;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11.5px;
  line-height: 1.55;
  white-space: pre;
  overflow-x: auto;
  text-shadow: 0 0 6px rgba(61, 220, 132, 0.25);
}
.term-fade-enter-active, .term-fade-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.term-fade-enter, .term-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
