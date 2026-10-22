import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // تعطيل في وضع التطوير لتجنب المشاكل
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  fallbacks: {
    document: "/offline", // صفحة تظهر عند انقطاع النت
  },
});

const nextConfig: NextConfig = {
  output: "standalone", // <--- تمت إضافة هذا السطر هنا
};

export default withPWA(nextConfig);