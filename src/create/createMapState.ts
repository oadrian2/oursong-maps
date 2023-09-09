import { atom, selector } from 'recoil';

export const mapImageFileState = atom<File>({
  key: 'CreateMapImage',
});

export const mapImageTitleState = atom<string>({
  key: 'CreateMapTitle',
  default: selector<string>({
    key: 'CreateMapTitle/Default',
    get: ({ get }) => removeExtension(get(mapImageFileState).name),
  }),
});

export const mapImageMetadataState = selector<{ width: number; height: number }>({
  key: 'CreateMapDimensions',
  get: ({ get }) =>
    new Promise<{ width: number; height: number }>((resolve) => {
      const mapImageFile = get(mapImageFileState);

      const image = document.createElement('img');

      image.src = URL.createObjectURL(mapImageFile);

      image.onload = () => {
        const { naturalWidth: width, naturalHeight: height } = image;

        URL.revokeObjectURL(image.src);

        resolve({ width, height });
      };
    }),
});

export const optimizedMapBlobState = selector<Blob>({
  key: 'CreateOptimizedMapBlob',
  get: async ({ get }) => {
    const originalImage: Blob = get(mapImageFileState);
    const { width, height } = get(mapImageMetadataState);

    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    ctx?.drawImage(await createImageBitmap(originalImage), 0, 0);

    const mimeTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const comparisonBlobs = await Promise.all(
      mimeTypes.map(
        (value) => new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => (!!blob ? resolve(blob) : reject(blob)), value))
      )
    );

    return comparisonBlobs.filter((blob) => !!blob).reduce((prev, curr) => (curr.size < prev.size ? curr : prev), originalImage)!;
  },
});

function removeExtension(filename: string) {
  return filename.replace(/\.[^/.]+$/, '');
}
