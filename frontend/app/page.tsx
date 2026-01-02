'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const websockRef = useRef<WebSocket | null>(null);
  const [data, setData] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    if (!websockRef.current) {
      websockRef.current = new WebSocket('ws://localhost:5000');

      websockRef.current.onopen = () => {
        console.log('WebSocket connection established');
      };

      websockRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      websockRef.current.onmessage = (event) => {
        const data = event.data;
        try {
          const parsedData = JSON.parse(data);

          if (parsedData.type === 'TurnInfo') {
            if (parsedData.event === 'EndOfTurn') {
              setData((prev) => prev + '\n' + parsedData.transcript);
            }
          }
        } catch (error) {
          console.error('Error parsing message data:', error);
        }
      };
    }

    return () => {
      if (websockRef.current) {
        websockRef.current.close();
      }
    };
  }, []);

  const onStart = async () => {
    if (!websockRef.current || websockRef.current.readyState !== WebSocket.OPEN)
      return;

    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioContextRef.current = new AudioContext({ sampleRate: 16000 }); // Deepgram prefers 16kHz

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // create asource node
      sourceRef.current = audioContextRef.current.createMediaStreamSource(
        streamRef.current
      );

      processorRef.current = audioContextRef.current.createScriptProcessor(
        4096, // buffer size
        1,
        1
      );

      processorRef.current.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(input.length);

        for (let i = 0; i < input.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, input[i])) * 0x7fff; // make sure the value [-1, 1]
        }

        websockRef.current?.send(pcm16.buffer);
      };

      setIsRecording(true);

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const onClose = () => {
    if (
      websockRef.current &&
      websockRef.current.readyState === WebSocket.OPEN
    ) {
      audioContextRef.current?.close();
      sourceRef.current?.disconnect();

      streamRef.current?.getTracks().forEach((track) => track.stop());

      // close the websocket connection
      websockRef.current.close();
      setIsRecording(false);
      setData('');
    }
  };
  return (
    <div className='flex h-screen justify-center items-center gap-6'>
      <div className='flex gap-4 items-center'>
        <Button disabled={isRecording} onClick={onStart}>
          Start
        </Button>
        <Button disabled={!isRecording} onClick={onClose}>
          Stop
        </Button>
      </div>

      {/* Audio Transcription */}
      <div className='text-lg bg-slate-200 border rounded-md min-h-72 max-w-xl w-full p-2 shadow'>
        {data}
      </div>
    </div>
  );
}
