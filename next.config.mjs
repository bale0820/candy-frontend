// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactCompiler: true,

//   compiler: {
//     removeConsole:
//       process.env.NODE_ENV === "production"
//         ? { exclude: ["error"] }
//         : false,
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const isProd = process.env.VERCEL_ENV === "production";

const csp = isProd
  ? "default-src 'self'; connect-src 'self' https://candy-api.duckdns.org https://dapi.kakao.com https://map.kakao.com https://candy-images-storage.s3.ap-northeast-2.amazonaws.com; script-src 'self' https://dapi.kakao.com https://*.daumcdn.net 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://map.kakao.com https://dapi.kakao.com https://*.daumcdn.net https://candy-images-storage.s3.ap-northeast-2.amazonaws.com data: blob:; font-src 'self' https: data:; frame-src https://*"
  : "default-src 'self'; connect-src 'self' https://candy-api.duckdns.org https://dapi.kakao.com https://map.kakao.com https://candy-images-storage.s3.ap-northeast-2.amazonaws.com; script-src 'self' https://vercel.live https://*.vercel.app https://dapi.kakao.com https://*.daumcdn.net 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://map.kakao.com https://dapi.kakao.com https://*.daumcdn.net https://candy-images-storage.s3.ap-northeast-2.amazonaws.com data: blob:; font-src 'self' https: data:; frame-src https://*";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error"] }
        : false,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
