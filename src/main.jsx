import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AtSign,
  Camera,
  ChevronLeft,
  Heart,
  Image,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Play,
  Plus,
  Search,
  Send,
  Smile,
  Star
} from "lucide-react";
import "./styles.css";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const friends = [
  { id: "moran", name: "@漠然MoRaN", short: "@漠然MoR...", avatar: asset("assets/avatar-moran.png") },
  { id: "baba", name: "@阿巴阿巴", short: "@阿巴阿巴", avatar: asset("assets/avatar-baba.png") },
  { id: "lala", name: "@啦啦", short: "@啦啦", avatar: asset("assets/avatar-lala.png") },
  { id: "xiaobo", name: "@小波", short: "@小波", avatar: asset("assets/avatar-xiaobo.png") }
];

const suggestions = [
  "像极了你那不太聪明的朋友",
  "像极了你那只不太聪明的猫",
  "像极了你每次装作没听见",
  "像极了你说马上就到"
];

function App() {
  const [screen, setScreen] = useState("video");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [draft, setDraft] = useState(suggestions[0]);
  const [playMode, setPlayMode] = useState("text");
  const [selectedImage, setSelectedImage] = useState(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      setScale(Math.min(1, (window.innerHeight - 32) / 844, (window.innerWidth - 32) / 390));
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const finalText = useMemo(() => {
    if (playMode === "image") return selectedFriend ? selectedFriend.name : "";
    return selectedFriend ? `${draft} ${selectedFriend.name}` : draft;
  }, [draft, playMode, selectedFriend]);

  function openPlay() {
    setScreen("compose");
  }

  function selectFriend(friend) {
    setSelectedFriend(friend);
  }

  function shareToFriend() {
    if (!selectedFriend) return;
    setScreen("dm");
  }

  function continueEdit() {
    setScreen("compose");
  }

  return (
    <main className="app-stage">
      <div className="phone-shell" style={{ width: 390 * scale, height: 844 * scale }}>
        <div className="phone" style={{ transform: `scale(${scale})` }}>
          {screen !== "dm" && (
            <VideoCanvas
              cueText={screen === "compose" ? finalText : ""}
              cueImage={screen === "compose" && playMode === "image" ? selectedImage : null}
              cueMode={screen === "compose" ? playMode : "text"}
              onPlay={openPlay}
              showEntry={screen === "video"}
              onBack={() => setScreen("video")}
            />
          )}

          {screen === "compose" && (
            <PlaySheet
              draft={draft}
              finalText={finalText}
              friends={friends}
              playMode={playMode}
              selectedImage={selectedImage}
              selectedFriend={selectedFriend}
              onDraftChange={setDraft}
              onFriendChange={selectFriend}
              onImageChange={setSelectedImage}
              onModeChange={setPlayMode}
              onShare={shareToFriend}
            />
          )}

          {screen === "dm" && (
            <DmScreen
              finalText={finalText}
              playMode={playMode}
              selectedImage={selectedImage}
              selectedFriend={selectedFriend || friends[0]}
              onBack={() => setScreen("compose")}
              onContinueEdit={continueEdit}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function StatusBar({ dark = false }) {
  return (
    <div className={`status-bar ${dark ? "dark" : ""}`}>
      <div>
        <strong>{dark ? "21:38" : "15:50"}</strong>
        <span className="user-dot" />
      </div>
      <div className="signal">
        <span />
        <span />
        <span />
        <b>⚡</b>
      </div>
    </div>
  );
}

function VideoCanvas({ cueText, cueImage, cueMode, onPlay, showEntry, onBack }) {
  const [entryReady, setEntryReady] = useState(false);

  useEffect(() => {
    setEntryReady(false);
    if (!showEntry) return undefined;
    const timer = window.setTimeout(() => setEntryReady(true), 3200);
    return () => window.clearTimeout(timer);
  }, [showEntry]);

  function handleVideoTime(event) {
    if (showEntry && !entryReady && event.currentTarget.currentTime >= 3) {
      setEntryReady(true);
    }
  }

  return (
    <section className="video-screen">
      <video
        className="real-video"
        src={asset("assets/entry-video.mp4")}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onTimeUpdate={handleVideoTime}
      />
      <div className="video-shade" />

      <StatusBar />
      <div className="video-nav">
        <button type="button" className="icon-button" onClick={onBack}>
          <ChevronLeft size={32} />
        </button>
        <button type="button" className="icon-button">
          <Search size={30} />
        </button>
      </div>

      {cueMode === "image" && cueImage ? (
        <div className="image-cue-preview">
          <img src={cueImage} alt="" />
          {cueText && <div className="caption-bubble image-caption">{cueText}</div>}
        </div>
      ) : (
        cueText && <div className="caption-bubble">{cueText}</div>
      )}

      <aside className="side-actions">
        <Avatar src={asset("assets/avatar-xiaobo.png")} className="profile-plus" />
        <ActionIcon icon={<Heart fill="white" />} label="17.6万" />
        <ActionIcon icon={<MessageCircle fill="white" />} label="7.9万" />
        <ActionIcon icon={<Star fill="white" />} label="7356" />
        <ActionIcon icon={<Send fill="white" />} label="44.0万" />
      </aside>

      {showEntry && entryReady && (
        <button type="button" className="cue-entry" onClick={onPlay}>
          <img className="cue-entry-art" src={asset("assets/cue-entry-icon.png")} alt="" />
          <strong>找朋友来</strong>
          <span>玩一下!</span>
        </button>
      )}

      <div className="video-meta">
        <p>
          <strong>@Healer✨</strong>
          <span>2023年3月14日</span>
        </p>
        <p>像极了你那不太聪明的朋友</p>
        <p className="tag-row">去汽水听〉 #好给你　把回忆拼好给</p>
      </div>

      <div className="comment-bar">
        <span>分享你此刻的想法</span>
        <Image size={24} />
        <AtSign size={25} />
        <Smile size={25} />
      </div>
    </section>
  );
}

function PlaySheet({
  draft,
  finalText,
  friends,
  playMode,
  selectedImage,
  selectedFriend,
  onDraftChange,
  onImageChange,
  onFriendChange,
  onModeChange,
  onShare
}) {
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsEntering(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  function handleImageInput(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    onImageChange(URL.createObjectURL(file));
  }

  return (
    <section className={`play-sheet ${isEntering ? "entering" : ""} ${playMode === "image" ? "image-mode" : ""}`}>
      <div className="sheet-title">
        <img className="sheet-cue-icon" src={asset("assets/cue-small-icon.png")} alt="" />
        <div>
          <h1>你想怎么玩?</h1>
        </div>
      </div>

      <div className="play-options">
        <button
          type="button"
          className={`play-option ${playMode === "text" ? "active" : ""}`}
          onClick={() => onModeChange("text")}
        >
          <img src={asset("assets/edit-icon.png")} alt="" />
          <span>改一句</span>
        </button>
        <button
          type="button"
          className={`play-option ${playMode === "image" ? "active" : ""}`}
          onClick={() => onModeChange("image")}
        >
          <img src={asset("assets/image-icon.png")} alt="" />
          <span>配图片</span>
        </button>
      </div>

      {playMode === "text" ? (
        <>
          <label className="field-label" htmlFor="copy-input">
            预览文案
          </label>
          <textarea
            id="copy-input"
            value={finalText}
            onChange={(event) => {
              const nextValue = selectedFriend
                ? event.target.value.replace(` ${selectedFriend.name}`, "")
                : event.target.value;
              onDraftChange(nextValue);
            }}
            className="copy-input"
            rows={2}
          />
        </>
      ) : (
        <>
          <p className="field-label">选择图片上传</p>
          <label className={`image-upload ${selectedImage ? "has-image" : ""}`}>
            {selectedImage ? (
              <img src={selectedImage} alt="" />
            ) : (
              <>
                <img src={asset("assets/image-icon.png")} alt="" />
                <span>调用相册上传</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageInput} />
          </label>
        </>
      )}

      <p className="field-label friend-label">分享给好友</p>
      <div className="friend-row">
        {friends.map((friend) => (
          <button
            type="button"
            key={friend.id}
            className={`friend ${selectedFriend?.id === friend.id ? "active" : ""}`}
            onClick={() => onFriendChange(friend)}
          >
            <Avatar src={friend.avatar} />
            <span>{friend.short}</span>
          </button>
        ))}
      </div>
      <button type="button" className="share-button" onClick={onShare} disabled={!selectedFriend}>
        分享给朋友
      </button>
    </section>
  );
}

function DmScreen({ finalText, playMode, selectedImage, selectedFriend, onBack, onContinueEdit }) {
  const displayName = selectedFriend.name.replace("@", "");
  const [showReply, setShowReply] = useState(false);
  const isImageCue = playMode === "image" && selectedImage;
  const replyText = finalText.includes(selectedFriend.name)
    ? finalText.replace(selectedFriend.name, "@阿黎")
    : "@阿黎";

  useEffect(() => {
    const timer = window.setTimeout(() => setShowReply(true), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className={`dm-screen ${showReply ? "has-reply" : ""}`}>
      <StatusBar dark />
      <header className="dm-header">
        <button type="button" className="dm-icon" onClick={onBack}>
          <ChevronLeft size={31} />
        </button>
        <Avatar src={selectedFriend.avatar} small />
        <strong>{displayName}</strong>
        <div className="dm-actions">
          <Phone size={25} />
          <MoreHorizontal size={28} />
        </div>
      </header>

      <div className="dm-thread">
        <p className="safety-copy">
          为保障用户沟通安全，未互相关注的陌生人违规消息可能会被处理，请遵守法律法规和社区规范
        </p>

        <div className="profile-card">
          <Avatar src={selectedFriend.avatar} large />
          <h2>{displayName}</h2>
        </div>

        <p className="cue-line outgoing-cue">阿黎 在玩一下里cue了{displayName}</p>

        <div className="message-row">
          <MessageVideoCard image={isImageCue ? selectedImage : null} text={finalText} />
          <Avatar src={asset("assets/avatar-sender.png")} small className="sender-avatar" />
        </div>

        {showReply && (
          <div className="reply-thread">
            <p className="cue-line incoming-cue">{displayName} 在玩一下里cue了阿黎</p>
            <div className="incoming-row">
              <Avatar src={selectedFriend.avatar} small className="incoming-avatar" />
              <div>
                <MessageVideoCard className="incoming-video" image={isImageCue ? selectedImage : null} text={replyText} />
                <button type="button" className="reply-cue" onClick={onContinueEdit}>
                  <img className="reply-cue-icon" src={asset("assets/cue-small-icon.png")} alt="" />
                  <strong>我也玩一下!</strong>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="quick-replies">
        {["🌝 早点睡", "🥺 比心", "🥱 哈欠", "👍 赞", "😂 捂脸"].map((item) => (
          <button type="button" key={item}>
            {item}
          </button>
        ))}
      </div>

      <div className="dm-input">
        <Camera size={28} />
        <span>只能发送一条消息</span>
        <MessageCircle size={28} />
        <Smile size={28} />
        <Plus size={28} />
      </div>
    </section>
  );
}

function MessageVideoCard({ image, text, className = "" }) {
  return (
    <div className={`message-video ${className}`}>
      <video className="message-video-cover" src={asset("assets/entry-video.mp4")} muted playsInline preload="metadata" />
      {image ? (
        <div className="message-image-preview">
          <img src={image} alt="" />
          <div className="mini-caption image-mini-caption">{text}</div>
        </div>
      ) : (
        <div className="mini-caption">{text}</div>
      )}
      <button type="button" className="play-center" aria-label="播放">
        <Play size={44} fill="white" />
      </button>
    </div>
  );
}

function ActionIcon({ icon, label }) {
  return (
    <button type="button" className="action-icon">
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Avatar({ src, small = false, large = false, className = "" }) {
  return (
    <span className={`avatar ${small ? "small" : ""} ${large ? "large" : ""} ${className}`}>
      <img src={src} alt="" />
    </span>
  );
}

createRoot(document.getElementById("root")).render(<App />);
