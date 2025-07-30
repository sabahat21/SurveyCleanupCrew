import torch
import gradio as gr
import nemo.collections.asr as nemo_asr
import os
import librosa
import soundfile as sf
import tempfile

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
asr_model = nemo_asr.models.EncDecCTCModel.restore_from("sanskrit.nemo")
asr_model.eval()
asr_model = asr_model.to(device)
asr_model.cur_decoder = "ctc"

def preprocess_audio(audio_file, target_sr=16000):
    try:
        audio, sr = librosa.load(audio_file, sr=target_sr)
        
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        sf.write(temp_file.name, audio, target_sr)
        temp_file.close()
        
        return temp_file.name
    except Exception as e:
        print(f"Error in preprocessing: {e}")
        return audio_file

def transcribe_sanskrit(audio_file):
    if isinstance(audio_file, tuple):
        audio_file = audio_file[0]
    
    if not os.path.exists(audio_file):
        return "Error: File not found."
    
    try:
        processed_audio = preprocess_audio(audio_file)
        
        result = asr_model.transcribe([processed_audio], batch_size=1, logprobs=False, language_id="sa")
        
        if processed_audio != audio_file and os.path.exists(processed_audio):
            os.unlink(processed_audio)
        
        return result[0][0] if result else "No transcription output."
    
    except Exception as e:
        return f"Error during transcription: {str(e)}"

interface = gr.Interface(
    fn=transcribe_sanskrit,
    inputs=gr.Audio(type="filepath", label="Upload Sanskrit Audio (.wav)"),
    outputs=gr.Textbox(label="Transcription"),
    title="Sanskrit ASR",
    description="Upload a Sanskrit audio file to get its transcription using NVIDIA NeMo."
)

if __name__ == "__main__":
    interface.launch(server_name="0.0.0.0", server_port=7860)