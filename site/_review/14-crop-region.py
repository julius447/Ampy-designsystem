# python3 site/_review/14-crop-region.py <namn> <desktop|mobile> <y0> <y1> <ut> [scale=0.5]   (y i 1x-px)
import sys
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
name, vp, y0, y1, out = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
scale = float(sys.argv[6]) if len(sys.argv) > 6 else 0.5
im = Image.open(f'_shots/rev-{name}-{vp}.png'); w, h = im.size
crop = im.crop((0, y0 * 2, w, min(y1 * 2, h)))
crop = crop.resize((int(crop.width * scale), int(crop.height * scale)), Image.LANCZOS)
crop.save(f'site/_review/out/crops/{out}.png'); print(out, crop.size)
