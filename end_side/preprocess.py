import cv2
import numpy as np
from PIL import Image


def concatenate(true_img, crop):
    # my = cv2.imread('my.jpg')
    # resize
    
    new = np.concatenate([true_img,crop],1)
    # cv2.imwrite('test.jpg', new)
    # cv2.imwrite('crop.jpg', crop)
    new = cv2.cvtColor(new, cv2.COLOR_BGR2RGB)
    return new


def pre_val(true_img, crop):
    img = concatenate(true_img, crop)
    img = Image.fromarray(img)
    image = img.resize((224, 224), Image.LANCZOS)

    # HWC to CHW
    mean = np.array([0.485,0.456,0.406]).reshape(3, 1, 1)
    std = np.array([0.229,0.224,0.225]).reshape(3, 1, 1)
    image = np.array(image).astype('float32')
    if len(image.shape) == 3:
        image = np.swapaxes(image, 1, 2)
        image = np.swapaxes(image, 1, 0)

    # standardization
    image /= 255
    image -= mean
    image /= std
    image = image[[0, 1, 2], :, :]
    image = np.expand_dims(image, axis=0).astype('float32')
    return image

def pre_det(org_im, shrink):
    image = org_im.copy()
    image_height, image_width, image_channel = image.shape
    if shrink != 1:
        image_height, image_width = int(image_height * shrink), int(
            image_width * shrink)
        image = cv2.resize(image, (image_width, image_height),
                           cv2.INTER_NEAREST)
    # HWC to CHW
    if len(image.shape) == 3:
        image = np.swapaxes(image, 1, 2)
        image = np.swapaxes(image, 1, 0)
    #归一化
    # mean, std
    mean = [104., 117., 123.]
    scale = 0.007843
    image = image.astype('float32')
    image -= np.array(mean)[:, np.newaxis, np.newaxis].astype('float32')
    image = image * scale
    image = np.expand_dims(image, axis=0).astype('float32')
    return image
