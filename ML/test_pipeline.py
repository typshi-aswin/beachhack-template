import json
from main import run_pipeline

AUDIO_PATH = "test_audio/sample.wav"
CONV_ID = "c_1001"
CUSTOMER_ID = "u_78"


if __name__ == "__main__":
    result = run_pipeline(
        audio_path=AUDIO_PATH,
        conv_id=CONV_ID,
        customer_id=CUSTOMER_ID
    )

    print("\n===== FINAL MODEL OUTPUT =====\n")
    print(json.dumps(result, indent=2))
