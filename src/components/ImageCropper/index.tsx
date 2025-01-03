import { Trans } from '@lingui/macro';
import { useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import getCroppedImg from './cropImage';

// TODO: move to constants
const MIN_DIMENSION = 150;

interface IImageCropperProps {
  value: string;
  onChange: (value: string) => void;
}

const ImageCropper: React.FC<IImageCropperProps> = ({ value, onChange }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imgSrc, setImgSrc] = useState(value);
  const [error, setError] = useState('');

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || '';
      imageElement.src = imageUrl;

      imageElement.addEventListener('load', (e: Event) => {
        if (error) setError('');
        const { naturalWidth, naturalHeight } =
          e.currentTarget as HTMLImageElement;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError('Image must be at least 150 x 150 pixels.');
          return setImgSrc('');
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onCropChange = (location: Point) => {
    setCrop(location);
  };

  const onCropComplete = async (_: Area, croppedAreaPixels: Area) => {
    try {
      const croppedImage = await getCroppedImg(imgSrc, croppedAreaPixels, 0);
      onChange(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  return (
    <>
      <div className="mb-4 flex flex-col items-center gap-5">
        <label className="flex w-fit flex-col">
          <div className="flex h-12 items-center justify-center gap-2 rounded-[8px] bg-black px-8 text-[15px] text-white">
            Choose your profile image
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="hidden"
          />
        </label>
        <div className="text-xs text-gray-storm-01">
          ( <Trans>500x500 像素，限 JPG，最大 2MB</Trans> )
        </div>
      </div>
      {!!error && <p className="text-xs text-red-400">{error}</p>}
      {!!imgSrc && (
        <>
          <div
            id="crop-container"
            className="absolute inset-0 mt-[200px] h-[300px]"
          >
            <Cropper
              restrictPosition
              image={imgSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={onZoomChange}
            />
          </div>
          <div id="cropper-ratio-controls">
            <Slider
              className="absolute bottom-20 left-1/2 flex h-20 w-1/2 -translate-x-1/2 transform items-center"
              min={1}
              max={5}
              step={0.1}
              defaultValue={[1]}
              value={[zoom]}
              aria-labelledby="Zoom"
              onValueChange={(value: number[]) => onZoomChange(value[0])}
            />
          </div>
        </>
      )}
    </>
  );
};
export default ImageCropper;
