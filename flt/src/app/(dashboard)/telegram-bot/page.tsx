import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap, MessageSquare, Clock } from "lucide-react";

const commands = [
  { cmd: "/status",   desc: "Show open projects and tasks" },
  { cmd: "/invoice",  desc: "Create a quick invoice" },
  { cmd: "/log",      desc: "Log time to a project" },
  { cmd: "/lead",     desc: "Add a new lead" },
  { cmd: "/expense",  desc: "Record an expense" },
  { cmd: "/summary",  desc: "Get today's financial snapshot" },
];

export default function TelegramBotPage() {
  return (
    <>
      <PageHeader
        title="Telegram Bot"
        description="Control FreelanceOS from your phone via Telegram."
      />
      <main className="flex-1 p-6">
        <div className="bento-grid">
          {/* Connection status */}
          <div className="bento-span-2 neu-card rounded-sm p-6 bg-brand-mint text-black">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-8 h-8" />
              <div>
                <p className="font-extrabold text-lg">@FreelanceOSBot</p>
                <Badge className="bg-black text-white rounded-sm text-xs font-bold border-0 mt-1">
                  Not connected
                </Badge>
              </div>
            </div>
            <p className="text-sm opacity-70">
              Connect your Telegram account to manage your business on the go.
            </p>
          </div>

          {/* Setup steps */}
          <div className="bento-span-2 neu-card rounded-sm p-6 bg-card">
            <p className="font-bold text-sm uppercase tracking-widest mb-4">
              Setup
            </p>
            {[
              "Add your Telegram Chat ID in Settings → Profile",
              "Start a chat with @FreelanceOSBot on Telegram",
              "Send /start to link your account",
            ].map((step, i) => (
              <div key={i} className="flex gap-3 mb-3 last:mb-0">
                <span className="flex-shrink-0 w-5 h-5 bg-brand-yellow border-[2px] border-black rounded-sm flex items-center justify-center text-xs font-extrabold">
                  {i + 1}
                </span>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>

          {/* Commands reference */}
          <div className="bento-span-4 neu-card rounded-sm p-6 bg-card">
            <p className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Available Commands
            </p>
            <div className="grid grid-cols-2 gap-3">
              {commands.map(({ cmd, desc }) => (
                <div
                  key={cmd}
                  className="neu-card-sm rounded-sm p-3 flex items-start gap-3"
                >
                  <code className="text-xs font-extrabold bg-brand-yellow px-2 py-0.5 rounded-sm border-[2px] border-black shrink-0">
                    {cmd}
                  </code>
                  <span className="text-sm text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
