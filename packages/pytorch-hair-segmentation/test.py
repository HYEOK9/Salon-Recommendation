import cv2
import numpy as np
import torch
import os
import sys
import requests
from io import BytesIO
import json
from PIL import Image

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from networks import get_network

# img2Vec
from img2vec_pytorch import Img2Vec
from sklearn.metrics.pairwise import cosine_similarity

import torchvision.transforms as std_trnsf

# from torchvision.models import efficientnet_b4, EfficientNet_B4_Weights
# from torchvision.models._api import WeightsEnum
# from torch.hub import load_state_dict_from_url

# img2vecModel = "efficientnet_b4"


################### 갑자기 efficientnet_b4모델 사용시 에러 나서 추가
# def get_state_dict(self, *args, **kwargs):
#     kwargs.pop("check_hash")
#     return load_state_dict_from_url(self.url, *args, **kwargs)


# WeightsEnum.get_state_dict = get_state_dict

# efficientnet_b4(weights=EfficientNet_B4_Weights.IMAGENET1K_V1)
# efficientnet_b4(weights="DEFAULT")
###################


test_image_transforms = std_trnsf.Compose(
    [
        std_trnsf.ToTensor(),
        std_trnsf.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]
)


def str2bool(s):
    return s.lower() in ("t", "true", 1)


def has_img_ext(fname):
    ext = os.path.splitext(fname)[1]
    return ext in (".jpg", ".jpeg", ".png")


def src_to_file(srcUrl: str):
    response = requests.get(srcUrl)

    if response.status_code == 200:
        img_data = BytesIO(response.content)
        img = Image.open(img_data).convert("RGB")
        cv2.imwrite("./result/origin.png", np.array(img))
        return img
    else:
        print("이미지를 다운로드하는 데 문제가 있습니다.")


def crop_hair_from_image(image):
    data = test_image_transforms(image)
    data = torch.unsqueeze(data, dim=0)
    net.eval()
    data = data.to(device)

    logit = net(data)

    # prepare mask
    pred = torch.sigmoid(logit.cpu())[0][0].data.numpy()
    mh, mw = data.size(2), data.size(3)
    mask = pred >= 0.6

    mask_n = np.zeros((mh, mw, 3))
    mask_n[:, :, 0] = 255
    mask_n[:, :, 0] *= mask

    image_n = np.array(image)
    image_n = cv2.cvtColor(image_n, cv2.COLOR_RGB2BGR)
    # discard padded area
    ih, iw, _ = image_n.shape

    delta_h = mh - ih
    delta_w = mw - iw

    top = delta_h // 2
    bottom = mh - (delta_h - top)
    left = delta_w // 2
    right = mw - (delta_w - left)

    mask_n = mask_n[top:bottom, left:right, :]

    # origin code
    # image_n = image_n * 0.5 + mask_n * 0.5

    overlap_mask = mask_n[:, :, 0] == 255

    image_n_cropped = image_n.copy()
    image_n_cropped[~overlap_mask] = 255

    return Image.fromarray(image_n_cropped)


def getBestCosSim(img_list, key_img):
    try:
        sims = {}
        key_vec = img2vec.get_vec(key_img)
        for img_obj in img_list:
            file_name, img_vec, origin_file = (
                img_obj["fileName"],
                img_obj["vec"],
                img_obj["originFile"],
            )

            similarity = cosine_similarity(
                key_vec.reshape((1, -1)), img_vec.reshape((1, -1))
            )[0][0]
            sims[file_name] = {"vec": similarity, "file": origin_file}

        sorted_sims = sorted(sims.items(), key=lambda x: x[1]["vec"], reverse=True)
        return sorted_sims[:5]

    except Exception as e:
        print(e)


if __name__ == "__main__":
    try:
        ckpt_dir = "./models/pspnet_resnet101_sgd_lr_0.002_epoch_100_test_iou_0.918.pth"
        key_img_dir = "./data/0.jpeg"
        img_src_array = json.loads(
            '[{"fileName":"filename-1","src":"https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyMzA3MDFfMTk2%2FMDAxNjg4MjAxNDY1MDUw.00Ng7Dl_RdvD9faTrQ8jfBNn6kY02OT2R4VkoWN-peMg.daWGYwyhNEOknvjjSHPsvpcz6ti7BLbYV-mksSnknSEg.JPEG%2F1688201174739.jpg"}]'
        )
        network = "pspnet_resnet101".lower()
        save_dir = "./result"
        device = "cpu"
        img2vec = Img2Vec(cuda=False)

        assert os.path.exists(ckpt_dir)
        assert os.path.exists(os.path.split(save_dir)[0])

        os.makedirs(save_dir, exist_ok=True)

        # prepare network with trained parameters
        net = get_network(network).to(device)
        state = torch.load(ckpt_dir, map_location=device)
        net.load_state_dict(state["weight"])

        key_img = Image.open(key_img_dir)
        cropped_key_img = crop_hair_from_image(key_img)

        durations = list()

        with torch.no_grad():
            length = len(img_src_array)
            place_name = img_src_array[0]["fileName"].split("-")[0]
            result_image_list = []

            for i, img_obj in enumerate(img_src_array):
                file_name, img_src = img_obj["fileName"], img_obj["src"]
                print(
                    "[{:3d}/{:3d}] processing image from {}... ".format(
                        i + 1, length, place_name
                    )
                )
                path = os.path.join(save_dir, f"{file_name}.png")
                img = src_to_file(img_src)
                image_n_cropped = crop_hair_from_image(img)
                vec = img2vec.get_vec(image_n_cropped)
                result_image_list.append(
                    {"fileName": file_name, "vec": vec, "originFile": img}
                )

            best_images = getBestCosSim(result_image_list, cropped_key_img)
            for fname, obj in best_images:
                cv2.imwrite(path, np.array(obj["file"]))

    except Exception as e:
        print(e)
