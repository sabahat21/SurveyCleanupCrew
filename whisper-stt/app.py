import gradio as gr
import tempfile
import os
import shutil
from df.enhance import enhance, init_df, load_audio, save_audio
from dotenv import load_dotenv
load_dotenv()
import torch
from faster_whisper import WhisperModel

import google.generativeai as genai

model, df_state, _ = init_df()

device = "cuda" if torch.cuda.is_available() else "cpu"
compute_type = "float16" if device == "cuda" else "int8"

print(f"✅ Using device: {device}")

asr_model = WhisperModel("medium", device=device, compute_type=compute_type)

gemini_key = os.getenv("GEMINI_API_KEY")
if not gemini_key:
    raise ValueError("❌ GEMINI_API_KEY not found in environment variables.")
genai.configure(api_key=gemini_key)


def correct_sanskrit_text(raw_text: str) -> str:
    model = genai.GenerativeModel(model_name="gemini-2.0-flash")
    prompt = (
        "You are an expert Sanskrit linguist. "
        "Please return only the grammatically correct Sanskrit version of the given text. "
        "Do not provide translations, explanations, markdown, or formatting — only the corrected Sanskrit text, in plain text.\n\n"
        f"Input: {raw_text}"
    )
    response = model.generate_content(prompt)
    return response.text.strip()


def full_pipeline(audio_file):
    audio, _ = load_audio(audio_file, sr=df_state.sr())
    denoised_dir = tempfile.mkdtemp(prefix="denoised_")
    enhanced_path = os.path.join(denoised_dir, "enhanced.wav")
    enhanced = enhance(model, df_state, audio)
    save_audio(enhanced_path, enhanced, df_state.sr())
    if not os.path.isfile(enhanced_path):
        raise FileNotFoundError(f"❌ Denoised file not found at {enhanced_path}")
    segments, _ = asr_model.transcribe(enhanced_path, language="sa")
    raw_transcription = " ".join([s.text for s in segments])

    corrected_text = correct_sanskrit_text(raw_transcription) 

    return raw_transcription, corrected_text


iface = gr.Interface(
    fn=full_pipeline,
    inputs=gr.Audio(type="filepath", label="Upload Sanskrit Audio (.wav)"),
    outputs=[
        gr.Textbox(label="Raw Sanskrit Transcription"),
        gr.Textbox(label="Corrected Sanskrit Text")
    ],
    title="Sanskrit Speech Transcriber and Corrector",
    description=(
        "Upload your Sanskrit speech audio file (WAV). "
        "This app cleans the audio using DeepFilterNet-v2, transcribes it with Whisper, "
        "and corrects the transcription using Gemini. "
        "You need to set your GEMINI_API_KEY as an environment variable."
    ),
)

if __name__ == "__main__":
    iface.launch(show_error=True)
