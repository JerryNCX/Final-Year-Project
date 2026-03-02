from ultralytics import YOLO
from mmocr.apis import MMOCRInferencer
import cv2
import os

# Load YOLO
yolo_model = YOLO("yolo_dataset/runs/detect/train6 yolo12n/weights/best.pt")

# Load MMOCR
ocr = MMOCRInferencer(det='DBNet', rec='CRNN')

image_folder = "image/power-supply"

for file in os.listdir(image_folder):

    if file.endswith((".jpg",".png",".jpeg")):

        image_path = os.path.join(image_folder, file)

        print("Processing:", image_path)

        # YOLO detection
        results = yolo_model(image_path)

        # Read image
        img = cv2.imread(image_path)

        boxes = results[0].boxes

        for i,box in enumerate(boxes):

            x1,y1,x2,y2 = map(int,box.xyxy[0])

            crop = img[y1:y2, x1:x2]

            crop_path = f"crop_{i}.jpg"

            cv2.imwrite(crop_path,crop)

            # OCR
            result = ocr(crop_path)

            print(result)