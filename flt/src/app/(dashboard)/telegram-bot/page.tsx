import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageSquare, Wifi, WifiOff } from "lucide-react";
import { ChatIdForm } from "@/components/telegram/chat-id-form";

const commands = [
  { cmd: "/status",  desc: "Show open projects and tasks" },
  { cmd: "/invoice", desc: "Create a quick invoice" },
  { cmd: "/log",     desc: "Log time to a project" },
  { cmd: "/lead",    desc: "Add a new lead" },
  { cmd: "/expense", desc: "Record an expense" },
  { cmd: "/summary", desc: "Get today's financial snapshot" },
];

export default async function TelegramBotPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("telegram_chat_id")
    .eq("id", user.id)
    .single();

  const chatId = profile?.telegram_chat_id ?? null;
  const isConnected = !!chatId;

  return (
    <>
      <PageHeader
        title="Telegram Bot"
        description="Control FreelanceOS from your phone via Telegram."
      />
      <main className="flex-1 p-6">
        <div className="bento-grid">

          {/* Connection status — span 2 */}
          <div
            className={`bento-span-2 neu-card rounded-sm p-6 ${
              isConnected ? "bg-brand-mint text-black" : "bg-card"
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <Bot className="w-8 h-8 shrink-0" />
              <div>
                <p className="font-extrabold text-lg">@FreelanceOSBot</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {isConnected ? (
                    <Wifi className="w-3.5 h-3.5" />
                  ) : (
                    <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  <Badge
                    className={`rounded-sm text-xs font-bold border-0 ${
                      isConnected
                        ? "bg-black text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isConnected ? `Connected · ${chatId}` : "Not connected"}
                  </Badge>
                </div>
              </div>
            </div>

            {!isConnected && (
              <p className="text-sm text-muted-foreground mt-2">
                Connect your Telegram account to manage your business on the go.
              </p>
            )}

            <ChatIdForm currentChatId={chatId} />
          </div>

          {/* Setup steps — span 2 */}
          <div className="bento-span-2 neu-card rounded-sm p-6 bg-card">
            <p className="font-bold text-sm uppercase tracking-widest mb-4">
              Setup
            </p>
            {[
              <>Message <strong>@userinfobot</strong> on Telegram to get your Chat ID</>,
              <>Enter your Chat ID in the panel on the left and save</>,
              <>Start a chat with <strong>@FreelanceOSBot</strong> on Telegram</>,
              <>Send <code className="bg-brand-yellow px-1 rounded-sm text-xs font-bold">/start</code> to link your account</>,
            ].map((step, i) => (
              <div key={i} className="flex gap-3 mb-3 last:mb-0">
                <span
                  className={`flex-shrink-0 w-5 h-5 border-[2px] border-black rounded-sm flex items-center justify-center text-xs font-extrabold ${
                    isConnected && i < 2
                      ? "bg-black text-white"
                      : "bg-brand-yellow text-black"
                  }`}
                >
                  {isConnected && i < 2 ? "✓" : i + 1}
                </span>
                <p className="text-sm leading-snug">{step}</p>
              </div>
            ))}
          </div>

          {/* Commands reference — span 4 */}
          <div className="bento-span-4 neu-card rounded-sm p-6 bg-card">
            <p className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Available Commands
            </p>
            <div className="grid grid-cols-2 gap-3">
              {commands.map(({ cmd, desc }) => (
                <div
                  key={cmd}
                  className="rounded-sm p-3 flex items-start gap-3 bg-muted/40 border-[2px] border-black/10 hover:border-black transition-colors"
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
