# Skär full-page-PNG:er (2x) i segment nedskalade till 1x-bredd för granskning: python3 site/_review/12-crop.py <namn> [seg_h=1400] [maxseg=12] [scale=0.5]
import sys
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
name = sys.argv[1]; seg = int(sys.argv[2]) if len(sys.argv) > 2 else 1400; maxseg = int(sys.argv[3]) if len(sys.argv) > 3 else 12; scale = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
for vp in ['desktop', 'mobile']:
    im = Image.open(f'_shots/rev-{name}-{vp}.png'); w, h = im.size
    seg2 = seg * 2  # 2x-pixlar
    n = 0
    for y in range(0, h, seg2):
        if n >= maxseg: break
        crop = im.crop((0, y, w, min(y + seg2, h)))
        crop = crop.resize((int(crop.width * scale), int(crop.height * scale)), Image.LANCZOS)
        crop.save(f'site/_review/out/crops/{name}-{vp}-{n:02d}.png'); n += 1
    print(vp, w, h, 'segment', n)
