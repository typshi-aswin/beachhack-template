from asr.transcriber import transcribe_audio
import json

AUDIO_PATH = "test_audio/sample.wav"

if __name__ == "__main__":
    result = transcribe_audio(AUDIO_PATH)
    print(json.dumps(result, indent=2))
