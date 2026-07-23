"use client";

import { useEffect, useRef, useState } from "react";

import { Badge } from "@cykani/ui/badge";
import { Button } from "@cykani/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@cykani/ui/card";
import { Maximize2, Minimize2, RefreshCw } from "lucide-react";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export function VNCViewer({ sessionId }: { sessionId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const connect = () => {
    setStatus("connecting");
    const ws = new WebSocket(`ws://localhost:3000/v1/sessions/${sessionId}/vnc`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
      console.log("VNC connected to session:", sessionId);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Handle VNC protocol messages
        if (data.type === "framebuffer") {
          // Render frame to canvas
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx && data.image) {
              const img = new Image();
              img.onload = () => ctx.drawImage(img, 0, 0);
              img.src = `data:image/png;base64,${data.image}`;
            }
          }
        }
      } catch {
        // Binary VNC data
      }
    };

    ws.onclose = () => {
      setStatus("disconnected");
      console.log("VNC disconnected");
    };

    ws.onerror = () => {
      setStatus("error");
    };
  };

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  const statusColors: Record<ConnectionStatus, string> = {
    connecting: "bg-yellow-500/20 text-yellow-500",
    connected: "bg-green-500/20 text-green-500",
    disconnected: "bg-gray-500/20 text-gray-500",
    error: "bg-red-500/20 text-red-500",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>VNC Viewer</CardTitle>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[status]}>{status}</Badge>
          <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Button>
          {status === "disconnected" && (
            <Button variant="outline" size="sm" onClick={connect}>
              <RefreshCw className="mr-1 size-4" /> Reconnect
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`relative rounded-lg border bg-black ${isFullscreen ? "h-[800px]" : "h-[600px]"}`}>
          <canvas ref={canvasRef} className="h-full w-full" width={1280} height={800} />
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <span className="text-muted-foreground text-xs">Session: {sessionId}</span>
            {status === "connected" && <span className="text-green-400 text-xs">● Live</span>}
          </div>
          {status === "error" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center">
                <p className="mb-2 text-red-400">Connection failed</p>
                <Button variant="outline" size="sm" onClick={connect}>
                  <RefreshCw className="mr-1 size-4" /> Retry
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
