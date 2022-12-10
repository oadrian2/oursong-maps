import { useEffect, useState } from 'react';

export function useDataURL(blob: Blob) {
  const [preview, setPreview] = useState<string | undefined>();

  useEffect(() => {
    const imageDataURL = URL.createObjectURL(blob);

    setPreview(imageDataURL);

    return () => URL.revokeObjectURL(imageDataURL);
  }, [blob]);

  return preview;
}
