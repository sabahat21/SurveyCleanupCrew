FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    MPLCONFIGDIR=/tmp/matplotlib \
    TRANSFORMERS_CACHE=/tmp/huggingface \
    HF_HOME=/tmp/huggingface \
    XDG_CACHE_HOME=/tmp \
    NUMBA_CACHE_DIR=/tmp/numba \
    LHOTSE_CACHE_DIR=/tmp/lhotse \
    LHOTSE_TOOLS_DIR=/.lhotse/tools \
    PYTHONPATH=/usr/local/lib/python3.11/site-packages:$PYTHONPATH

RUN apt-get update && apt-get install -y \
    software-properties-common \
    wget \
    curl \
    git \
    build-essential \
    pkg-config \
    cmake \
    ninja-build \
    libssl-dev \
    libffi-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    libncurses5-dev \
    libncursesw5-dev \
    xz-utils \
    tk-dev \
    libxml2-dev \
    libxmlsec1-dev \
    liblzma-dev \
    zlib1g-dev \
    ffmpeg \
    libsndfile1-dev \
    libsndfile1 \
    libasound2-dev \
    portaudio19-dev \
    libgomp1 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

RUN add-apt-repository ppa:deadsnakes/ppa -y && \
    apt-get update && \
    apt-get install -y \
    python3.11 \
    python3.11-dev \
    python3.11-distutils \
    python3.11-venv \
    && rm -rf /var/lib/apt/lists/*

RUN wget https://bootstrap.pypa.io/get-pip.py && \
    python3.11 get-pip.py && \
    rm get-pip.py && \
    python3.11 -m pip install --upgrade pip setuptools wheel

RUN ln -sf /usr/bin/python3.11 /usr/bin/python3 && \
    ln -sf /usr/bin/python3.11 /usr/bin/python

RUN useradd -m -u 1000 -s /bin/bash appuser && \
    usermod -aG sudo appuser && \
    echo "appuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

RUN mkdir -p /tmp/matplotlib \
    /tmp/huggingface \
    /tmp/numba \
    /tmp/lhotse \
    /tmp/gradio_uploads \
    /.lhotse/tools \
    /app/.lhotse \
    /home/appuser/.cache \
    && chmod -R 777 /tmp \
    && chmod -R 755 /.lhotse \
    && chown -R appuser:appuser /.lhotse \
    && chown -R appuser:appuser /home/appuser

RUN python3.11 -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

RUN python3.11 -m pip install \
    numpy==1.26.4 \
    cython \
    packaging \
    setuptools-scm

RUN python3.11 -m pip install \
    librosa==0.10.2.post1 \
    soundfile \
    resampy \
    audioread

RUN python3.11 -m pip install \
    transformers==4.40.0 \
    sentencepiece==0.2.0 \
    tokenizers \
    huggingface_hub==0.23.2

RUN python3.11 -m pip install \
    pandas==2.2.2 \
    scipy \
    scikit-learn

RUN python3.11 -m pip install \
    hydra-core==1.3.2 \
    omegaconf \
    pytorch-lightning==2.4.0

RUN python3.11 -m pip install \
    datasets==2.21.0 \
    webdataset==0.2.100 \
    editdistance==0.8.1 \
    jiwer==3.0.4

RUN python3.11 -m pip install lhotse==1.27.0

RUN python3.11 -m pip install pyannote.audio==3.3.1

RUN python3.11 -m pip install \
    inflect \
    IPython==8.27.0 \
    tqdm \
    matplotlib \
    seaborn

RUN python3.11 -m pip install gradio==5.38.2

RUN python3.11 -m pip install "nemo_toolkit @ git+https://github.com/AI4Bharat/NeMo@nemo-v2"

RUN python3.11 -m pip cache purge

WORKDIR /app

COPY . /app/

RUN chown -R appuser:appuser /app && \
    chmod -R 755 /app && \
    find /app -type f -name "*.py" -exec chmod 644 {} \; && \
    find /app -type f -name "*.nemo" -exec chmod 644 {} \; && \
    find /app -type f -name "*.wav" -exec chmod 644 {} \; && \
    find /app -type d -exec chmod 755 {} \;

RUN chmod -R 777 /tmp && \
    chown -R appuser:appuser /.lhotse /app/.lhotse

USER appuser

ENV HOME=/home/appuser \
    USER=appuser

RUN python --version && \
    python -c "import torch; print(f'PyTorch: {torch.__version__}')" && \
    python -c "import nemo; print('NeMo installed successfully')" && \
    python -c "import gradio; print(f'Gradio: {gradio.__version__}')"

EXPOSE 7860

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:7860/ || exit 1

CMD ["python", "app.py"]