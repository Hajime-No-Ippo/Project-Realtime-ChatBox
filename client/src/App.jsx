import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const DEFAULT_STATUS = "Waiting to join";

function App() {
  const [username, setUsername] = useState("");
  const [draftName, setDraftName] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const [joined, setJoined] = useState(false);
  const [status, setStatus] = useState(DEFAULT_STATUS);
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  const joinedRef = useRef(false);
  const usernameRef = useRef("");
  const messageInputRef = useRef(null);

  const serverUrl = useMemo(() => {
    if (import.meta.env.VITE_SERVER_URL) return import.meta.env.VITE_SERVER_URL;
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    return isLocal ? "http://localhost:8000" : window.location.origin;
  }, []);

  useEffect(() => {
    joinedRef.current = joined;
    usernameRef.current = username;
  }, [joined, username]);

  useEffect(() => {
    const socket = io(serverUrl, { withCredentials: true });
    socketRef.current = socket;

    socket.on("chat-message", (data) => {
      appendMessage(`${data.name}: ${data.message}`, "incoming");
    });

    socket.on("user-connected", (name) => {
      appendMessage(`${name} connected`, "system");
    });

    socket.on("user-disconnected", (name) => {
      appendMessage(`${name || "A user"} disconnected`, "system");
    });

    socket.on("connect", () => {
      if (joinedRef.current && usernameRef.current) {
        setStatus(`Connected as ${usernameRef.current}`);
      } else {
        setStatus("Connected · waiting to join");
      }
    });

    socket.on("disconnect", () => {
      setStatus("Disconnected · reconnecting...");
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    if (joined) messageInputRef.current?.focus();
  }, [joined]);

  const appendMessage = (text, type) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, text, type },
    ]);
  };

  const handleJoin = (event) => {
    event.preventDefault();
    const cleanName = draftName.trim() || "Guest";
    setDraftName(cleanName);
    setUsername(cleanName);
    setJoined(true);
    appendMessage(`You joined as ${cleanName}`, "system");
    socketRef.current?.emit("new-user", cleanName);
    setStatus(`Connected as ${cleanName}`);
  };

  const handleSend = (event) => {
    event.preventDefault();
    const message = messageDraft.trim();
    if (!message) return;
    appendMessage(`You: ${message}`, "outgoing");
    socketRef.current?.emit("send-chat-message", message);
    setMessageDraft("");
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-[-120px] h-[420px] w-[420px] rounded-full bg-blue-300/30 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-orange-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-5 px-4 py-6">
        <header className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-4 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-orange-400 text-white">
                CB
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-serif text-lg">ChatBox</p>
              <p className="text-sm text-muted-foreground">
                Real-time messaging, simple and fast.
              </p>
              <p className="text-xs text-muted-foreground sm:hidden">{status}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleClear}>
                  Clear chat
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setStatus(joined ? `Connected as ${username}` : DEFAULT_STATUS)
                  }
                >
                  Refresh status
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1">
          {!joined ? (
            <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-10 animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
              <div className="absolute -left-24 top-20 h-48 w-48 rounded-full bg-blue-100 blur-2xl" />
              <div className="absolute -right-20 bottom-10 h-52 w-52 rounded-full bg-orange-100 blur-2xl" />
              <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Welcome
                  </p>
                  <h1 className="font-serif text-3xl sm:text-4xl">
                    Jump into the conversation
                  </h1>
                  <p className="max-w-xl text-base text-muted-foreground">
                    Pick a display name and we will drop you into the live chat.
                    Built for multi-tab testing and quick collaboration.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-6">
                  <p className="text-sm font-semibold text-slate-900">
                    Display name
                  </p>
                  <form onSubmit={handleJoin} className="mt-4 space-y-3">
                    <Input
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      placeholder="Alex, Jamie, Guest..."
                      required
                      autoFocus
                    />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        You can open multiple tabs to simulate a group chat.
                      </p>
                      <Button className="sm:w-auto" size="lg">
                        Enter chat
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          ) : (
            <section className="flex h-[calc(100vh-220px)] min-h-[520px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-700">
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm text-muted-foreground">Live room</p>
                  <p className="text-lg font-semibold">Everyone in the lobby</p>
                </div>
                <Badge className="bg-blue-600 text-white hover:bg-blue-600">
                  {username}
                </Badge>
              </div>
              <Separator />
              <ScrollArea className="flex-1 px-6 py-5">
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-muted-foreground">
                      Start the conversation with the first message.
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.type === "outgoing" && "justify-end",
                          message.type === "system" && "justify-center"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[72%] rounded-2xl px-4 py-2 text-sm shadow-sm transition",
                            message.type === "incoming" &&
                              "bg-slate-100 text-slate-900",
                            message.type === "outgoing" &&
                              "bg-gradient-to-br from-blue-600 to-blue-500 text-white",
                            message.type === "system" &&
                              "bg-white text-xs text-muted-foreground shadow-none"
                          )}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>
              <Separator />
              <form
                onSubmit={handleSend}
                className="flex items-center gap-3 px-6 py-4"
              >
                <Input
                  ref={messageInputRef}
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  placeholder="Type your message"
                />
                <Button size="lg" className="shrink-0">
                  Send
                </Button>
              </form>
            </section>
          )}
        </main>

        <footer className="text-center text-xs text-muted-foreground">
          ChatBox demo · Built with Node, Express, and Socket.IO
        </footer>
      </div>
    </div>
  );
}

export default App;
