import {serverConfigs} from '../../configs';
import fs from 'fs';
import sharp from 'sharp';

export async function saveImage(image: any, makeThumbnail= true, prefix = "/") {
    const date = new Date();
    let dir = `${serverConfigs.IMAGE_FOLDER}/`;
    const dirThumbnail = `${serverConfigs.IMAGE_FOLDER}/`;
    if (prefix === 'avatars') {
        dir = `${serverConfigs.IMAGE_FOLDER}/${prefix}`;
    }
    await mkdirs(dir);
    const fileName = `image-${date.getTime()}-${Math.floor(Math.random() * date.getTime())}`;
    return new Promise((resolve, reject) => {
        const imageTypeIndex = image.indexOf(";base64,");
        let imageExt = '.png';
        let base64Data = image;
        if (imageTypeIndex > 0) {
            const imageType = image.substring(0, imageTypeIndex);
            if (imageType.includes('jpeg')) {
                imageExt = '.jpg';
            }
            base64Data = image.substring(imageTypeIndex + 8);
        }

        // let base64Data = image.replace(/^data:image\/\.+;base64,/, "");
        // console.log(base64Data)
        const path = `${dir}/${fileName}${imageExt}`;
        fs.writeFile(path, base64Data, 'base64', async function (err) {
            if (err) {
                return reject(err);
            }
            if (!makeThumbnail) {
                return resolve({path});
            }
            try {
                const thumbnailPath = `${dirThumbnail}/${fileName}-thumbnail${imageExt}`;
                await resizeImage(path, thumbnailPath);
                return resolve({path, thumbnailPath});
            } catch (error) {
            }
            return resolve({path});
        });
    })
}

async function resizeImage(filePath: string, thumbnailPath: string) {
    sharp(filePath)
        .resize(142, null)
        .toBuffer()
        .then((data: any) => {
            fs.writeFileSync(thumbnailPath, data);
        })
        .catch((error: any) => {
            console.log("statusRoute |  Error In Uploading Status Image" + error);
            throw error;
        });
}

export async function mkdirs(path: string) {
    const dirs = path.split("/");
    let currentPath = dirs[0];
    for (let i = 1; i < dirs.length; i++) {
        if (!fs.existsSync(currentPath) && currentPath.trim()) {
            fs.mkdirSync(currentPath);
        }
        currentPath += "/" + dirs[i];
    }
    if (!fs.existsSync(currentPath) && currentPath.trim()) {
        fs.mkdirSync(currentPath);
    }
}
