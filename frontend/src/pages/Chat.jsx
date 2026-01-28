import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import SmartIcebreakers from "../components/SmartIcebreakers";
import socket from "../Socket";

export default function Chat() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  const userId = user?.id || user?._id || (() => {
    try {
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.id || null;
    } catch {
      return null;
    }
  })();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState("");
  const [callState, setCallState] = useState({
    incoming: null,
    outgoing: false,
    inCall: false,
    callType: null
  });
  const [callStatus, setCallStatus] = useState("");
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [callHistory, setCallHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(`callHistory:${userId || "anon"}:${id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const currentCallRef = useRef(null);
  const callInProgressRef = useRef(false);
  const ringCtxRef = useRef(null);
  const ringTimerRef = useRef(null);

  const saveHistory = (history) => {
    try {
      localStorage.setItem(`callHistory:${userId || "anon"}:${id}`, JSON.stringify(history));
    } catch {
      // ignore
    }
  };

  const addCallLog = ({ type, direction, status }) => {
    const entry = {
      id: Date.now(),
      type,
      direction,
      status,
      at: new Date().toISOString()
    };
    setCallHistory((prev) => {
      const next = [entry, ...prev].slice(0, 10);
      saveHistory(next);
      return next;
    });
  };

  const stopRingtone = () => {
    if (ringTimerRef.current) {
      clearInterval(ringTimerRef.current);
      ringTimerRef.current = null;
    }
    if (ringCtxRef.current) {
      ringCtxRef.current.close();
      ringCtxRef.current = null;
    }
  };

  const startRingtone = (kind = "incoming") => {
    stopRingtone();
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      ringCtxRef.current = ctx;

      const playBeep = () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = kind === "incoming" ? 900 : 600;
        gain.gain.value = 0.05;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      };

      playBeep();
      ringTimerRef.current = setInterval(playBeep, 900);
    } catch {
      // ignore autoplay blocks
    }
  };

  const formatCallLabel = (entry) => {
    const icon = entry.type === "video" ? "🎥" : "📞";
    const dir = entry.direction === "incoming" ? "⬅" : "➡";
    const time = new Date(entry.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${icon} ${dir} ${entry.status} • ${time}`;
  };

  const getMediaStream = async (desiredType) => {
    try {
      if (desiredType === "video") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true },
            video: { width: { ideal: 640 }, height: { ideal: 480 } }
          });
          return { stream, actualType: "video" };
        } catch (videoErr) {
          console.warn("Video failed, falling back to audio:", videoErr.name);
          if (videoErr.name === "NotFoundError" || videoErr.name === "OverconstrainedError" || videoErr.name === "NotAllowedError") {
            setCallStatus("Camera unavailable. Switching to audio...");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            return { stream, actualType: "audio" };
          }
          throw videoErr;
        }
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: false
        });
        return { stream, actualType: "audio" };
      }
    } catch (err) {
      console.error("Media stream error:", err);
      throw err;
    }
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/chat/${id}`);
      setMessages(data);
      setBlocked(false);
      setError("");
    } catch (err) {
      if (err.response?.status === 403) {
        setBlocked(true);
        setError("Chat unlocks after both accept the interest.");
      } else {
        setError("Failed to load messages");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`callHistory:${userId || "anon"}:${id}`);
      setCallHistory(stored ? JSON.parse(stored) : []);
    } catch {
      setCallHistory([]);
    }
  }, [id, userId]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    if (userId) {
      socket.emit("register", userId);
      console.log(`[Socket] Registering user: ${userId}`);
    }

    const onConnect = () => {
      console.log("[Socket] Connected");
      setSocketConnected(true);
      if (userId) {
        socket.emit("register", userId);
        console.log(`[Socket] Re-registered user after reconnect: ${userId}`);
      }
    };
    const onDisconnect = () => {
      console.log("[Socket] Disconnected");
      setSocketConnected(false);
    };

    const onOffer = async ({ from, offer, callType }) => {
      console.log(`[Socket] Received call:offer from ${from}, callType: ${callType}`);
      if (from !== id) {
        console.warn(`[Socket] Rejecting call from ${from}, expected ${id}`);
        return;
      }
      startRingtone("incoming");
      currentCallRef.current = { type: callType, direction: "incoming" };
      setCallStatus("Incoming call...");
      setCallState({ incoming: { from, offer, callType }, outgoing: false, inCall: false, callType });
    };

    const onAnswer = async ({ from, answer }) => {
      console.log(`[Socket] Received call:answer from ${from}`);
      if (from !== id) return;
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(answer);
        stopRingtone();
        setCallStatus("Connected");
        callInProgressRef.current = true;
        setCallState((prev) => ({ ...prev, outgoing: false, inCall: true }));
      }
    };

    const onIce = async ({ from, candidate }) => {
      if (from !== id) return;
      if (peerRef.current && candidate) {
        try {
          await peerRef.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("ICE error:", err);
        }
      }
    };

    const onReject = ({ from }) => {
      console.log(`[Socket] Received call:reject from ${from}`);
      if (from !== id) return;
      addCallLog({
        type: currentCallRef.current?.type || "audio",
        direction: currentCallRef.current?.direction || "outgoing",
        status: "rejected"
      });
      endCall(false);
    };

    const onEnd = ({ from }) => {
      console.log(`[Socket] Received call:end from ${from}`);
      if (from !== id) return;
      addCallLog({
        type: currentCallRef.current?.type || "audio",
        direction: currentCallRef.current?.direction || "outgoing",
        status: callInProgressRef.current ? "ended" : "missed"
      });
      endCall(false);
    };

    socket.on("call:offer", onOffer);
    socket.on("call:answer", onAnswer);
    socket.on("call:ice", onIce);
    socket.on("call:reject", onReject);
    socket.on("call:end", onEnd);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("call:offer", onOffer);
      socket.off("call:answer", onAnswer);
      socket.off("call:ice", onIce);
      socket.off("call:reject", onReject);
      socket.off("call:end", onEnd);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      endCall(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userId]);

  const createPeer = (targetId) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        // Google STUN servers (free, reliable)
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        
        // Mozilla STUN server
        { urls: "stun:stun.services.mozilla.com" },
        
        // Cloudflare STUN server
        { urls: "stun:stun.cloudflare.com:3478" },
        
        // TURN server (optional - uncomment and configure for production)
        // Required for users behind strict firewalls
        // Get free TURN servers from: https://www.metered.ca/tools/openrelay/
        // {
        //   urls: "turn:openrelay.metered.ca:80",
        //   username: "openrelayproject",
        //   credential: "openrelayproject"
        // },
        // {
        //   urls: "turn:openrelay.metered.ca:443",
        //   username: "openrelayproject",
        //   credential: "openrelayproject"
        // }
      ],
      iceCandidatePoolSize: 10,
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require"
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("call:ice", { to: targetId, from: userId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }
      remoteStreamRef.current.addTrack(event.track);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    };

    peerRef.current = pc;
    return pc;
  };

  const startCall = async (callType) => {
    if (!userId) {
      setCallStatus("Login required to place calls.");
      console.warn("[Call] Missing userId");
      return;
    }
    if (!socketConnected) {
      setCallStatus("Connecting to call server... please try again.");
      console.warn("[Call] Socket not connected");
      return;
    }
    if (blocked) {
      setCallStatus("Calls unlock after mutual acceptance.");
      console.warn("[Call] Calls blocked");
      return;
    }
    try {
      console.log(`[Call] Starting ${callType} call to partner: ${id}, from user: ${userId}`);
      startRingtone("outgoing");
      setCallStatus("Calling...");
      setCallState({ incoming: null, outgoing: true, inCall: false, callType });
      const { stream, actualType } = await getMediaStream(callType);
      const effectiveType = actualType || callType;
      currentCallRef.current = { type: effectiveType, direction: "outgoing" };
      setCallState({ incoming: null, outgoing: true, inCall: false, callType: effectiveType });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = createPeer(id);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log(`[Call] Emitting call:offer to ${id} with callType: ${effectiveType}`);
      socket.emit("call:offer", { to: id, from: userId, offer, callType: effectiveType });
    } catch (err) {
      console.error("[Call] Start error:", err);
      setCallStatus(`Call failed: ${err.name || "MediaError"}`);
      endCall(false, "failed");
    }
  };

  const acceptCall = async () => {
    if (!callState.incoming) return;
    let { from, offer, callType } = callState.incoming;
    try {
      stopRingtone();
      setCallStatus("Connecting...");
      const media = await getMediaStream(callType);
      const stream = media.stream;
      const actualType = media.actualType || callType;
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = createPeer(from);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("call:answer", { to: from, from: userId, answer });
      currentCallRef.current = { type: actualType, direction: "incoming" };
      setCallStatus("Connected");
      callInProgressRef.current = true;
      setCallState({ incoming: null, outgoing: false, inCall: true, callType: actualType });
    } catch (err) {
      console.error("Accept call error:", err);
      setCallStatus(`Call failed: ${err.name || "MediaError"}`);
      rejectCall();
    }
  };

  const rejectCall = () => {
    if (callState.incoming?.from) {
      socket.emit("call:reject", { to: callState.incoming.from, from: userId });
    }
    addCallLog({
      type: callState.callType || "audio",
      direction: "incoming",
      status: "rejected"
    });
    callInProgressRef.current = false;
    endCall(false);
  };

  function endCall(notify = true, reason) {
    if (notify && id) {
      socket.emit("call:end", { to: id, from: userId });
    }

    stopRingtone();
    callInProgressRef.current = false;

    if (peerRef.current) {
      peerRef.current.onicecandidate = null;
      peerRef.current.ontrack = null;
      peerRef.current.close();
      peerRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((t) => t.stop());
      remoteStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    if (reason && currentCallRef.current) {
      addCallLog({
        type: currentCallRef.current.type || "audio",
        direction: currentCallRef.current.direction || "outgoing",
        status: reason
      });
    }

    currentCallRef.current = null;
    setCallState({ incoming: null, outgoing: false, inCall: false, callType: null });
    setCallStatus("");
  }

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      const { data } = await API.post("/chat/send", { receiver: id, text });
      setMessages(prev => [...prev, data]);
      setText("");
      setBlocked(false);
      setError("");
    } catch (err) {
      if (err.response?.status === 403) {
        setBlocked(true);
        setError("Chat unlocks after both accept the interest.");
      } else {
        setError("Failed to send message");
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-96px)] bg-white rounded-3xl shadow">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
          U
        </div>
        <div>
          <p className="font-semibold">User {id}</p>
          <p className="text-xs text-gray-400">Mutual chat required</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => startCall("audio")}
            disabled={loading || callState.inCall || callState.outgoing}
            className="px-3 py-2 rounded-full text-sm text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            📞 Call
          </button>
          <button
            onClick={() => startCall("video")}
            disabled={loading || callState.inCall || callState.outgoing}
            className="px-3 py-2 rounded-full text-sm text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            🎥 Video
          </button>
        </div>
      </div>

      {(callStatus || callHistory.length > 0) && (
        <div className="px-4 py-2 border-b bg-white/80">
          {callStatus && (
            <p className="text-xs text-gray-600">
              Call status: <span className="font-semibold text-gray-800">{callStatus}</span>
            </p>
          )}
          <p className="text-[11px] text-gray-500 mt-1">
            Call server: {socketConnected ? "Connected" : "Connecting..."}
          </p>
          {callHistory.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {callHistory.slice(0, 3).map((entry) => (
                <span
                  key={entry.id}
                  className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                >
                  {formatCallLabel(entry)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-pink-50 to-purple-50">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500">Loading messages…</div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-red-500 text-sm text-center px-4">{error}</div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <div className="text-gray-500 text-center">
              <p className="text-2xl mb-2">💬</p>
              <p>Say hi to start the conversation</p>
            </div>
            <div className="w-full max-w-lg">
              <SmartIcebreakers userId={id} onSelect={(msg) => setText(msg)} />
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const fromMe = msg.sender === undefined ? msg.fromMe : msg.sender !== id;
            return (
              <div
                key={msg._id || msg.createdAt}
                className={`flex ${fromMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm ${
                    fromMe
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-700 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${fromMe ? "text-pink-100" : "text-gray-400"} text-right`}
                  >
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-3">
        <input
          type="text"
          placeholder="Type a message…"
          className="flex-1 px-4 py-2 rounded-full border text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-pink-400 outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={blocked}
        />

        <button
          onClick={sendMessage}
          className={`px-6 py-2 rounded-full text-white font-semibold shadow hover:scale-105 transition ${
            blocked ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-pink-500 to-purple-600"
          }`}
          disabled={blocked}
        >
          {blocked ? "Locked" : "Send"}
        </button>
      </div>

      {(callState.incoming || callState.outgoing || callState.inCall) && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-between">
              <div className="font-semibold">
                {callState.incoming && "Incoming "}
                {callState.callType === "video" ? "Video Call" : "Voice Call"}
                {callState.outgoing && " (Calling...)"}
              </div>
              <button
                onClick={() => {
                  const reason = callInProgressRef.current
                    ? "ended"
                    : callState.outgoing
                      ? "canceled"
                      : "ended";
                  endCall(true, reason);
                }}
                className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30"
              >
                End
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-900">
              <div className="bg-black rounded-xl overflow-hidden relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-64 object-cover ${callState.callType === "video" ? "" : "hidden"}`}
                />
                {callState.callType !== "video" && (
                  <div className="h-64 flex items-center justify-center text-white">
                    🎤 Audio Call
                  </div>
                )}
                <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">You</span>
              </div>
              <div className="bg-black rounded-xl overflow-hidden relative">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-64 object-cover ${callState.callType === "video" ? "" : "hidden"}`}
                />
                {callState.callType !== "video" && (
                  <div className="h-64 flex items-center justify-center text-white">
                    🎧 Connected
                  </div>
                )}
                <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">Partner</span>
              </div>
            </div>

            {callState.incoming && (
              <div className="flex items-center justify-center gap-4 p-4 bg-white">
                <button
                  onClick={acceptCall}
                  className="px-6 py-2 rounded-full bg-green-500 text-white font-semibold"
                >
                  Accept
                </button>
                <button
                  onClick={rejectCall}
                  className="px-6 py-2 rounded-full bg-red-500 text-white font-semibold"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
