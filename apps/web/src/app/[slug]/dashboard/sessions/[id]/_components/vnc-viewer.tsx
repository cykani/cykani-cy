"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  Camera,
  Maximize2,
  Minimize2,
  MonitorOff,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";

type Status = "connecting" | "connected" | "disconnected" | "error";

const statusLabel: Record<Status, string> = {
  connecting: "Connecting…",
  connected: "Live",
  disconnected: "Disconnected",
  error: "Connection error",
};

const statusDot: Record<Status, string> = {
  connecting: "bg-amber-400 animate-pulse",
  connected: "bg-emerald-400 shadow-[0_0_6px_2px_#34d39980]",
  disconnected: "bg-zinc-500",
  error: "bg-red-500",
};

export function VNCViewer({ sessionId }: { sessionId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<Status>("connecting");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const fpsTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const connect = useCallback(() => {
    setStatus("connecting");
    const ws = new WebSocket(`ws://localhost:3000/v1/sessions/${sessionId}/vnc`);
    wsRef.current = ws;

    ws.onopen = () => setStatus("connected");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "framebuffer") {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx && data.image) {
              const img = new Image();
              img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                frameCount.current += 1;
              };
              img.src = `data:image/png;base64,${data.image}`;
            }
          }
        }
      } catch {
        // binary frame passthrough
      }
    };

    ws.onclose = () => setStatus("disconnected");
    ws.onerror = () => setStatus("error");
  }, [sessionId]);

  useEffect(() => {
    connect();
    fpsTimer.current = setInterval(() => {
      setFps(frameCount.current);
      frameCount.current = 0;
    }, 1000);
    return () => {
      wsRef.current?.close();
      if (fpsTimer.current) clearInterval(fpsTimer.current);
    };
  }, [connect]);

  const takeScreenshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `session-${sessionId}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div ref={containerRef} className="relative flex min-h-0 flex-1 flex-col bg-[#09090b]">
        {/* Toolbar */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
          {/* Status */}
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1.5 backdrop-blur-md">
            <span className={`size-2 rounded-full ${statusDot[status]}`} />
            <span className="text-white/80 text-xs">{statusLabel[status]}</span>
            {status === "connected" && (
              <>
                <span className="text-white/30">·</span>
                <span className="font-mono text-white/50 text-xs">{fps} fps</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 p-1 backdrop-blur-md">
            {status === "disconnected" || status === "error" ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 text-white/70 hover:text-white"
                    onClick={connect}
                  >
                    <RefreshCw className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reconnect</TooltipContent>
              </Tooltip>
            ) : null}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 text-white/70 hover:text-white"
                  onClick={takeScreenshot}
                  disabled={status !== "connected"}
                >
                  <Camera className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Screenshot</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 text-white/70 hover:text-white"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize2 className="size-3.5" />
                  ) : (
                    <Maximize2 className="size-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="min-h-0 flex-1 object-contain"
          style={{ width: "100%", height: "100%" }}
          width={1280}
          height={800}
        />

        {/* Overlay states */}
        {(status === "connecting" || status === "disconnected" || status === "error") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 backdrop-blur-sm">
            {status === "connecting" && (
              <>
                <span className="size-10 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
                <p className="text-white/60 text-sm">Establishing secure connection…</p>
              </>
            )}
            {status === "disconnected" && (
              <>
                <WifiOff className="size-10 text-zinc-500" />
                <p className="text-white/60 text-sm">Session disconnected</p>
                <Button variant="outline" size="sm" onClick={connect} className="gap-2">
                  <RefreshCw className="size-3.5" />
                  Reconnect
                </Button>
              </>
            )}
            {status === "error" && (
              <>
                <MonitorOff className="size-10 text-red-500/70" />
                <p className="text-red-400 text-sm">Connection failed</p>
                <Button variant="outline" size="sm" onClick={connect} className="gap-2">
                  <RefreshCw className="size-3.5" />
                  Retry
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
