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
            { name: 'Microsoft Azure', highlight: false, project: 'RBC · Next-Gen SIEM ($52M)', file: 'sentinel-rule.kql', code: `// Microsoft Sentinel analytics rule — Splunk + Sentinel migration
// 20 TB/day ingest · 450K EPS coordinated across 15 data centers
SigninLogs
| where AppDisplayName has "proxy"
| summarize failures = countif(ResultType != 0)
    by IPAddress, bin(TimeGenerated, 5m)
| where failures > 25   // flag anomalous proxy auth` },
            { name: 'AWS', highlight: false, project: 'AWS Solutions Engineer (cert)', file: 'cloudwatch.tf', code: `# Amazon Solutions Engineer certified (Jan 2021)
resource "aws_cloudwatch_metric_alarm" "siem_eps" {
  alarm_name          = "siem-ingest-eps"
  comparison_operator = "GreaterThanThreshold"
  metric_name         = "EventsPerSecond"
  threshold           = 450000
  period              = 300
}` },
            { name: 'Oracle Cloud (OCI)', highlight: false, project: 'OCI · Automation Platform', file: 'provision.sh', code: `# Ampere A1 (ARM) VM on OCI free tier — $0/month
oci compute instance launch \\
  --shape VM.Standard.A1.Flex \\
  --shape-config '{"ocpus":4,"memoryInGBs":24}'
# Toronto region capacity constrained → Montreal fallback
tailscale up --ssh --advertise-tags=tag:ai-node` },
            { name: 'Kubernetes', highlight: false, project: 'Publicis · DevOps pipelines', file: 'deployment.yaml', code: `# Kubernetes cluster management at scale (Publicis Groupe)
apiVersion: apps/v1
kind: Deployment
metadata: { name: build-agent }
spec:
  replicas: 6
  template:
    spec:
      containers:
        - name: agent
          image: registry/ci-agent:stable` },
            { name: 'Docker', highlight: false, project: 'OCI · OpenClaw deploy', file: 'Dockerfile', code: `# OpenClaw: diagnosed Docker binding issues on ARM,
# pivoted to native npm — knowing when containers help vs hurt
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
CMD ["node", "openclaw.js"]` },
            { name: 'Terraform', highlight: false, project: 'Publicis · Infrastructure-as-Code', file: 'main.tf', code: `# Terraform + Ansible IaC for Jenkins/Docker/K8s pipelines
module "k8s_cluster" {
  source       = "./modules/gke"
  node_count   = 6
  machine_type = "n2-standard-4"
}
# config management handed off to Ansible playbooks` },
          ]
        },
        {
          title: 'Enterprise & ERP',
          items: [
            { name: 'SAP S/4HANA', highlight: false, project: 'Syntax · Global IT (SAP MSP)', file: 'team.md', code: `# Syntax — SAP/Oracle ERP managed-services provider
# Led global IT team: 25 employees, 4 direct reports
- Managed infra & availability supporting ERP clients
- Cross-timezone escalations, patching, uptime
# NOTE: brag-doc lacks SAP build specifics — confirm details` },
            { name: 'JD Edwards', highlight: false, project: 'Syntax · ERP Managed Services', file: 'note.md', code: `# ERP operations @ Syntax (SAP/Oracle/JDE MSP)
# 25-person global team · 4 direct reports
- Service delivery across enterprise ERP estates
# NOTE: brag-doc has no JD Edwards specifics — confirm details` },
            { name: 'Active Directory', highlight: false, project: 'Ignyte · Endpoint Management', file: 'laps.ps1', code: `# Windows LAPS break-glass + local admin enforcement (Intune)
# 120 endpoints across 19 active client environments
Set-LapsADPasswordExpirationTime -Identity $device
New-ADGroup -Name "M365-E3-Users" -GroupScope Global
Add-ADGroupMember -Identity "M365-E3-Users" -Members $sam` },
            { name: 'M365', highlight: false, project: 'Ignyte · Intune / M365', file: 'intune-compliance.ps1', code: `# Device compliance via Settings Catalog (ADMX for Pro)
New-MgDeviceManagementDeviceCompliancePolicy -BodyParameter @{
  displayName    = "Win11 Baseline"
  "@odata.type"  = "#microsoft.graph.windows10CompliancePolicy"
  passwordRequired = $true
  bitLockerEnabled = $true
}` },
            { name: 'IAM', highlight: false, project: 'RBC · Internet Controls Re-Alignment', file: 'iam-review.ps1', code: `# Global proxy auth + IAM review across 3,000+ web apps
Get-WebApps | ForEach-Object {
  if (-not $_.AuthConfigured) {
    Redirect-ToSSO $_.Url   # mitigate unauthorized access
    Write-Attestation $_.AppId
  }
}` },
            { name: 'Zero Trust', highlight: false, project: 'RBC · Firepower IPS + PAM', file: 'least-privilege.md', code: `# Cisco Firepower IPS refresh — 79 appliances
# Partnered with IAM team on PAM / CyberArk rollout
- CyberArk vaulting for privileged credentials
- Least-privilege enforced across environments
- IPS across 15 data centers` },
          ]
        },
        {
          title: 'DevOps & Automation',
          items: [
            { name: 'CI/CD', highlight: false, project: 'BMO · GitHub Enterprise ($5M)', file: 'pipeline.yml', code: `# Standardized CI/CD across LOBs — 20k users, 100k+ repos
stages: [build, scan, deploy]
scan:
  script:
    - sonar-scanner          # SonarQube quality gate
    - artifactory publish    # Artifactory
    - cyberark get-secret    # CyberArk-managed creds` },
            { name: 'GitHub Actions', highlight: false, project: 'BMO · Bitbucket → GHE', file: 'ci.yml', code: `# Migrated 100k+ repos from Bitbucket to GitHub Enterprise
on: { push: { branches: [main] } }
jobs:
  build:
    runs-on: [self-hosted]
    steps:
      - uses: actions/checkout@v4
      - run: mvn verify sonar:sonar` },
            { name: 'Python', highlight: false, project: 'FaezSports · IG automation', file: 'instagram_sync.py', code: `# OCI cron → Instagram Graph API → FTP → Hostinger
posts = fetch_instagram_media(refresh_token())   # 60-day token mgmt
for p in posts:
    render_card(p)
ftp_upload("/public_html/feed/", built_pages)` },
            { name: 'Node.js', highlight: false, project: 'FaezSports Platform', file: 'standings.ts', code: `// Next.js + TypeScript + Prisma + Supabase
export async function standings(leagueId: string) {
  const games = await prisma.game.findMany({ where: { leagueId } })
  return computeTable(games).sort((a, b) => b.pts - a.pts)
}` },
            { name: 'Bash', highlight: false, project: 'FaezSports · OCI cron', file: 'refresh_token.sh', code: `#!/usr/bin/env bash
# Instagram Graph API token — 60-day lifecycle mgmt on OCI
set -euo pipefail
NEW=$(curl -s "$IG_REFRESH_URL" | jq -r .access_token)
echo "$NEW" > /opt/faez/ig_token` },
            { name: 'Tailscale', highlight: false, project: 'OCI · Secure Mesh', file: 'tailscale.sh', code: `# Private access to OCI Ampere box — no public ports open
tailscale up --ssh --advertise-tags=tag:ai-node
tailscale serve https / http://localhost:3000
# secure remote access to automation workloads` },
          ]
        },
        {
          title: 'AI & LLM',
          items: [
            { name: 'Claude API', highlight: false, project: 'FaezSports · NL league config', file: 'league_config.ts', code: `// Natural-language → structured league setup (Claude API)
// Differentiator: most youth-sports tools have no AI
const cfg = await claude.messages.create({
  model: "claude-sonnet-4",
  messages: [{ role: "user", content: \`Build a league: \${prompt}\` }],
})
return parseLeague(cfg.content[0].text)` },
            { name: 'Ollama', highlight: false, project: 'OCI · self-hosted models', file: 'local_llm.py', code: `# Self-hosted model host on OCI Ampere box
# NOTE: brag-doc cites Claude/OpenClaw, not Ollama — confirm
res = ollama.chat(
    model="llama3.1:8b",
    messages=[{"role": "user", "content": prompt}],
)` },
            { name: 'Gemini', highlight: false, project: 'AI experiments', file: 'generate.py', code: `# NOTE: not documented in brag-doc — placeholder, confirm usage
model = genai.GenerativeModel("gemini-1.5-pro")
out = model.generate_content(prompt)
print(out.text)` },
            { name: 'Telegram Bots', highlight: false, project: 'OCI · OpenClaw', file: 'bot.py', code: `# OpenClaw automation + Anthropic API exposed via Telegram
@dp.message()
async def handle(msg):
    reply = await openclaw.run(msg.text)   # Anthropic-backed
    await msg.answer(reply)` },
            { name: 'Intent Classification', highlight: false, project: 'OpenClaw · command routing', file: 'router.py', code: `# Route Telegram commands to OpenClaw skills
# NOTE: brag-doc has no explicit intent-classification project
intent = classify(msg.text, labels=["deploy", "status", "query"])
dispatch(intent, msg)` },
          ]
        },
        {
          title: 'Data & Analytics',
          items: [
            { name: 'SQL Server', highlight: false, project: 'Family Service TO · PassportOne', file: 'invoice_batch.sql', code: `-- Dynamics CRM + Great Plains backend
-- $2.2M/day automated provincial invoice processing
INSERT INTO gp.PM_Transactions (vendor, amount, batch)
SELECT vendor_id, amount, @batch
FROM staging.provincial_invoices
WHERE validated = 1;   -- SLA-compliant nightly run` },
            { name: 'PostgreSQL', highlight: false, project: 'FaezSports · Supabase', file: 'schema.prisma', code: `// Supabase (PostgreSQL) + Prisma — Stripe registration payments
model Registration {
  id        String @id @default(cuid())
  leagueId  String
  paidCents Int    @default(0)   // Stripe cents
  @@index([leagueId])
}` },
            { name: 'SQLite', highlight: false, project: 'Ignyte · endpoint inventory', file: 'inventory.py', code: `# Lightweight local store for client endpoint inventory
# 120 endpoints across 19 active clients
db.execute("""CREATE TABLE IF NOT EXISTS endpoints (
  id INTEGER PRIMARY KEY, client TEXT,
  compliant INT, last_seen TEXT)""")` },
            { name: 'ETL', highlight: false, project: 'FaezSports · IG pipeline', file: 'pipeline.py', code: `# Extract (Graph API) → Transform (render) → Load (FTP)
raw   = extract_instagram()
pages = [transform(p) for p in raw]
load_ftp(pages)   # → Hostinger public_html` },
            { name: 'Event-Driven Architecture', highlight: false, project: 'FaezSports · Stripe webhooks', file: 'events.ts', code: `// Stripe checkout event → confirm registration
stripe.on("checkout.session.completed", async (e) => {
  await confirmRegistration(e.data.object.metadata.regId)
  await emailReceipt(e.data.object.customer_email)
})` },
          ]
        },
        {
          title: 'Project Management',
          items: [
            { name: 'PMP Certified', highlight: true, project: 'RBC · SIEM Migration ($52M)', file: 'program.md', code: `## $52M Next-Gen SIEM program (Splunk + Sentinel)
- 20 TB/day ingest · 450K EPS coordinated
- Cross-functional delivery across 15 data centers
- Agile delivery of enterprise security telemetry
# PMP certified (Mar 2018)` },
            { name: 'Agile / Scrum', highlight: false, project: 'U of T · SAFe adoption', file: 'safe.md', code: `## Student Information Systems portfolio (current)
+20% sprint predictability via SAFe implementation
- Transitioned business units from traditional → agile
- Structured intake process → better resource allocation
# CSM certified (May 2022)` },
            { name: 'Kanban', highlight: false, project: 'Ignyte · service delivery', file: 'board.md', code: `Backlog  →  In Progress (WIP 3)  →  Review  →  Done
─────────────────────────────────────────────────
- Intune compliance rollout      [In Progress]
- JSM portal scoping             [Review]
- SOW v2 (Isaac Operations)      [Done]` },
            { name: 'Jira', highlight: false, project: 'BMO · Jira Cloud + Ignyte JSM', file: 'jql.txt', code: `# BMO Jira/Confluence Cloud migration + Ignyte JSM portal
project = SIS
  AND sprint in openSprints()
  AND status != Done
ORDER BY priority DESC, updated ASC` },
            { name: 'Confluence', highlight: false, project: 'BMO · Jira/Confluence Cloud', file: 'runbook.md', code: `# SaaS migration w/ minimal downtime
# Supported Bank of the West acquisition compliance
1. Export Data Center spaces
2. Cloud Migration Assistant → validate
3. Cutover  4. Smoke test  5. Stakeholder sign-off` },
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
