'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { Results } from '@mediapipe/hands'
import type { Hands } from '@mediapipe/hands'

interface PoseDetectorProps {
  onCaptured: (dataUrl: string) => void
  stepProgress: (poseStep: number) => void
}

const PoseDetector: React.FC<PoseDetectorProps> = ({ onCaptured, stepProgress }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [poseStep, setPoseStep] = useState<number>(1)
  const [countdown, setCountdown] = useState<number | null>(null)
  //   const [message, setMessage] = useState<string>('Lakukan pose 1')

  useEffect(() => {
    let hands: Hands | null = null
    let animationFrameId: number

    const setupHandPose = async () => {
      //   console.log('init MediaPipe Hands...')
      //   await detect tunggu vidio render baru import
      const { Hands } = await import('@mediapipe/hands')

      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      // Pastikan video dari kamera aktif
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      video.srcObject = stream
      await video.play()
      //   mulai uploud video
      hands = new Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
      })

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      })

      hands.onResults((results: Results) => {
        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(results.image as CanvasImageSource, 0, 0, canvas.width, canvas.height)

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0]
          const fingerCount = getFingerCount(landmarks)

          //   tulisan pada layar vidio di comment saja
          //   ctx.font = '24px Poppins'
          //   ctx.fillStyle = 'lime'
          //   ctx.fillText(`Pose: ${fingerCount}`, 20, 40)

          handlePoseDetection(fingerCount, results.image)
        }
        ctx.restore()
      })
      //  loop manual kirim frame ke MediaPipe
      const processVideo = async () => {
        if (!hands || !videoRef.current) return
        await hands.send({ image: videoRef.current })
        animationFrameId = requestAnimationFrame(processVideo)
      }
      processVideo()
    }

    setupHandPose().catch(console.error)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (hands) hands.close()
      const stream = videoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const expectedSequence = [3, 2, 1]
  //  Logika deteksi urutan pose
  const handlePoseDetection = (fingerCount: number, image: CanvasImageSource) => {
    //   const [poseStep, setPoseStep] = useState<number>(0) // untuk step
    //   const [message, setMessage] = useState<string>('Show pose 1 to start') // untuk message
    //   postStep di awal = 0
    // finger sesuai jari
    //  expectedSequence 3 jari 2 jari 1 jari [3,2,1]

    // poseStep mulai dari 1 dan ketika 3   capturePhoto(image)
    // console.log(poseStep , " <<<<< here")
    // poseStep mulai dari 1
    setPoseStep((prev) => {
      //    karena dipangil terus menerus
      //    gunakan prev karena state tidak sempat update
      if (prev === 1 && fingerCount === expectedSequence[0]) {
        stepProgress(prev)
        // setMessage('Lakukan pose 2 ')
        return 2
      }

      if (prev === 2 && fingerCount === expectedSequence[1]) {
        stepProgress(prev)
        // setMessage('Lakukan pose 3 ')
        return 3
      }

      if (prev === 3 && fingerCount === expectedSequence[2]) {
        stepProgress(prev)
        startCountdown(image)
        // setMessage(' Foto berhasil diambil!')
        return 1 // reset ke awal
      }
      // kalau tidak cocok, tetap di posisi sebelumnya
      stepProgress(prev)
      return prev
    })
  }

  //   countdown
  const startCountdown = (image: CanvasImageSource) => {
    setCountdown(3)
    let count = 3
    const timer = setInterval(() => {
      count--
      if (count > 0) {
        setCountdown(count)
      } else {
        clearInterval(timer)
        setCountdown(null)
        capturePhoto(image)
      }
    }, 1000)
  }

  const capturePhoto = (image: CanvasImageSource) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    canvas.width = 640
    canvas.height = 480
    context.drawImage(image, 0, 0, 640, 480)
    const dataUrl = canvas.toDataURL('image/png')
    onCaptured(dataUrl)
  }

  //  Hitung jari terangkat
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFingerCount = (landmarks: any[]) => {
    let count = 0
    const fingers = [8, 12, 16, 20] // index - pinky
    for (let i = 0; i < fingers.length; i++) {
      const tip = landmarks[fingers[i]]
      const pip = landmarks[fingers[i] - 2]
      if (tip.y < pip.y) count++
    }
    const thumbTip = landmarks[4]
    const thumbIP = landmarks[3]
    if (thumbTip.x > thumbIP.x) count++
    return count
  }

  return (
    <div className="flex flex-col items-center gap-3 relative">
      <div className="relative">
        <video
          ref={videoRef}
          className="hidden"
          playsInline
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="shadow-md rounded-lg"
        />

        {/* note sudut kiri bawah */}
        {/* <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-4 py-2 rounded-lg">{message}</div> */}
        {/* Overlay countdown */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-7xl font-bold transition-all duration-300">
            {countdown}
          </div>
        )}
      </div>
    </div>
  )
}

export default PoseDetector
