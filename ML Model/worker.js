import { pipeline, TextStreamer } from '@huggingface/transformers';

class MyTranslationPipeline {
  static task = 'translation';
  static model = 'onnx-community/Qwen3-0.6B-ONNX';
  static instance = null;

  static async getInstance(progress_callback = null) {
    this.instance ??= pipeline(this.task, this.model, { progress_callback });
    return this.instance;
  }
} 