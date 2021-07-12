import React, { useEffect, useRef, useState } from "react";

const App = () => {
  const [playPause, setPlayPause] = useState(true);
  const [vidCurrentTime, setVidCurrentTime] = useState("--");
  const [vidDuration, setVidDuration] = useState("--");

  const vidRef = useRef();
  const play_Pause_Ref = useRef();
  const volumeRef = useRef();
  const volumeBarRef = useRef();
  const vidProgressRef = useRef();
  const vidProgressBarRef = useRef();
  const muteRef = useRef();
  const zoomRef = useRef();
  const containerRef = useRef();
  const forwardRef = useRef();
  const backwardRef = useRef();
  const [mute, setMute] = useState();
  // ----------------------------------------
  // ---------------------------------------
  const CustomVideo = () => {
    const video = vidRef.current;
    const play_Pause_Btn = play_Pause_Ref.current;
    const volume = volumeRef.current;
    const volumeBar = volumeBarRef.current;
    const vidProgress = vidProgressRef.current;
    const vidProgressBar = vidProgressBarRef.current;
    const volMute = muteRef.current;
    const zoomBtn = zoomRef.current;
    const containerExpand = containerRef.current;
    const forwardBtn = forwardRef.current;
    const backwardBtn = backwardRef.current;
    const supportsVideo = !!document.createElement("video").canPlayType;
    if (supportsVideo) {
      function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const currentHrs = Math.floor(currentTime / 3600);
        const durationHrs = Math.floor(duration / 3600);
        // console.log(duration);
        const currentMin = Math.floor(currentTime / 60);
        const currentSec = Math.floor(currentTime - currentMin * 60);
        const durationMin = Math.floor(duration / 60);
        const durationSec = Math.floor(duration - durationMin * 60);
        setVidCurrentTime(currentHrs + ":" + currentMin + ":" + currentSec);
        setVidDuration(durationHrs + ":" + durationMin + ":" + durationSec);
        const progressPercent = (currentTime / duration) * 100;
        vidProgressBar.style.width = `${progressPercent}%`;
        if (video.ended) {
          setPlayPause(true);
        }
      }
      function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = video.duration;
        video.currentTime = (clickX / width) * duration;
      }
      function alterVolume(e) {
        video.muted = false;
        setMute(video.muted);
        const width = this.clientWidth;
        const clickX = e.offsetX;
        video.volume = Number((clickX / width).toFixed(2));
      }
      function alterVidVolumeBar(e) {
        const videoVolume = Math.round(video.volume * 100);
        volumeBar.style.width = `${videoVolume}%`;
      }
      function playAndPause() {
        const vidState = video.paused || video.ended;
        if (vidState) {
          setPlayPause(false);
          video.play();
        }
        if (!vidState) {
          setPlayPause(true);
          video.pause();
        }
      }
      function forwardVideo() {
        let num = 1;
        let time = [];
        for (let i = 0; i <= video.duration; i++) {
          time.push(i);
        }
        video.currentTime += time[num + 1];
      }
      function backwardVideo() {
        video.currentTime += -10;
      }
      // Checks if the document is currently in fullscreen mode
      const isFullScreen = function () {
        return !!(
          document.fullScreen ||
          document.webkitIsFullScreen ||
          document.mozFullScreen ||
          document.msFullscreenElement ||
          document.fullscreenElement
        );
      };
      // Fullscreen
      const handleFullscreen = function () {
        // If fullscreen mode is active...
        if (isFullScreen()) {
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if (document.webkitCancelFullScreen)
            document.webkitCancelFullScreen();
          else if (document.msExitFullscreen) document.msExitFullscreen();
        } else {
          if (containerExpand.requestFullscreen)
            containerExpand.requestFullscreen();
          else if (containerExpand.mozRequestFullScreen)
            containerExpand.mozRequestFullScreen();
          else if (containerExpand.webkitRequestFullScreen) {
            containerExpand.webkitRequestFullScreen();
          } else if (containerExpand.msRequestFullscreen)
            containerExpand.msRequestFullscreen();
        }
      };

      // -----------------------------------------
      // handle Volume
      volume.addEventListener("click", alterVolume);
      volume.addEventListener("click", alterVidVolumeBar);
      window.addEventListener("load", alterVidVolumeBar);
      video.addEventListener("volumechange", alterVidVolumeBar);
      //handle the mute volume
      volMute.addEventListener("click", () => {
        video.muted = !video.muted;
        setMute(video.muted);
      });
      //toggle play and pause state
      play_Pause_Btn.addEventListener("click", playAndPause);
      //update video progress
      video.addEventListener("timeupdate", updateProgress);
      vidProgress.addEventListener("click", setProgress);
      //seek foward and backward
      backwardBtn.addEventListener("click", backwardVideo);
      forwardBtn.addEventListener("click", forwardVideo);
      navigator.mediaSession.setActionHandler("previoustrack", backwardVideo);
      navigator.mediaSession.setActionHandler("nexttrack", forwardVideo);
      //set keyBoard control
      navigator.mediaSession.setActionHandler("play", playAndPause);
      navigator.mediaSession.setActionHandler("pause", playAndPause);
      //Handle full screen
      zoomBtn.addEventListener("click", handleFullscreen);
    }
  };

  useEffect(() => {
    CustomVideo();
  }, []);

  return (
    <div className="App bg-dark">
      <div className="h100 d-flex align-items-center">
        <div className="container main-container">
          <figure
            className="bg-dark d-flex flex-column justify-content-center"
            data-fullscreen="false"
            ref={containerRef}
          >
            <video id="vid" className="w-100" controls={false} ref={vidRef}>
              <source src="video/tears-of-steel-battle-clip-medium.mp4" />
            </video>
            <figcaption className="bg-white">
              <div className="progress-container p-2">
                <div className="progress rounded-0" ref={vidProgressRef}>
                  <div
                    className="progress-bar-striped video-progress bg-info"
                    ref={vidProgressBarRef}
                  >
                    <span className="tooltiptext rounded-0 py-0 px-1 btn fs-6 ">
                      {vidCurrentTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="d-flex fs-6 all-control justify-content-evenly align-items-center py-0 p-2">
                {/* Start controls */}
                <div className="main-controls align-items-center  d-flex">
                  <div className="controls">
                    <button className="btn" ref={backwardRef}>
                      <i className="fas fa-fast-backward" id="backward"></i>
                    </button>
                  </div>
                  <div className="controls">
                    <button
                      className="btn"
                      id="play_pause"
                      ref={play_Pause_Ref}
                    >
                      {playPause ? (
                        <i className="fas fa-play"></i>
                      ) : (
                        <i className="fas fa-pause"></i>
                      )}
                    </button>
                  </div>
                  <div className="controls">
                    <button className="btn" ref={forwardRef}>
                      <i className="fas fa-fast-forward"></i>
                    </button>
                  </div>
                  <div className="controls btn p-0">
                    {vidCurrentTime}/{vidDuration}
                  </div>
                </div>
                {/*-------------------- Seperate controls ----------- */}
                <div className="flex-grow-1 volume-control py-1">
                  <div className=" d-flex volume-control-main align-items-center">
                    <button className="btn p-1" ref={muteRef}>
                      {mute ? (
                        <i className="fas fa-volume-mute"></i>
                      ) : (
                        <i className="fas fa-volume-up"></i>
                      )}
                    </button>
                    <div
                      className="progress volume-progress rounded-0 w-50"
                      ref={volumeRef}
                    >
                      <div
                        className="bg-dark volume-progress-bar bg-dark"
                        ref={volumeBarRef}
                      ></div>
                    </div>
                  </div>
                </div>
                {/*-------------------- Seperate controls ----------- */}
                <div className="minor-controls">
                  <div className="controls d-flex float-end">
                    <button className="btn" ref={zoomRef}>
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>

                {/* End controls */}
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
};

export default App;
