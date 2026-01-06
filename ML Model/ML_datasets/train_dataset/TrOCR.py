from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import torch
import re

processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-printed")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-printed")

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)