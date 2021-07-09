import React, { useState, useEffect, useRef, memo } from "react";

const App = memo(() => {
  const [playPause, setPlayPause] = useState(true);

  const vidRef = useRef();
  const play_Pause_Ref = useRef();
  const volumeRef = useRef();
  const volumeBarRef = useRef();
  const vidProgressRef = useRef();
  const vidProgressBarRef = useRef();
  const muteRef = useRef();
  const [mute, setMute] = useState(false);

  useEffect(() => {
    (function () {
      const vidState = vidRef.current;
      if (vidState.muted) {
        setMute(true);
      } else {
        setMute(false);
      }
      if (vidState.paused) {
        console.log("paused");
        setPlayPause(true);
      } else {
        console.log("play");
        setPlayPause(false);
      }
    })();
  });

  useEffect(() => {
    (function () {
      const video = vidRef.current;
      const play_Pause_Btn = play_Pause_Ref.current;
      const volume = volumeRef.current;
      const volumeBar = volumeBarRef.current;
      const vidProgress = vidProgressRef.current;
      const vidProgressBar = vidProgressBarRef.current;
      const volMute = muteRef.current;

      function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        vidProgressBar.style.width = `${progressPercent}%`;
        if (video.ended) {
          setPlayPause(true);
        }
      }
      function setProgress(e) {
        const width = this.clientWidth;
        // console.log(width);
        const clickX = e.offsetX;
        // console.log(clickX);
        const duration = video.duration;

        video.currentTime = (clickX / width) * duration;
      }
      function alterVolume(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        video.volume = Number((clickX / width).toFixed(2));
      }
      function alterVidVolumeBar(e) {
        const videoVolume = Math.round(video.volume * 100);
        volumeBar.style.width = `${videoVolume}%`;
        // console.log(videoVolume);
      }

      // handle Volume
      volume.addEventListener("click", alterVolume);
      volume.addEventListener("click", alterVidVolumeBar);
      window.addEventListener("load", alterVidVolumeBar);
      //handle the volume
      volMute.addEventListener("click", () => {
        video.muted = !video.muted;
        if (video.muted) {
          volumeBar.style.display = "none";
        } else {
          volumeBar.style.display = "block";
        }
        setMute(video.muted);
      });
      //toggle play and pause state
      play_Pause_Btn.addEventListener("click", () => {
        if (video.paused || video.ended) {
          setPlayPause(false);
          video.play();
        } else {
          setPlayPause(true);
          video.pause();
        }
      });
      //update video progress
      video.addEventListener("timeupdate", updateProgress);
      vidProgress.addEventListener("click", setProgress);
    })();
  }, []);

  return (
    <div className="App bg-dark">
      <div className="h100 d-flex align-items-center">
        <div className="container main-container">
          <figure className="bg-light">
            <video id="vid" className="w-100" ref={vidRef}>
              <source src="video/sintel-short.mp4" />
            </video>
            <figcaption>
              <div className="progress-container p-2">
                <div className="progress rounded-0" ref={vidProgressRef}>
                  <div
                    className="progress-bar-striped video-progress bg-info"
                    ref={vidProgressBarRef}
                  ></div>
                </div>
              </div>
              <div className="d-flex fs-6 all-control justify-content-evenly align-items-center p-2">
                {/* Start controls */}
                <div className="main-controls  d-flex">
                  <div className="controls">
                    <button className="btn">
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
                    <button className="btn">
                      <i className="fas fa-fast-forward"></i>
                    </button>
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
                    <button className="btn">
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
});

export default App;
