import { Trans } from '@lingui/macro';
import { useRef, useState } from 'react';
import ReactCrop, { centerCrop, Crop, makeAspectCrop } from 'react-image-crop';
import { Input } from '../ui/input';

// TODO: move to constants
const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

interface IImageCropperProps {
  value: string;
  onChange: (value: string) => void;
}

const ImageCropper: React.FC<IImageCropperProps> = ({ value, onChange }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState(value);
  const [crop, setCrop] = useState<Crop>();
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

  const onImageLoad = (e: React.ChangeEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: '%',
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    console.log('crop:', crop);
    const centeredCrop = centerCrop(crop, width, height);
    console.log('centeredCrop:', centeredCrop);
    setCrop(centeredCrop);

    // setCanvasPreview(
    //   imgRef.current as unknown as HTMLImageElement,
    //   previewCanvasRef.current as unknown as HTMLCanvasElement,
    //   convertToPixelCrop(
    //     crop as Crop,
    //     (imgRef.current as unknown as HTMLImageElement).width,
    //     (imgRef.current as unknown as HTMLImageElement).height
    //   )
    // );
    const dataUrl = (
      previewCanvasRef.current as unknown as HTMLCanvasElement
    ).toDataURL();
    onChange(dataUrl);
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
        <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{ maxHeight: '50vh' }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: 'none',
            border: '1px solid black',
            objectFit: 'contain',
            width: 150,
            height: 150,
          }}
        />
      )}
    </>
  );
};
export default ImageCropper;
