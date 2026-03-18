"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface FaceInput {
  jump: boolean;
  doubleJump: boolean;
  moveLeft: boolean;
  moveRight: boolean;
}

const MODEL_URL =
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model";

const MOUTH_OPEN_THRESHOLD = 18;
const EYEBROW_RAISE_THRESHOLD = 22;
const TILT_THRESHOLD = 15;

export function useFaceDetection(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const faceInputRef = useRef<FaceInput>({
    jump: false,
    doubleJump: false,
    moveLeft: false,
    moveRight: false,
  });
  const prevMouthOpen = useRef(false);
  const prevBrowRaised = useRef(false);
  const prevTiltLeft = useRef(false);
  const prevTiltRight = useRef(false);
  const animFrameRef = useRef<number>(0);
  const faceapiRef = useRef<typeof import("@vladmandic/face-api") | null>(null);

  const loadModels = useCallback(async () => {
    if (isLoaded || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const faceapi = await import("@vladmandic/face-api");
      faceapiRef.current = faceapi;
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
      setIsLoaded(true);
    } catch (e) {
      setError("顔認識モデルの読み込みに失敗しました");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isLoading]);

  const detectLoop = useCallback(async () => {
    const video = videoRef.current;
    const faceapi = faceapiRef.current;
    if (!video || !faceapi || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(detectLoop);
      return;
    }

    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks(true);

      if (detection) {
        const landmarks = detection.landmarks;
        const mouth = landmarks.getMouth();
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const leftBrow = landmarks.getLeftEyeBrow();
        const rightBrow = landmarks.getRightEyeBrow();

        // 口の開き: 上唇中央(14)と下唇中央(18)の距離
        const upperLipY = (mouth[13].y + mouth[14].y + mouth[15].y) / 3;
        const lowerLipY = (mouth[17].y + mouth[18].y + mouth[19].y) / 3;
        const mouthOpenDist = lowerLipY - upperLipY;
        const isMouthOpen = mouthOpenDist > MOUTH_OPEN_THRESHOLD;

        // 眉の上昇: 眉の平均Y と 目の平均Y の距離
        const leftBrowY = leftBrow.reduce((s, p) => s + p.y, 0) / leftBrow.length;
        const rightBrowY = rightBrow.reduce((s, p) => s + p.y, 0) / rightBrow.length;
        const leftEyeY = leftEye.reduce((s, p) => s + p.y, 0) / leftEye.length;
        const rightEyeY = rightEye.reduce((s, p) => s + p.y, 0) / rightEye.length;
        const leftBrowEyeDist = leftEyeY - leftBrowY;
        const rightBrowEyeDist = rightEyeY - rightBrowY;
        const avgBrowEyeDist = (leftBrowEyeDist + rightBrowEyeDist) / 2;
        const isBrowRaised = avgBrowEyeDist > EYEBROW_RAISE_THRESHOLD;

        // 頭の傾き: rollAngle
        const angle = detection.angle?.roll ?? 0;
        const isTiltLeft = angle < -TILT_THRESHOLD;
        const isTiltRight = angle > TILT_THRESHOLD;

        // エッジ検出 (前フレームと比較)
        faceInputRef.current = {
          jump: isMouthOpen && !prevMouthOpen.current,
          doubleJump: isBrowRaised && !prevBrowRaised.current,
          moveLeft: isTiltLeft && !prevTiltLeft.current,
          moveRight: isTiltRight && !prevTiltRight.current,
        };

        prevMouthOpen.current = isMouthOpen;
        prevBrowRaised.current = isBrowRaised;
        prevTiltLeft.current = isTiltLeft;
        prevTiltRight.current = isTiltRight;
      } else {
        faceInputRef.current = { jump: false, doubleJump: false, moveLeft: false, moveRight: false };
      }
    } catch {
      // detection error is non-fatal
    }

    animFrameRef.current = requestAnimationFrame(detectLoop);
  }, [videoRef]);

  useEffect(() => {
    if (isLoaded && videoRef.current) {
      animFrameRef.current = requestAnimationFrame(detectLoop);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isLoaded, videoRef, detectLoop]);

  return { isLoaded, isLoading, error, faceInputRef, loadModels };
}
