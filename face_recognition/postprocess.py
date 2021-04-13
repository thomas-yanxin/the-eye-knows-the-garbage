import cv2
import numpy as np
def post_det(img, output_datas):
    img_h, img_w = img.shape[:2]
    new_img = img.copy()
    crops = []
    bboxes = []
    for data in output_datas:
        label, score, x1, y1, x2, y2 = data
        if score>0.9:
            x1, y1, x2, y2 = [int(_) for _ in [x1*img_w, y1*img_h, x2*img_w, y2*img_h]]
            crop = img[max(0, y1-50):min(y2+50,img_h),max(0, x1-50):min(x2+50,img_w),:]    
            h, w = crop.shape[:2]
            crop = cv2.resize(crop, (200, int(h/w*200))) if w>h else cv2.resize(crop, (int(w/h*200), 200))
            row_nums = 200-crop.shape[0]
            line_nums = 200-crop.shape[1]
            if row_nums%2 ==0:
                crop= np.pad(crop,((row_nums//2,row_nums//2),(0,0),(0,0)),'constant')
            else:
                crop= np.pad(crop,((row_nums//2,row_nums//2+1),(0,0),(0,0)),'constant')
            if line_nums%2 ==0:
                crop= np.pad(crop,((0,0),(line_nums//2,line_nums//2),(0,0)),'constant')
            else:
                crop= np.pad(crop,((0,0),(line_nums//2,line_nums//2+1),(0,0)),'constant')
            crops.append(crop)
            bboxes.append([x1, y1, x2, y2])
            cv2.rectangle(new_img, (x1, y1), (x2, y2), (255, 0, 0), 2)   
    return new_img, crops, bboxes