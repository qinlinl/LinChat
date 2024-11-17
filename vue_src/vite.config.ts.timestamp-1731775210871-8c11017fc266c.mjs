// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import WindiCSS from "file:///C:/Users/28261/Desktop/chat/lin_chat/node_modules/vite-plugin-windicss/dist/index.mjs";
import { defineConfig } from "file:///C:/Users/28261/Desktop/chat/lin_chat/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/28261/Desktop/chat/lin_chat/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///C:/Users/28261/Desktop/chat/lin_chat/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/28261/Desktop/chat/lin_chat/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [vue(), vueDevTools(), WindiCSS()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.44.130:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      "/ws": {
        target: "ws://192.168.44.130:8000/v1/user/SendUserMsg",
        changeOrigin: true,
        ws: true,
        // 这里开启 WebSocket 支持
        rewrite: (path) => path.replace(/^\/ws/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFwyODI2MVxcXFxEZXNrdG9wXFxcXGNoYXRcXFxcbGluX2NoYXRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXDI4MjYxXFxcXERlc2t0b3BcXFxcY2hhdFxcXFxsaW5fY2hhdFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvMjgyNjEvRGVza3RvcC9jaGF0L2xpbl9jaGF0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgV2luZGlDU1MgZnJvbSAndml0ZS1wbHVnaW4td2luZGljc3MnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFt2dWUoKSwgdnVlRGV2VG9vbHMoKSwgV2luZGlDU1MoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC40NC4xMzA6ODAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXG4gICAgICB9LFxuICAgICAgJy93cyc6IHtcbiAgICAgICAgdGFyZ2V0OiAnd3M6Ly8xOTIuMTY4LjQ0LjEzMDo4MDAwL3YxL3VzZXIvU2VuZFVzZXJNc2cnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHdzOiB0cnVlLCAvLyBcdThGRDlcdTkxQ0NcdTVGMDBcdTU0MkYgV2ViU29ja2V0IFx1NjUyRlx1NjMwMVxuICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgvXlxcL3dzLywgJycpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFMsU0FBUyxlQUFlLFdBQVc7QUFDN1UsT0FBTyxjQUFjO0FBQ3JCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGlCQUFpQjtBQUptSyxJQUFNLDJDQUEyQztBQU81TyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVksR0FBRyxTQUFTLENBQUM7QUFBQSxFQUMxQyxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxVQUFRLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxNQUM1QztBQUFBLE1BQ0EsT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsSUFBSTtBQUFBO0FBQUEsUUFDSixTQUFTLFVBQVEsS0FBSyxRQUFRLFNBQVMsRUFBRTtBQUFBLE1BQzNDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
