// components/qrcode.js
import { useQRCode } from 'next-qrcode';

export default function QRCode({ data, width }) {
  const { Image } = useQRCode();

  return (
    <Image
      text={data}
      options={{
        type: 'image/jpeg',
        quality: 1,
        errorCorrectionLevel: 'M',
        margin: 3,
        scale: 4,
        width: width || 200,
        color: {
          dark: '#000',
          light: '#fff',
        },
      }}
    />
  );
}
