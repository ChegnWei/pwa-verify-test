import { j as createBlock, k as openBlock, l as withCtx, p as createElementBlock, q as createCommentVNode, u as unref, s as createVNode, T as Transition, v as withModifiers, x as createBaseVNode, y as normalizeClass, z as toDisplayString, A as createStaticVNode, R as RouterView, r as ref, B as onMounted, F as Fragment, C as useRouter, D as withDirectives, E as vModelText, d as computed, G as onBeforeUnmount, H as createTextVNode, I as renderList, n as nextTick, J as vModelSelect, K as createRouter, L as createWebHistory, M as createApp } from "./vue-CUNbW9vV.js";
import { d as defineStore, c as createPinia } from "./pinia-dVVQ345N.js";
import { a as axios } from "./axios-pMlYcaaZ.js";
import { C as CryptoJS } from "./cryptoJs-BPnrrIzj.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const request = axios.create({
  baseURL: "/",
  timeout: 1e4
  // 核心需求：10 秒強制斷開
});
request.interceptors.request.use(
  (config) => {
    const appAuthStore = useAppAuthStore();
    if (appAuthStore.token) {
      config.headers.Authorization = `Bearer ${appAuthStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let errorInfo = {
      type: "UNKNOWN",
      message: "發生未知錯誤",
      originalError: error
    };
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      errorInfo.type = "CLIENT_TIMEOUT";
      errorInfo.message = "連線超過 10 秒未回應，請檢查地端網路或 VPN 狀態";
    } else if (error.response?.status === 504) {
      errorInfo.type = "SERVER_TIMEOUT";
      errorInfo.message = "地端伺服器回應逾時 (504)，後端程式可能異常";
    } else if (error.message === "Network Error") {
      errorInfo.type = "NETWORK_OFFLINE";
      errorInfo.message = "網路連線已中斷，請確認網路線或 Wi-Fi";
    }
    return Promise.reject(errorInfo);
  }
);
const apiGetVersionAsync = async (params) => {
  return await request({
    url: "/api/AppAuth/GetVersion",
    method: "get",
    params
  });
};
const apiLoginAccountAsync = async (params) => {
  return await request({
    url: "/api/AppAuth/LoginAccount",
    method: "post",
    data: params
  });
};
const apiLoginAuthAccountAsync = async (params) => {
  return await request({
    url: "/api/AppAuth/LoginAuthAccount",
    method: "post",
    data: params
  });
};
const apiSendSMSAgainAsync = async (params) => {
  return await request({
    url: "/api/AppAuth/SendSMSAgain",
    method: "post",
    data: params
  });
};
const apiTokenAsync = async (params) => {
  return await request({
    url: "/api/AppAuth/Token",
    method: "post",
    data: params
  });
};
function aesDecrypt(base64CipherText, key) {
  if (!base64CipherText) return null;
  key = "00Itri" + key;
  const keyWordArray = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(base64CipherText) },
    keyWordArray,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}
const useAppAuthStore = defineStore("appAuth", {
  // 儲存資料
  state: () => ({
    // 錯誤訊息彈窗狀態
    errorModal: {
      isVisible: false,
      title: "系統訊息",
      message: "",
      type: "error"
      // 'error', 'warning', 'info', 'success'
    },
    // 全域區塊 loading 狀態
    blockLoading: {
      isVisible: false,
      message: "處理中，請稍候"
    },
    // 隱私權聲明彈窗狀態
    privacyModal: {
      isVisible: false
    },
    // 導航與登入狀態
    privacyAgreed: false,
    loggedIn: false,
    phoneNo: localStorage.getItem("phone_no") || "",
    token: localStorage.getItem("access_token") || "",
    gpsDenied: false
  }),
  // 動作
  actions: {
    // 顯示錯誤訊息
    showError(message, title = "錯誤訊息") {
      this.errorModal.isVisible = true;
      this.errorModal.title = title;
      this.errorModal.message = message;
      this.errorModal.type = "error";
    },
    // 顯示警告訊息
    showWarning(message, title = "警告訊息") {
      this.errorModal.isVisible = true;
      this.errorModal.title = title;
      this.errorModal.message = message;
      this.errorModal.type = "warning";
    },
    // 顯示一般訊息
    showInfo(message, title = "系統訊息") {
      this.errorModal.isVisible = true;
      this.errorModal.title = title;
      this.errorModal.message = message;
      this.errorModal.type = "info";
    },
    // 顯示成功訊息
    showSuccess(message, title = "成功") {
      this.errorModal.isVisible = true;
      this.errorModal.title = title;
      this.errorModal.message = message;
      this.errorModal.type = "success";
    },
    // 關閉訊息彈窗
    closeErrorModal() {
      this.errorModal.isVisible = false;
    },
    // 設置自訂訊息
    setErrorModal(options) {
      this.errorModal.isVisible = true;
      this.errorModal.title = options.title || "系統訊息";
      this.errorModal.message = options.message || "";
      this.errorModal.type = options.type || "info";
    },
    // 開啟/關閉全域區塊 loading
    showBlockLoading(message = "處理中，請稍候") {
      this.blockLoading.isVisible = true;
      this.blockLoading.message = message;
    },
    hideBlockLoading() {
      this.blockLoading.isVisible = false;
      this.blockLoading.message = "處理中，請稍候";
    },
    // 隱私權聲明：開/關/切換
    openPrivacyModal() {
      this.privacyModal.isVisible = true;
    },
    closePrivacyModal() {
      this.privacyModal.isVisible = false;
    },
    togglePrivacyModal() {
      this.privacyModal.isVisible = !this.privacyModal.isVisible;
    },
    // 認證狀態：初始化 / 設置
    initAuthFromStorage() {
      this.privacyAgreed = localStorage.getItem("privacy_agreed") === "yes";
      this.loggedIn = localStorage.getItem("logged_in") === "yes";
    },
    setPrivacyAgreed(value) {
      this.privacyAgreed = value;
      localStorage.setItem("privacy_agreed", value ? "yes" : "no");
    },
    setLoggedIn(value) {
      this.loggedIn = value;
      localStorage.setItem("logged_in", value ? "yes" : "no");
    },
    setPhoneNo(value) {
      this.phoneNo = value;
      localStorage.setItem("phone_no", value);
    },
    //Token
    setToken(token) {
      this.token = token;
      localStorage.setItem("access_token", token);
    },
    setGpsDenied(val) {
      this.gpsDenied = val;
    },
    clearGpsDenied() {
      this.gpsDenied = false;
    },
    //檢查版本
    async getapiGetVersionAsync(params) {
      return await apiGetVersionAsync(params);
    },
    //登入帳號
    async LoginAccount(params) {
      return await apiLoginAccountAsync(params);
    },
    async SendSMSAgain(params) {
      return await apiSendSMSAgainAsync(params);
    },
    //驗證碼登入
    async LoginAuthAccount(params) {
      return await apiLoginAuthAccountAsync(params);
    },
    //Token
    async Token(params) {
      return await apiTokenAsync(params);
    },
    //解密
    decryptPwdAuth(pwdAuthBase64, key) {
      return aesDecrypt(pwdAuthBase64);
    }
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$c = { class: "icon-wrapper" };
const _hoisted_2$b = {
  key: 0,
  class: "icon"
};
const _hoisted_3$9 = {
  key: 1,
  class: "icon"
};
const _hoisted_4$8 = {
  key: 2,
  class: "icon"
};
const _hoisted_5$6 = {
  key: 3,
  class: "icon"
};
const _hoisted_6$5 = { class: "error-modal-body" };
const _hoisted_7$5 = { class: "error-modal-footer" };
const _sfc_main$d = {
  __name: "ErrorModal",
  setup(__props) {
    const appAuthStore = useAppAuthStore();
    const closeModal = () => {
      appAuthStore.closeErrorModal();
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, { name: "fade" }, {
        default: withCtx(() => [
          unref(appAuthStore).errorModal.isVisible ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "error-modal-overlay",
            onClick: closeModal
          }, [
            createVNode(Transition, { name: "slide-up" }, {
              default: withCtx(() => [
                unref(appAuthStore).errorModal.isVisible ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  class: "error-modal-container",
                  onClick: _cache[0] || (_cache[0] = withModifiers(() => {
                  }, ["stop"]))
                }, [
                  createBaseVNode("div", {
                    class: normalizeClass(["error-modal-header", `header-${unref(appAuthStore).errorModal.type}`])
                  }, [
                    createBaseVNode("div", _hoisted_1$c, [
                      unref(appAuthStore).errorModal.type === "error" ? (openBlock(), createElementBlock("span", _hoisted_2$b, "❌")) : unref(appAuthStore).errorModal.type === "warning" ? (openBlock(), createElementBlock("span", _hoisted_3$9, "⚠️")) : unref(appAuthStore).errorModal.type === "success" ? (openBlock(), createElementBlock("span", _hoisted_4$8, "✅")) : (openBlock(), createElementBlock("span", _hoisted_5$6, "ℹ️"))
                    ]),
                    createBaseVNode("h3", null, toDisplayString(unref(appAuthStore).errorModal.title), 1)
                  ], 2),
                  createBaseVNode("div", _hoisted_6$5, [
                    createBaseVNode("p", null, toDisplayString(unref(appAuthStore).errorModal.message), 1)
                  ]),
                  createBaseVNode("div", _hoisted_7$5, [
                    createBaseVNode("button", {
                      class: normalizeClass(["btn-confirm", `btn-${unref(appAuthStore).errorModal.type}`]),
                      onClick: closeModal
                    }, " 確定 ", 2)
                  ])
                ])) : createCommentVNode("", true)
              ]),
              _: 1
            })
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
};
const ErrorModal = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-e252c5a1"]]);
const _hoisted_1$b = {
  key: 0,
  class: "block-loading-overlay"
};
const _hoisted_2$a = {
  class: "spinner-card",
  role: "status",
  "aria-live": "assertive",
  "aria-label": "Loading"
};
const _hoisted_3$8 = { class: "message" };
const _sfc_main$c = {
  __name: "BlockLoading",
  setup(__props) {
    const appAuthStore = useAppAuthStore();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, { name: "fade" }, {
        default: withCtx(() => [
          unref(appAuthStore).blockLoading.isVisible ? (openBlock(), createElementBlock("div", _hoisted_1$b, [
            createBaseVNode("div", _hoisted_2$a, [
              _cache[0] || (_cache[0] = createBaseVNode("div", { class: "spinner" }, null, -1)),
              createBaseVNode("p", _hoisted_3$8, toDisplayString(unref(appAuthStore).blockLoading.message), 1)
            ])
          ])) : createCommentVNode("", true)
        ]),
        _: 1
      });
    };
  }
};
const BlockLoading = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-8a61ae04"]]);
const _hoisted_1$a = {
  key: 0,
  class: "modal-mask"
};
const _hoisted_2$9 = { class: "modal-box" };
const _hoisted_3$7 = { class: "modal-header" };
const _hoisted_4$7 = { class: "modal-footer" };
const _sfc_main$b = {
  __name: "SecurityVPage",
  setup(__props) {
    const appAuthStore = useAppAuthStore();
    return (_ctx, _cache) => {
      return unref(appAuthStore).privacyModal.isVisible ? (openBlock(), createElementBlock("div", _hoisted_1$a, [
        createBaseVNode("div", _hoisted_2$9, [
          createBaseVNode("div", _hoisted_3$7, [
            _cache[2] || (_cache[2] = createBaseVNode("span", null, "隱私權聲明", -1)),
            createBaseVNode("button", {
              class: "close-btn",
              onClick: _cache[0] || (_cache[0] = ($event) => unref(appAuthStore).closePrivacyModal())
            }, "✕")
          ]),
          _cache[3] || (_cache[3] = createStaticVNode('<div class="modal-content" data-v-5490ac9b><p class="indent" data-v-5490ac9b> 親愛的使用者，您的個人資料及隱私權益，財團法人工業技術研究院 （以下簡稱「本院」）絕對尊重及保護。 為了幫助您瞭解本院如何蒐集、處理、利用及保護您的個人資料， 請您詳閱下列隱私權聲明（以下簡稱「本聲明」）內容： </p><p class="section-title" data-v-5490ac9b>一、適用範圍</p><p data-v-5490ac9b> 本聲明內容包括本院如何蒐集、處理及利用您因使用本院 外租用車行車記錄（以下簡稱「本應用程式」）時所提供的個人資料。 </p><p class="section-title" data-v-5490ac9b>二、資料之蒐集、利用、處理</p><p data-v-5490ac9b> 本院蒐集、利用、處理您的個人資料，係以確認您於本應用程式之使用者身分、 為您提供本應用程式相關服務，及本院為人事管理、內部行政管理等相關業務之 特定目的（以下簡稱「本目的」），其範圍如下： </p><p data-v-5490ac9b>(1) 本院在您使用本應用程式時，將依實際情況請您提供您的個人資料：行動電話門號。</p><p data-v-5490ac9b> (2) 本院會保留您所提供的上述資料，也會保留您使用本應用程式時， 所產生的相關紀錄，包括使用時間、位置資訊、軌跡資訊、使用紀錄、 行車狀態等資料。 </p><p data-v-5490ac9b> (3) 若您不同意提供，或提供之個人資料不足或有誤時， 本院將無法提供您本應用程式相關服務。 您所提供的個人資料如有刻意冒用他人名義、違反公序良俗、 侵害他人權利或涉有其他違反法令之虞， 本院得拒絕或取消您使用本應用程式的服務。 </p><p data-v-5490ac9b> (4) 本院對於您的個人資料，將於本目的及相關法令規定之範圍內， 蒐集、處理或利用您的個人資料，直至本目的消失為止。 </p><p data-v-5490ac9b> (5) 您得依個人資料保護法（以下簡稱「個資法」）及相關法律規定， 就您的個人資料行使查詢、閱覽、製給複製本、補充更正、 請求停止蒐集、處理、利用及刪除等權利。 其行使方式依個資法及本院相關規定， 您得撥打本院客服專線 0800-458-899 洽本院行政處交通業務承辦窗口辦理。 </p><p data-v-5490ac9b> (6) 本院將按照政府相關法規保密並妥善保護您的個人資料， 蒐集、處理或利用您個人資料之網路／系統／程式／終端／人員 均已納入本院的資通安全防護範圍， 防止未經授權人員之接觸。 </p><p class="section-title" data-v-5490ac9b>三、隱私權保護政策之修正及諮詢</p><p data-v-5490ac9b> (1) 為確實保障您的隱私權，在法律所允許的範圍內， 本院保留隨時修訂、增補及解釋本聲明的權利， 修正後的條款將公告於本院的網站／本應用程式， 並自公告日起生效。 </p><p data-v-5490ac9b> (2) 如您於本聲明為任何修改或變更後仍繼續使用本應用程式服務， 即表示您已閱讀、瞭解並同意遵守本聲明的修改或變更。 </p></div>', 1)),
          createBaseVNode("div", _hoisted_4$7, [
            createBaseVNode("button", {
              class: "btn-close",
              onClick: _cache[1] || (_cache[1] = ($event) => unref(appAuthStore).closePrivacyModal())
            }, " 關閉 ")
          ])
        ])
      ])) : createCommentVNode("", true);
    };
  }
};
const SecurityVPage = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-5490ac9b"]]);
const _hoisted_1$9 = { id: "app" };
const _sfc_main$a = {
  __name: "App",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$9, [
        createVNode(unref(RouterView)),
        createVNode(ErrorModal),
        createVNode(BlockLoading),
        createVNode(SecurityVPage)
      ]);
    };
  }
};
const _imports_1 = "/img/icons/MainBackground.jpg";
const _hoisted_1$8 = {
  key: 0,
  class: "gps-permission"
};
const _hoisted_2$8 = ["disabled"];
const _hoisted_3$6 = {
  key: 0,
  class: "gps-hint"
};
const _hoisted_4$6 = {
  key: 1,
  class: "gps-hint"
};
const _hoisted_5$5 = {
  key: 2,
  class: "gps-hint"
};
const _sfc_main$9 = {
  __name: "SecurityPage",
  setup(__props) {
    const router2 = useRouter();
    const appAuthStore = useAppAuthStore();
    const gpsState = ref("INIT");
    const gpsBusy = ref(false);
    const requestGpsPermission = async () => {
      if (gpsBusy.value) return;
      if (!("geolocation" in navigator)) {
        gpsState.value = "UNSUPPORTED";
        appAuthStore.showWarning("此裝置/瀏覽器不支援定位功能");
        return;
      }
      gpsBusy.value = true;
      gpsState.value = "WAITING";
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          gpsState.value = "OK";
          gpsBusy.value = false;
          appAuthStore.clearGpsDenied();
        },
        (err) => {
          gpsBusy.value = false;
          if (err?.code === 1) {
            gpsState.value = "DENIED";
            appAuthStore.showWarning("設備定位尚未開啟，請開啟設備定位服務");
          } else if (err?.code === 2) {
            gpsState.value = "ERROR";
            appAuthStore.showWarning("無法取得定位（訊號不佳或定位服務不可用）");
          } else if (err?.code === 3) {
            gpsState.value = "ERROR";
            appAuthStore.showWarning("定位逾時，請移至空曠處或稍後再試");
          } else {
            gpsState.value = "ERROR";
            appAuthStore.showWarning(`定位失敗：${err?.message ?? "未知錯誤"}`);
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 8e3,
          maximumAge: 0
        }
      );
    };
    const accept = () => {
      localStorage.setItem("privacy_agreed", "yes");
      setTimeout(() => {
        router2.push("/login");
      }, 1e3);
    };
    const reject = () => {
      appAuthStore.showWarning("您必須同意隱私權條款才能使用本系統", "提醒");
    };
    onMounted(() => {
      if (appAuthStore.gpsDenied) {
        appAuthStore.showWarning("設備定位尚未開啟，請開啟設備定位服務");
        appAuthStore.clearGpsDenied();
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        gpsState.value !== "OK" ? (openBlock(), createElementBlock("div", _hoisted_1$8, [
          _cache[0] || (_cache[0] = createBaseVNode("div", { class: "gps-title" }, "需要開啟定位服務", -1)),
          _cache[1] || (_cache[1] = createBaseVNode("div", { class: "gps-desc" }, " 本系統需使用定位資料（位置/軌跡）才能執行行程。請先開啟裝置定位與瀏覽器定位權限。 ", -1)),
          createBaseVNode("button", {
            class: "btn btn-gps",
            onClick: requestGpsPermission,
            disabled: gpsBusy.value
          }, toDisplayString(gpsBusy.value ? "定位確認中..." : "開啟定位權限"), 9, _hoisted_2$8),
          gpsState.value === "DENIED" ? (openBlock(), createElementBlock("div", _hoisted_3$6, " 你已拒絕定位權限，請到手機設定 / 瀏覽器網站設定中開啟定位權限後再重試。 ")) : gpsState.value === "UNSUPPORTED" ? (openBlock(), createElementBlock("div", _hoisted_4$6, " 此裝置/瀏覽器不支援定位功能。 ")) : gpsState.value === "ERROR" ? (openBlock(), createElementBlock("div", _hoisted_5$5, " 無法取得定位，請確認定位已開啟並移至空曠處再試。 ")) : createCommentVNode("", true)
        ])) : createCommentVNode("", true),
        createBaseVNode("div", { class: "dispatch-page" }, [
          _cache[2] || (_cache[2] = createStaticVNode('<div class="header" data-v-ee9a35a2><span class="header-title" data-v-ee9a35a2>隱私權聲明</span></div><div class="content" data-v-ee9a35a2><p data-v-ee9a35a2> 親愛的使用者，您的個人資料及隱私權益，財團法人工業技術研究院（以下簡稱「本院」）絕對尊重及保護。 為了幫助您瞭解本院如何蒐集、處理、利用及保護您的個人資料，請您詳閱讀下列隱私權聲明（以下簡稱「本聲明」）內容： </p><h3 data-v-ee9a35a2>一、適用範圍</h3><p data-v-ee9a35a2> 本聲明內容包括本院如何蒐集、處理及利用您因使用本院的外租用車行車記錄（以下簡稱「本應用程式」）時所提供的個人資料。 </p><h3 data-v-ee9a35a2>二、資料之蒐集、利用、處理</h3><p data-v-ee9a35a2> 本院蒐集、利用、處理您的個人資料，係以確認您於本應用程式之使用者身分、為您提供本應用程式相關服務， 及本院為人事管理、內部行政管理等相關業務之特定目的（以下簡稱「本目的」），其範圍如下： </p><p data-v-ee9a35a2> (1) 本院在您使用本應用程式時，將依實際情況請您提供您的個人資料：行動電話門號。 </p><p data-v-ee9a35a2> (2) 本院會保留您所提供的上述資料，也會保留您使用本應用程式時，所產生的相關紀錄，包括使用時間、 位置資訊、軌跡資訊、使用紀錄、行車狀態等資料。 </p><p data-v-ee9a35a2> (3) 若您不同意提供，或提供之個人資料不足或有誤時，本院將無法提供您本應用程式相關服務。 您所提供的個人資料如有刻意冒用他人名義、違反公序良俗、侵害他人權利或涉有其他違反法令之虞， 本院得拒絕或取消您使用本應用程式的服務。 </p><p data-v-ee9a35a2> (4) 本院對於您的個人資料，將於本目的及相關法令規定之範圍內，蒐集、處理或利用您的個人資料， 直至本目的消失為止。 </p><p data-v-ee9a35a2> (5) 您得依個人資料保護法（以下簡稱「個資法」）及相關法律規定，就您的個人資料行使查詢、 閱覽、製給複製本、補充更正、請求停止蒐集、處理、利用及刪除等權利。 其行使方式依個資法及本院相關規定，您得撥打本院客服專線 0800-458-899 洽本院行政處交通業務承辦窗口辦理。 </p><p data-v-ee9a35a2> (6) 本院將按照政府相關法規保密並妥善保護您的個人資料，蒐集、處理或利用您個人資料之網路／系統／程式／終端／人員均已納入本院的資通安全防護範圍，防止未經授權人員之接觸。 </p><h3 data-v-ee9a35a2>三、隱私權保護政策之修正及諮詢</h3><p data-v-ee9a35a2> (1) 為確實保障您的隱私權，在法律所允許的範圍內，本院保留隨時修訂、增補及解釋本聲明的權利， 修正後的條款將公告於本院的網站／本應用程式，且自公告日起生效。 </p><p data-v-ee9a35a2> (2) 如您於本聲明為任何修改或變更後仍繼續使用本應用程式服務，即表示您已閱讀、瞭解並同意遵守本聲明的修改或變更。 </p></div>', 2)),
          createBaseVNode("div", { class: "footer-buttons" }, [
            createBaseVNode("button", {
              class: "btn btn-danger",
              onClick: reject
            }, "不同意"),
            createBaseVNode("button", {
              class: "btn btn-primary",
              onClick: accept
            }, "同意")
          ]),
          _cache[3] || (_cache[3] = createBaseVNode("img", {
            class: "bg-bottom",
            src: _imports_1,
            alt: "bg bottom"
          }, null, -1))
        ])
      ], 64);
    };
  }
};
const SecurityPage = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-ee9a35a2"]]);
const _imports_0$2 = "/img/icons/apple-touch-icon.png";
const _hoisted_1$7 = { class: "login-page" };
const _hoisted_2$7 = { class: "input-box" };
const _sfc_main$8 = {
  __name: "LoginPage",
  setup(__props) {
    const router2 = useRouter();
    const phone = ref("");
    const appAuthStore = useAppAuthStore();
    const login = async () => {
      if (!phone.value) {
        appAuthStore.showError("請輸入手機號碼", "登入失敗");
        return;
      }
      if (phone.value.length !== 10) {
        appAuthStore.showWarning("手機號碼格式不正確，請輸入10位數字");
        return;
      }
      var params = {
        PhoneNo: phone.value
      };
      var result = await appAuthStore.LoginAccount(params);
      if (result && result.Id === 1) {
        appAuthStore.setLoggedIn(true);
        appAuthStore.setPhoneNo(phone.value);
        router2.push("/loginAuthPage");
        return;
      } else {
        appAuthStore.showWarning(`${result.Msg}`);
        return;
      }
    };
    const openPrivacy = () => {
      appAuthStore.openPrivacyModal();
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$7, [
        _cache[2] || (_cache[2] = createBaseVNode("div", { class: "logo-section" }, [
          createBaseVNode("img", {
            class: "logo",
            src: _imports_0$2,
            alt: "car icon"
          }),
          createBaseVNode("h2", { class: "sub-title" }, "工研院"),
          createBaseVNode("p", { class: "sub-title" }, "外租用車行車紀錄")
        ], -1)),
        createBaseVNode("div", _hoisted_2$7, [
          withDirectives(createBaseVNode("input", {
            type: "tel",
            inputmode: "numeric",
            pattern: "[0-9]*",
            placeholder: "請輸入手機號碼",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => phone.value = $event),
            onInput: _cache[1] || (_cache[1] = ($event) => phone.value = phone.value.replace(/[^0-9]/g, ""))
          }, null, 544), [
            [vModelText, phone.value]
          ])
        ]),
        createBaseVNode("button", {
          class: "btn-login",
          onClick: login
        }, " 登　入 "),
        createBaseVNode("div", {
          class: "privacy-link",
          onClick: openPrivacy
        }, " 隱私權聲明 "),
        _cache[3] || (_cache[3] = createBaseVNode("div", { class: "version" }, " V1.0.0 ", -1)),
        _cache[4] || (_cache[4] = createBaseVNode("img", {
          class: "bg-bottom",
          src: _imports_1,
          alt: "bg bottom"
        }, null, -1))
      ]);
    };
  }
};
const Login = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-7f784717"]]);
const _hoisted_1$6 = { class: "verify-page" };
const _hoisted_2$6 = { class: "input-box" };
const _hoisted_3$5 = { class: "btn-group" };
const _hoisted_4$5 = ["disabled"];
const _sfc_main$7 = {
  __name: "LoginAuthPage",
  setup(__props) {
    const appAuthStore = useAppAuthStore();
    const router2 = useRouter();
    const resendLoading = ref(false);
    const resendSeconds = ref(0);
    let resendTimer = null;
    const code = ref("");
    const resendText = computed(
      () => resendSeconds.value > 0 ? `重傳驗證碼 (${resendSeconds.value})` : "重傳驗證碼"
    );
    const startResendCountdown = (sec = 60) => {
      resendSeconds.value = sec;
      if (resendTimer) clearInterval(resendTimer);
      resendTimer = setInterval(() => {
        resendSeconds.value -= 1;
        if (resendSeconds.value <= 0) {
          clearInterval(resendTimer);
          resendTimer = null;
        }
      }, 1e3);
    };
    onBeforeUnmount(() => {
      if (resendTimer) clearInterval(resendTimer);
    });
    const resend = async () => {
      if (!appAuthStore.phoneNo) {
        appAuthStore.showWarning("找不到手機號碼，請返回重新登入");
        return;
      }
      if (resendSeconds.value > 0 || resendLoading.value) return;
      resendLoading.value = true;
      try {
        var params = {
          PhoneNo: appAuthStore.phoneNo
        };
        const res = await appAuthStore.SendSMSAgain(params);
        if (res && res.Id === 1) {
          appAuthStore.showInfo(res.Msg ?? "驗證碼已重新寄送");
          startResendCountdown(60);
        } else {
          appAuthStore.showWarning(res?.Msg ?? "重傳驗證碼失敗");
        }
      } catch (err) {
        appAuthStore.showWarning(err?.message ?? "重傳驗證碼失敗");
      } finally {
        resendLoading.value = false;
      }
    };
    const aesDecrypt2 = (base64CipherText, key) => {
      if (!base64CipherText) return null;
      key = "00Itri" + key;
      const keyWordArray = CryptoJS.enc.Utf8.parse(key);
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Base64.parse(base64CipherText) },
        keyWordArray,
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      return decrypted.toString(CryptoJS.enc.Utf8);
    };
    const confirm = async () => {
      if (code.value.length !== 4) {
        alert("請輸入 4 位數驗證碼");
        return;
      }
      var params = {
        PhoneNo: appAuthStore.phoneNo,
        Code: code.value
      };
      var result = await appAuthStore.LoginAuthAccount(params);
      if (result && result.Id === 1) {
        const pwdPlain = aesDecrypt2(result.PwdAuth, appAuthStore.phoneNo);
        if (!pwdPlain) {
          appAuthStore.showWarning("解密失敗");
          return;
        }
        params = {
          UserName: appAuthStore.phoneNo,
          Password: pwdPlain
        };
        var tokenResult = await appAuthStore.Token(params);
        if (!tokenResult || !tokenResult.access_token) {
          appAuthStore.showWarning("取得 Token 失敗");
          return;
        }
        appAuthStore.setToken(tokenResult.access_token);
        appAuthStore.setLoggedIn(true);
        localStorage.setItem("logged_in", "yes");
        router2.push("/itriHomePage");
        return;
      } else {
        appAuthStore.showWarning(`${result.Msg}`);
        return;
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$6, [
        _cache[2] || (_cache[2] = createBaseVNode("div", { class: "logo-section" }, [
          createBaseVNode("img", {
            class: "logo",
            src: _imports_0$2
          }),
          createBaseVNode("p", { class: "sub-title" }, "外租用車行車紀錄")
        ], -1)),
        createBaseVNode("div", _hoisted_2$6, [
          withDirectives(createBaseVNode("input", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => code.value = $event),
            type: "tel",
            inputmode: "numeric",
            pattern: "[0-9]*",
            maxlength: "4",
            placeholder: "",
            onInput: _cache[1] || (_cache[1] = ($event) => code.value = code.value.replace(/[^0-9]/g, ""))
          }, null, 544), [
            [vModelText, code.value]
          ])
        ]),
        createBaseVNode("div", _hoisted_3$5, [
          createBaseVNode("button", {
            class: "btn btn-gray",
            onClick: resend,
            disabled: resendLoading.value || resendSeconds.value > 0
          }, toDisplayString(resendText.value), 9, _hoisted_4$5),
          createBaseVNode("button", {
            class: "btn btn-green",
            onClick: confirm
          }, "確　定")
        ]),
        _cache[3] || (_cache[3] = createBaseVNode("img", {
          class: "bg-bottom",
          src: _imports_1,
          alt: "bg bottom"
        }, null, -1))
      ]);
    };
  }
};
const LoginAuthPage = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-3d49510a"]]);
const _imports_0$1 = "/img/icons/icon-48x48.png";
const _sfc_main$6 = {
  __name: "HomeMenuPage",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const appAuthStore = useAppAuthStore();
    const router2 = useRouter();
    const emit = __emit;
    const close = () => {
      emit("update:modelValue", false);
    };
    const goHome = () => {
      emit("update:modelValue", false);
      router2.push("/itriHomePage");
    };
    const goFunctionTest = () => {
      emit("update:modelValue", false);
      router2.push("/functionTest");
    };
    const logout = () => {
      emit("update:modelValue", false);
      localStorage.clear();
      sessionStorage.clear();
      appAuthStore.setLoggedIn(false);
      router2.replace("/login");
    };
    const openPrivacy = () => {
      appAuthStore.openPrivacyModal();
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        __props.modelValue ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "drawer-mask",
          onClick: close
        })) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: normalizeClass(["drawer", { open: __props.modelValue }])
        }, [
          _cache[0] || (_cache[0] = createBaseVNode("div", { class: "drawer-header" }, [
            createBaseVNode("div", { class: "drawer-logo" }, [
              createBaseVNode("img", {
                src: _imports_0$1,
                alt: "bottom"
              })
            ]),
            createBaseVNode("div", { class: "drawer-title" }, [
              createTextVNode(" 工研院"),
              createBaseVNode("br"),
              createTextVNode(" 外租用車行車紀錄 ")
            ])
          ], -1)),
          createBaseVNode("div", { class: "drawer-menu" }, [
            createBaseVNode("div", {
              class: "drawer-item",
              onClick: goHome
            }, "主頁"),
            createBaseVNode("div", {
              class: "drawer-item",
              onClick: logout
            }, "登出"),
            createBaseVNode("div", {
              class: "drawer-item",
              onClick: goFunctionTest
            }, "功能測試")
          ]),
          createBaseVNode("div", { class: "drawer-footer" }, [
            createBaseVNode("span", {
              class: "privacy-link",
              onClick: openPrivacy
            }, " 隱私權聲明 ")
          ])
        ], 2)
      ], 64);
    };
  }
};
const HomeMenuPage = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-2b7b3f44"]]);
const apiGetOrderListAsync = async () => {
  return await request({
    url: "/api/Order/GetOrderList",
    method: "get"
  });
};
const apiOrderScheduleByOneAsync = async (params) => {
  return await request({
    url: "/api/Order/OrderScheduleByOne",
    method: "post",
    data: params
  });
};
const apiOrderTrackAsync = async (params) => {
  return await request({
    url: "/api/Order/OrderTrack",
    method: "post",
    data: params
  });
};
const apiLatLngToAddressbyScheduleAsync = async (isTemp, scheduleId) => {
  return await request({
    url: "/api/GoogleAPI/LatLngToAddressbySchedule",
    method: "get",
    params: {
      IsTemp: isTemp,
      ScheduleId: scheduleId
    }
  });
};
const apiFinishOrderAsync = async (params) => {
  return await request({
    url: "/api/Order/FinishOrder",
    method: "post",
    data: params
  });
};
const useOrderStore = defineStore("order", {
  // 儲存資料
  state: () => ({
    orders: [],
    currentOrder: null,
    orderStatus: "",
    currentScheduleId: Number(localStorage.getItem("schedule_id") || 0),
    tripLogs: []
  }),
  // 動作
  actions: {
    async fetchOrders() {
    },
    setCurrentOrder(order) {
      this.currentOrder = order;
    },
    setTripLogs(logs) {
      this.tripLogs = Array.isArray(logs) ? logs : [];
      localStorage.setItem("trip_logs", JSON.stringify(this.tripLogs));
    },
    loadTripLogs() {
      try {
        const raw = localStorage.getItem("trip_logs");
        this.tripLogs = raw ? JSON.parse(raw) : this.tripLogs;
      } catch {
      }
    },
    clearCurrentOrder() {
      this.currentOrder = null;
    },
    async GetOrderList(params) {
      return await apiGetOrderListAsync();
    },
    async OrderScheduleByOne(params) {
      return await apiOrderScheduleByOneAsync(params);
    },
    async OrderTrack(params) {
      return await apiOrderTrackAsync(params);
    },
    async LatLngToAddressbySchedule(isTemp, scheduleId) {
      return await apiLatLngToAddressbyScheduleAsync(isTemp, scheduleId);
    },
    async FinishOrder(params) {
      return await apiFinishOrderAsync(params);
    }
  }
});
const _hoisted_1$5 = { class: "dispatch-page" };
const _hoisted_2$5 = { class: "content-scroll" };
const _hoisted_3$4 = ["onClick"];
const _hoisted_4$4 = { class: "row" };
const _hoisted_5$4 = { class: "row" };
const _hoisted_6$4 = { class: "row" };
const _hoisted_7$4 = { class: "row" };
const _hoisted_8$4 = { class: "row indent" };
const _hoisted_9$4 = { class: "row indent" };
const _hoisted_10$4 = { class: "row" };
const _hoisted_11$4 = { class: "row" };
const _hoisted_12$4 = { class: "row" };
const _hoisted_13$3 = { class: "bottom-btn-area" };
const _hoisted_14$3 = ["disabled"];
const _hoisted_15$2 = {
  key: 0,
  class: "confirm-overlay"
};
const _hoisted_16$2 = { class: "confirm-box" };
const _hoisted_17$2 = { class: "confirm-msg" };
const _sfc_main$5 = {
  __name: "ItriHomePage",
  setup(__props) {
    const router2 = useRouter();
    const OrderStore = useOrderStore();
    const appAuthStore = useAppAuthStore();
    const dispatchList = ref([]);
    const selectedIndex = ref(null);
    const showConfirm = ref(false);
    const showDrawer = ref(false);
    const loading = ref(false);
    const gps = ref({
      status: "INIT",
      // INIT | WAITING | OK | DENIED | ERROR | UNSUPPORTED
      message: "尚未取得定位",
      lat: 0,
      lng: 0,
      accuracy: 0,
      timestamp: null
    });
    let watchId = null;
    const setGpsError = (type, msg) => {
      gps.value.status = type;
      gps.value.message = msg;
    };
    const handleGeoSuccess = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      gps.value.status = "OK";
      gps.value.message = "定位成功";
      gps.value.lat = latitude;
      gps.value.lng = longitude;
      gps.value.accuracy = accuracy ?? 0;
      gps.value.timestamp = pos.timestamp ?? Date.now();
    };
    const handleGeoError = (err) => {
      if (err?.code === 1) {
        setGpsError("DENIED", "定位權限被拒絕，請到瀏覽器/手機設定開啟定位權限");
      } else if (err?.code === 2) {
        setGpsError("ERROR", "無法取得定位（訊號不佳或定位服務不可用）");
      } else if (err?.code === 3) {
        setGpsError("ERROR", "定位逾時，請移至空曠處或稍後再試");
      } else {
        setGpsError("ERROR", `定位失敗：${err?.message ?? "未知錯誤"}`);
      }
    };
    const stopWatchGps = () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
    };
    const requestGps = async () => {
      if (!("geolocation" in navigator)) {
        setGpsError("UNSUPPORTED", "此裝置/瀏覽器不支援 GPS 定位");
        return;
      }
      gps.value.status = "WAITING";
      gps.value.message = "正在取得定位...";
      navigator.geolocation.getCurrentPosition(
        handleGeoSuccess,
        handleGeoError,
        {
          enableHighAccuracy: true,
          timeout: 1e4,
          maximumAge: 0
        }
      );
      stopWatchGps();
      watchId = navigator.geolocation.watchPosition(
        handleGeoSuccess,
        handleGeoError,
        {
          enableHighAccuracy: true,
          timeout: 15e3,
          maximumAge: 5e3
        }
      );
    };
    const statusText = (status) => {
      switch (status) {
        case 0:
          return "未開始";
        case 1:
          return "待執行";
        case 2:
          return "進行中";
        case 3:
          return "已完成";
        default:
          return "未知";
      }
    };
    const mapOrderToCard = (o) => ({
      id: o.OrderNo ?? o.Guid ?? "",
      user: o.PassengerName ?? "",
      phone: o.PassengerPhone ?? "",
      start: o.StartAddress ?? "",
      startTime: o.StartTime ?? "",
      endTime: o.EndTime ?? "",
      target: o.TargetAddress ?? "",
      end: o.IsReturn ? o.StartAddress ?? "" : o.TargetAddress ?? "",
      status: statusText(o.Status),
      raw: o
    });
    const loadOrders = async () => {
      loading.value = true;
      try {
        const res = await OrderStore.GetOrderList();
        if (res && res.Id === 1 && Array.isArray(res.Orders)) {
          dispatchList.value = res.Orders.map(mapOrderToCard);
          selectedIndex.value = null;
        } else {
          appAuthStore.showWarning(res?.Msg ?? "取得派車單失敗");
        }
      } catch (err) {
        appAuthStore.showWarning(err?.message ?? "取得派車單失敗");
      } finally {
        loading.value = false;
      }
    };
    const reload = async () => {
      await loadOrders();
    };
    const selectedOrder = computed(
      () => selectedIndex.value !== null ? dispatchList.value[selectedIndex.value] : {}
    );
    const openConfirm = () => {
      if (selectedIndex.value === null) {
        alert("請選擇一筆派車單");
        return;
      }
      showConfirm.value = true;
    };
    const cancelConfirm = () => {
      showConfirm.value = false;
    };
    const executeTrip = () => {
      showConfirm.value = false;
      OrderStore.setCurrentOrder(selectedOrder.value?.raw ?? selectedOrder.value);
      localStorage.removeItem("trip_logs");
      router2.push("/orderProcessPage");
    };
    const openDrawer = () => {
      showDrawer.value = true;
    };
    onMounted(() => {
      loadOrders();
      requestGps();
    });
    onBeforeUnmount(() => {
      stopWatchGps();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1$5, [
          createBaseVNode("div", { class: "header" }, [
            createBaseVNode("span", {
              class: "hamburger",
              onClick: openDrawer
            }, "☰"),
            _cache[1] || (_cache[1] = createBaseVNode("span", { class: "header-title" }, "主頁", -1))
          ]),
          _cache[11] || (_cache[11] = createBaseVNode("div", { class: "page-title" }, "派車列表", -1)),
          _cache[12] || (_cache[12] = createBaseVNode("div", { class: "note" }, "*請先挑選要執行的派車單", -1)),
          createBaseVNode("div", _hoisted_2$5, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(dispatchList.value, (item, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: normalizeClass(["card", { selected: selectedIndex.value === index }]),
                onClick: ($event) => selectedIndex.value = index
              }, [
                createBaseVNode("div", _hoisted_4$4, [
                  _cache[2] || (_cache[2] = createBaseVNode("strong", null, "派車單號：", -1)),
                  createTextVNode(" " + toDisplayString(item.id), 1)
                ]),
                createBaseVNode("div", _hoisted_5$4, [
                  _cache[3] || (_cache[3] = createBaseVNode("strong", null, "使用人：", -1)),
                  createTextVNode(" " + toDisplayString(item.user), 1)
                ]),
                createBaseVNode("div", _hoisted_6$4, [
                  _cache[4] || (_cache[4] = createBaseVNode("strong", null, "聯絡電話：", -1)),
                  createTextVNode(" " + toDisplayString(item.phone), 1)
                ]),
                createBaseVNode("div", _hoisted_7$4, [
                  _cache[5] || (_cache[5] = createBaseVNode("strong", null, "行程起點：", -1)),
                  createTextVNode(" " + toDisplayString(item.start), 1)
                ]),
                _cache[9] || (_cache[9] = createBaseVNode("div", { class: "row" }, [
                  createBaseVNode("strong", null, "起迄時間：")
                ], -1)),
                createBaseVNode("div", _hoisted_8$4, toDisplayString(item.startTime), 1),
                createBaseVNode("div", _hoisted_9$4, toDisplayString(item.endTime), 1),
                createBaseVNode("div", _hoisted_10$4, [
                  _cache[6] || (_cache[6] = createBaseVNode("strong", null, "到達地點：", -1)),
                  createTextVNode(" " + toDisplayString(item.target), 1)
                ]),
                createBaseVNode("div", _hoisted_11$4, [
                  _cache[7] || (_cache[7] = createBaseVNode("strong", null, "行程終點：", -1)),
                  createTextVNode(" " + toDisplayString(item.end), 1)
                ]),
                createBaseVNode("div", _hoisted_12$4, [
                  _cache[8] || (_cache[8] = createBaseVNode("strong", null, "狀　態：", -1)),
                  createBaseVNode("span", {
                    class: normalizeClass(["status", { done: item.status === "已完成" }])
                  }, toDisplayString(item.status), 3)
                ])
              ], 10, _hoisted_3$4);
            }), 128))
          ]),
          createBaseVNode("div", _hoisted_13$3, [
            createBaseVNode("button", {
              class: "btn btn-orange",
              onClick: reload
            }, "重新整理"),
            createBaseVNode("button", {
              class: "btn btn-blue",
              onClick: openConfirm,
              disabled: selectedIndex.value === null
            }, " 開始行程 ", 8, _hoisted_14$3)
          ]),
          showConfirm.value ? (openBlock(), createElementBlock("div", _hoisted_15$2, [
            createBaseVNode("div", _hoisted_16$2, [
              _cache[10] || (_cache[10] = createBaseVNode("div", { class: "confirm-title" }, "行程確認", -1)),
              createBaseVNode("div", _hoisted_17$2, "是否開始 單號：" + toDisplayString(selectedOrder.value.id) + " 行程", 1),
              createBaseVNode("div", { class: "confirm-buttons" }, [
                createBaseVNode("div", {
                  class: "confirm-btn cancel",
                  onClick: cancelConfirm
                }, "取消"),
                createBaseVNode("div", {
                  class: "confirm-btn ok",
                  onClick: executeTrip
                }, "執行")
              ])
            ])
          ])) : createCommentVNode("", true),
          _cache[13] || (_cache[13] = createBaseVNode("img", {
            class: "bg-bottom",
            src: _imports_1,
            alt: "bg bottom"
          }, null, -1))
        ]),
        createVNode(HomeMenuPage, {
          modelValue: showDrawer.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => showDrawer.value = $event)
        }, null, 8, ["modelValue"])
      ], 64);
    };
  }
};
const ItriHomePage = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-e2f1471f"]]);
const _imports_0 = "/img/icons/twoaway.png";
const _hoisted_1$4 = { class: "dispatch-page" };
const _hoisted_2$4 = { class: "route-area" };
const _hoisted_3$3 = { class: "place" };
const _hoisted_4$3 = { class: "place" };
const _hoisted_5$3 = { class: "content-scroll" };
const _hoisted_6$3 = {
  key: 0,
  class: "trip-log"
};
const _hoisted_7$3 = ["onClick"];
const _hoisted_8$3 = { class: "row" };
const _hoisted_9$3 = { class: "row" };
const _hoisted_10$3 = {
  key: 0,
  class: "row"
};
const _hoisted_11$3 = {
  key: 1,
  class: "row"
};
const _hoisted_12$3 = {
  key: 2,
  class: "row"
};
const _hoisted_13$2 = { class: "bottom-btn-area" };
const _hoisted_14$2 = ["disabled"];
const _hoisted_15$1 = ["disabled"];
const _hoisted_16$1 = {
  key: 0,
  class: "sheet-overlay"
};
const _hoisted_17$1 = { class: "sheet-container" };
const _hoisted_18 = { class: "sheet-btn-area" };
const _hoisted_19 = ["disabled"];
const _hoisted_20 = ["disabled"];
const _sfc_main$4 = {
  __name: "OrderProcessPage",
  setup(__props) {
    const router2 = useRouter();
    const OrderStore = useOrderStore();
    const appAuthStore = useAppAuthStore();
    const showDrawer = ref(false);
    const apiBusy = ref(false);
    const logItems = ref([]);
    const isRiding = ref(false);
    const showMileageDialog = ref(false);
    const mileageInput = ref("");
    const editingIndex = ref(null);
    const current = computed(() => OrderStore.currentOrder);
    const isTempFlag = computed(() => current.value?.isTemp ?? current.value?.IsTemp ?? false);
    const finishAfterMileage = ref(false);
    const startPoint = computed(() => current.value?.StartAddress ?? "—");
    const endPoint = computed(() => current.value?.TargetAddress ?? "—");
    const gps = ref({
      status: "INIT",
      // INIT | WAITING | OK | DENIED | ERROR | UNSUPPORTED
      message: "尚未取得定位",
      lat: null,
      lng: null,
      accuracy: null,
      timestamp: null
    });
    const FALLBACK_LOCATION = {
      lat: 24.775441,
      lng: 121.044309
    };
    const getLatLngForApi = () => {
      if (gps.value.status === "OK" && typeof gps.value.lat === "number" && typeof gps.value.lng === "number") {
        return {
          lat: gps.value.lat,
          lng: gps.value.lng,
          source: "gps"
        };
      }
      return {
        lat: FALLBACK_LOCATION.lat,
        lng: FALLBACK_LOCATION.lng,
        source: "fallback"
      };
    };
    let watchId = null;
    let trackTimer = null;
    const handleGeoSuccess = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      gps.value.status = "OK";
      gps.value.message = "定位成功";
      gps.value.lat = latitude;
      gps.value.lng = longitude;
      gps.value.accuracy = accuracy ?? null;
      gps.value.timestamp = pos.timestamp ?? Date.now();
    };
    const handleGeoError = (err) => {
      if (err?.code === 1) {
        gps.value.status = "DENIED";
        gps.value.message = "定位權限被拒絕，請到手機/瀏覽器設定開啟定位";
      } else if (err?.code === 2) {
        gps.value.status = "ERROR";
        gps.value.message = "無法取得定位（訊號不佳或定位服務不可用）";
      } else if (err?.code === 3) {
        gps.value.status = "ERROR";
        gps.value.message = "定位逾時，請移至空曠處或稍後再試";
      } else {
        gps.value.status = "ERROR";
        gps.value.message = `定位失敗：${err?.message ?? "未知錯誤"}`;
      }
    };
    const requestGps = () => {
      if (!("geolocation" in navigator)) {
        gps.value.status = "UNSUPPORTED";
        gps.value.message = "此裝置/瀏覽器不支援 GPS";
        return;
      }
      gps.value.status = "WAITING";
      gps.value.message = "正在取得定位...";
      navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError, {
        enableHighAccuracy: false,
        timeout: 6e3,
        maximumAge: 6e3
      });
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      watchId = navigator.geolocation.watchPosition(handleGeoSuccess, handleGeoError, {
        enableHighAccuracy: false,
        timeout: 15e3,
        maximumAge: 5e3
      });
    };
    const stopWatchGps = () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
    };
    const openDrawer = () => {
      showDrawer.value = true;
    };
    const nowTime = () => {
      const d = /* @__PURE__ */ new Date();
      return d.getFullYear() + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + String(d.getDate()).padStart(2, "0") + " " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    };
    const sanitizeMileageInput = (raw) => {
      let s = String(raw ?? "").trim();
      s = s.replace(/[^\d.]/g, "");
      const firstDot = s.indexOf(".");
      if (firstDot !== -1) {
        s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, "");
      }
      if (firstDot !== -1) {
        const intPart = s.slice(0, firstDot);
        const decPart = s.slice(firstDot + 1).slice(0, 1);
        s = decPart.length ? `${intPart}.${decPart}` : `${intPart}.`;
      }
      if (s.startsWith(".")) s = `0${s}`;
      return s;
    };
    const onMileageInput = () => {
      mileageInput.value = sanitizeMileageInput(mileageInput.value);
    };
    const validateMileage = (raw) => {
      const s = String(raw ?? "").trim();
      if (!s) return { ok: false, message: "請輸入里程數" };
      const re = /^(?:0|[1-9]\d{0,})(?:\.\d{1})?$/;
      if (!re.test(s)) {
        return { ok: false, message: "請輸入數字!不能為負數，且只能為小數點一位小（例：10.0）" };
      }
      const value = Number(s);
      if (!(value > 0)) return { ok: false, message: "請輸入數字!不能為負數，且只能為小數點一位小（例：10.0）" };
      if (value >= 500) return { ok: false, message: "不可超過500公里" };
      const warn = value > 350 ? "你已經連續駕駛超過350KM，請適度的休息" : null;
      return { ok: true, value, warn };
    };
    const sendTrackOnce = async () => {
      const guid = current.value?.Guid;
      const scheduleId = OrderStore.currentScheduleId;
      const { lat, lng } = getLatLngForApi();
      if (!guid || !scheduleId) return;
      const payload = {
        Guid: guid,
        ScheduleId: scheduleId,
        Latitude: lat,
        Longitude: lng,
        IsTemp: isTempFlag.value
      };
      try {
        await OrderStore.OrderTrack(payload);
      } catch (err) {
        console.warn("OrderTrack failed:", err?.message ?? err);
      }
      try {
        await OrderStore.LatLngToAddressbySchedule(isTempFlag.value, scheduleId);
      } catch (e) {
        console.warn("LatLngToAddressbySchedule failed:", e?.message ?? e);
      }
    };
    const startTrackTimer = () => {
      stopTrackTimer();
      trackTimer = window.setInterval(() => {
        if (isRiding.value) sendTrackOnce();
      }, 30 * 60 * 1e3);
    };
    const stopTrackTimer = () => {
      if (trackTimer) {
        clearInterval(trackTimer);
        trackTimer = null;
      }
    };
    const startRide = async () => {
      if (apiBusy.value) return;
      try {
        const guid = current.value?.Guid;
        if (!guid) {
          appAuthStore.showWarning("找不到派車單 Guid");
          return;
        }
        apiBusy.value = true;
        const { lat, lng } = getLatLngForApi();
        const payload = {
          car001ScheduleId: 0,
          // 新增可填 0
          car001Guid: guid,
          OrderSort: 1,
          StartAddress: startPoint.value ?? "無",
          TargetAddress: "無",
          StartLat: lat,
          StartLon: lng,
          TargetLat: 0,
          TargetLon: 0,
          StartTime: (/* @__PURE__ */ new Date()).toISOString(),
          EndTime: (/* @__PURE__ */ new Date()).toISOString(),
          Distance: 0,
          IsTemp: isTempFlag.value,
          ActionIndex: 1
        };
        const res = await OrderStore.OrderScheduleByOne(payload);
        if (!res || res.Id < 1) {
          appAuthStore.showWarning(res?.Msg ?? "乘客上車失敗");
          return;
        }
        OrderStore.currentScheduleId = res.Id;
        logItems.value.push({
          startTime: nowTime(),
          startLocation: startPoint.value,
          endTime: null,
          endLocation: null,
          mileage: null
        });
        OrderStore.setTripLogs(logItems.value);
        isRiding.value = true;
        await sendTrackOnce();
        startTrackTimer();
      } catch (err) {
        appAuthStore.showWarning(err?.message ?? "乘客上車失敗");
      } finally {
        apiBusy.value = false;
      }
    };
    const endRide = () => {
      showMileageDialog.value = true;
    };
    const cancelMileage = () => {
      showMileageDialog.value = false;
      mileageInput.value = "";
      editingIndex.value = null;
      finishAfterMileage.value = false;
    };
    const confirmMileage = async () => {
      if (apiBusy.value) return;
      mileageInput.value = sanitizeMileageInput(mileageInput.value);
      const v = validateMileage(mileageInput.value);
      if (!v.ok) {
        appAuthStore.showWarning(v.message);
        return;
      }
      if (v.warn) {
        appAuthStore.showWarning(v.warn);
      }
      const guid = current.value?.Guid;
      const scheduleId = OrderStore.currentScheduleId;
      if (!guid || !scheduleId) {
        appAuthStore.showWarning("找不到行程資訊，請重新開始行程");
        return;
      }
      apiBusy.value = true;
      try {
        if (editingIndex.value !== null) {
          const payload2 = {
            car001ScheduleId: scheduleId,
            car001Guid: guid,
            OrderSort: 1,
            Distance: v.value,
            IsTemp: isTempFlag.value,
            ActionIndex: 3
          };
          const res2 = await OrderStore.OrderScheduleByOne(payload2);
          if (!res2 || res2.Id < 1) {
            appAuthStore.showWarning(res2?.Msg ?? "修改里程失敗");
            return;
          }
          logItems.value[editingIndex.value].mileage = mileageInput.value;
          OrderStore.setTripLogs(logItems.value);
          editingIndex.value = null;
          showMileageDialog.value = false;
          mileageInput.value = "";
          return;
        }
        const targetAddress = endPoint.value ?? "無";
        const { lat, lng } = getLatLngForApi();
        const payload = {
          car001ScheduleId: scheduleId,
          car001Guid: guid,
          OrderSort: 1,
          StartAddress: startPoint.value ?? "無",
          TargetAddress: targetAddress,
          TargetLat: lat,
          TargetLon: lng,
          Distance: v.value,
          IsTemp: isTempFlag.value,
          ActionIndex: 2
        };
        const res = await OrderStore.OrderScheduleByOne(payload);
        if (!res || res.Id < 1) {
          appAuthStore.showWarning(res?.Msg ?? "乘客下車失敗");
          return;
        }
        const log = logItems.value.at(-1);
        if (log) {
          log.endTime = nowTime();
          log.endLocation = targetAddress;
          log.mileage = mileageInput.value;
        }
        OrderStore.setTripLogs(logItems.value);
        isRiding.value = false;
        await sendTrackOnce();
        stopTrackTimer();
        if (finishAfterMileage.value) {
          finishAfterMileage.value = false;
          OrderStore.setTripLogs(logItems.value);
          router2.push("/orderFinishedPage");
          return;
        }
      } catch (err) {
        appAuthStore.showWarning(err?.message ?? "乘客下車失敗");
      } finally {
        apiBusy.value = false;
        showMileageDialog.value = false;
        mileageInput.value = "";
      }
    };
    const finishTrip = () => {
      if (isRiding.value) {
        finishAfterMileage.value = true;
        editingIndex.value = null;
        mileageInput.value = "";
        showMileageDialog.value = true;
        return;
      }
      stopTrackTimer();
      OrderStore.setTripLogs(logItems.value);
      router2.push("/orderFinishedPage");
    };
    const editMileage = (index) => {
      const log = logItems.value[index];
      if (!log.mileage) return;
      editingIndex.value = index;
      mileageInput.value = log.mileage;
      showMileageDialog.value = true;
    };
    const isCompleted = computed(() => {
      const s = current.value?.Status ?? current.value?.status;
      return Number(s) === 3;
    });
    const goHome = () => {
      router2.push("/ItriHomePage");
    };
    onMounted(() => {
      if (!current.value) {
        router2.replace("/itriHomePage");
        return;
      }
      OrderStore.loadTripLogs();
      if (OrderStore.tripLogs?.length) {
        logItems.value = JSON.parse(JSON.stringify(OrderStore.tripLogs));
      }
      requestGps();
    });
    onBeforeUnmount(() => {
      stopTrackTimer();
      stopWatchGps();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1$4, [
          createBaseVNode("div", { class: "header" }, [
            createBaseVNode("span", {
              class: "hamburger",
              onClick: openDrawer
            }, "☰"),
            _cache[2] || (_cache[2] = createBaseVNode("span", { class: "header-title" }, "派車單行程", -1))
          ]),
          _cache[11] || (_cache[11] = createBaseVNode("div", { class: "title-area" }, [
            createBaseVNode("div", { class: "title" }, "行程資訊"),
            createBaseVNode("div", { class: "title-en" }, "Itinerary Information")
          ], -1)),
          createBaseVNode("div", _hoisted_2$4, [
            createBaseVNode("div", _hoisted_3$3, toDisplayString(startPoint.value), 1),
            _cache[3] || (_cache[3] = createBaseVNode("img", {
              src: _imports_0,
              alt: "↑↓"
            }, null, -1)),
            createBaseVNode("div", _hoisted_4$3, toDisplayString(endPoint.value), 1)
          ]),
          createBaseVNode("div", _hoisted_5$3, [
            logItems.value.length ? (openBlock(), createElementBlock("div", _hoisted_6$3, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(logItems.value, (log, index) => {
                return openBlock(), createElementBlock("div", {
                  key: index,
                  class: "log-card",
                  onClick: ($event) => editMileage(index)
                }, [
                  createBaseVNode("div", _hoisted_8$3, [
                    _cache[4] || (_cache[4] = createBaseVNode("strong", null, "上車時間：", -1)),
                    createTextVNode(" " + toDisplayString(log.startTime), 1)
                  ]),
                  createBaseVNode("div", _hoisted_9$3, [
                    _cache[5] || (_cache[5] = createBaseVNode("strong", null, "上車位置：", -1)),
                    createTextVNode(" " + toDisplayString(log.startLocation), 1)
                  ]),
                  log.endTime ? (openBlock(), createElementBlock("div", _hoisted_10$3, [
                    _cache[6] || (_cache[6] = createBaseVNode("strong", null, "結束時間：", -1)),
                    createTextVNode(" " + toDisplayString(log.endTime), 1)
                  ])) : createCommentVNode("", true),
                  log.endLocation ? (openBlock(), createElementBlock("div", _hoisted_11$3, [
                    _cache[7] || (_cache[7] = createBaseVNode("strong", null, "下車位置：", -1)),
                    createTextVNode(" " + toDisplayString(log.endLocation), 1)
                  ])) : createCommentVNode("", true),
                  log.mileage ? (openBlock(), createElementBlock("div", _hoisted_12$3, [
                    _cache[8] || (_cache[8] = createBaseVNode("strong", null, "里程數：", -1)),
                    createTextVNode(" " + toDisplayString(log.mileage) + " ", 1),
                    _cache[9] || (_cache[9] = createBaseVNode("span", { class: "edit-hint" }, "（點擊可修改）", -1))
                  ])) : createCommentVNode("", true)
                ], 8, _hoisted_7$3);
              }), 128))
            ])) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", _hoisted_13$2, [
            isCompleted.value ? (openBlock(), createElementBlock("button", {
              key: 0,
              class: "btn btn-home",
              onClick: goHome
            }, " 回首頁 ")) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
              !isRiding.value ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: "btn btn-green",
                onClick: startRide,
                disabled: apiBusy.value
              }, " 乘客上車 ", 8, _hoisted_14$2)) : createCommentVNode("", true),
              isRiding.value ? (openBlock(), createElementBlock("button", {
                key: 1,
                class: "btn btn-orange",
                onClick: endRide,
                disabled: apiBusy.value
              }, " 乘客下車 ", 8, _hoisted_15$1)) : createCommentVNode("", true),
              createBaseVNode("button", {
                class: "btn btn-blue",
                onClick: finishTrip
              }, " 行程結束 ")
            ], 64))
          ]),
          showMileageDialog.value ? (openBlock(), createElementBlock("div", _hoisted_16$1, [
            createBaseVNode("div", _hoisted_17$1, [
              _cache[10] || (_cache[10] = createBaseVNode("div", { class: "sheet-title" }, "里程數", -1)),
              withDirectives(createBaseVNode("input", {
                type: "tel",
                class: "sheet-input",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => mileageInput.value = $event),
                placeholder: "請輸入里程數(公里)",
                inputmode: "numeric",
                onInput: onMileageInput
              }, null, 544), [
                [vModelText, mileageInput.value]
              ]),
              createBaseVNode("div", _hoisted_18, [
                createBaseVNode("button", {
                  class: "sheet-btn cancel",
                  onClick: cancelMileage,
                  disabled: apiBusy.value
                }, "❌ 取消", 8, _hoisted_19),
                createBaseVNode("button", {
                  class: "sheet-btn confirm",
                  onClick: confirmMileage,
                  disabled: apiBusy.value
                }, "✔️ 確定", 8, _hoisted_20)
              ])
            ])
          ])) : createCommentVNode("", true),
          _cache[12] || (_cache[12] = createBaseVNode("img", {
            class: "bg-bottom",
            src: _imports_1,
            alt: "bg bottom"
          }, null, -1))
        ]),
        createVNode(HomeMenuPage, {
          modelValue: showDrawer.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => showDrawer.value = $event)
        }, null, 8, ["modelValue"])
      ], 64);
    };
  }
};
const OrderProcessPage = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-b3ec8f17"]]);
const _hoisted_1$3 = { class: "sign-page" };
const _hoisted_2$3 = { class: "sign-box" };
const _sfc_main$3 = {
  __name: "SignatureView",
  setup(__props) {
    const router2 = useRouter();
    const canvas = ref(null);
    let ctx = null;
    let drawing = false;
    onMounted(() => {
      const c = canvas.value;
      ctx = c.getContext("2d");
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
    });
    const resizeCanvas = () => {
      const c = canvas.value;
      c.width = c.offsetWidth * 2;
      c.height = c.offsetHeight * 2;
      c.getContext("2d").scale(2, 2);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";
    };
    const getPos = (e) => {
      const rect = canvas.value.getBoundingClientRect();
      if (e.touches) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      }
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    const startDraw = (e) => {
      drawing = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };
    const draw = (e) => {
      if (!drawing) return;
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };
    const endDraw = () => {
      drawing = false;
    };
    const clearSign = () => {
      router2.push("/itineraryCheck");
    };
    const uploadSign = () => {
      const base64 = canvas.value.toDataURL("image/png");
      console.log("簽名 Base64：", base64);
      alert("簽名已上傳！");
      router2.push("/dispatchList");
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        _cache[0] || (_cache[0] = createBaseVNode("div", { class: "header" }, [
          createBaseVNode("div", { class: "title" }, "乘客簽名（請以正楷書寫）"),
          createBaseVNode("div", { class: "title-en" }, "Signature"),
          createBaseVNode("div", { class: "warning" }, "請確認行程無誤")
        ], -1)),
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("canvas", {
            ref_key: "canvas",
            ref: canvas,
            class: "sign-canvas",
            onMousedown: startDraw,
            onMousemove: draw,
            onMouseup: endDraw,
            onMouseleave: endDraw,
            onTouchstart: withModifiers(startDraw, ["prevent"]),
            onTouchmove: withModifiers(draw, ["prevent"]),
            onTouchend: withModifiers(endDraw, ["prevent"])
          }, null, 544)
        ]),
        createBaseVNode("div", { class: "bottom-btn-area" }, [
          createBaseVNode("button", {
            class: "btn-red",
            onClick: clearSign
          }, "檢視行程"),
          createBaseVNode("button", {
            class: "btn-blue",
            onClick: uploadSign
          }, "確認上傳")
        ])
      ]);
    };
  }
};
const Signature = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-3f667c79"]]);
const _hoisted_1$2 = { class: "dispatch-page" };
const _hoisted_2$2 = { class: "list-area" };
const _hoisted_3$2 = ["onClick"];
const _hoisted_4$2 = { class: "row" };
const _hoisted_5$2 = { class: "row" };
const _hoisted_6$2 = { class: "row" };
const _hoisted_7$2 = { class: "row" };
const _hoisted_8$2 = { class: "row time" };
const _hoisted_9$2 = { class: "row time" };
const _hoisted_10$2 = { class: "row" };
const _hoisted_11$2 = { class: "row" };
const _hoisted_12$2 = { class: "row" };
const _sfc_main$2 = {
  __name: "DispatchListView",
  setup(__props) {
    const router2 = useRouter();
    const showDrawer = ref(false);
    const openDrawer = () => {
      showDrawer.value = true;
    };
    const orders = ref([
      {
        id: "Z000251847",
        user: "彭江濤",
        phone: "0936900326",
        start: "77館",
        end: "火車站",
        startTime: "2021/07/21 07:00",
        endTime: "2021/07/21 17:00",
        status: "未開始"
      },
      {
        id: "Z000251900",
        user: "王小明",
        phone: "0912000111",
        start: "光復館",
        end: "竹北車站",
        startTime: "2021/07/22 08:00",
        endTime: "2021/07/22 10:00",
        status: "已完成"
      }
    ]);
    const selectedIndex = ref(null);
    const selectOrder = (idx) => {
      selectedIndex.value = idx;
    };
    const refreshList = () => {
      alert("已重新整理派車列表");
    };
    const goItinerary = () => {
      if (selectedIndex.value === null) {
        alert("請先選擇派車單！");
        return;
      }
      router2.push("/orderProcessPage");
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1$2, [
          createBaseVNode("div", { class: "header" }, [
            createBaseVNode("span", {
              class: "hamburger",
              onClick: openDrawer
            }, "☰"),
            _cache[1] || (_cache[1] = createBaseVNode("span", { class: "header-title" }, "主頁", -1))
          ]),
          _cache[10] || (_cache[10] = createBaseVNode("div", { class: "title" }, "派車列表", -1)),
          _cache[11] || (_cache[11] = createBaseVNode("div", { class: "note" }, "*請先挑選要執行的派車單", -1)),
          createBaseVNode("div", _hoisted_2$2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(orders.value, (order, idx) => {
              return openBlock(), createElementBlock("div", {
                key: idx,
                class: normalizeClass(["order-card", { selected: selectedIndex.value === idx }]),
                onClick: ($event) => selectOrder(idx)
              }, [
                createBaseVNode("div", _hoisted_4$2, [
                  _cache[2] || (_cache[2] = createBaseVNode("strong", null, "派車單號：", -1)),
                  createTextVNode(" " + toDisplayString(order.id), 1)
                ]),
                createBaseVNode("div", _hoisted_5$2, [
                  _cache[3] || (_cache[3] = createBaseVNode("strong", null, "使用人：", -1)),
                  createTextVNode(" " + toDisplayString(order.user), 1)
                ]),
                createBaseVNode("div", _hoisted_6$2, [
                  _cache[4] || (_cache[4] = createBaseVNode("strong", null, "聯絡電話：", -1)),
                  createTextVNode(" " + toDisplayString(order.phone), 1)
                ]),
                createBaseVNode("div", _hoisted_7$2, [
                  _cache[5] || (_cache[5] = createBaseVNode("strong", null, "行程起點：", -1)),
                  createTextVNode(" " + toDisplayString(order.start), 1)
                ]),
                _cache[9] || (_cache[9] = createBaseVNode("div", { class: "row" }, [
                  createBaseVNode("strong", null, "起迄時間：")
                ], -1)),
                createBaseVNode("div", _hoisted_8$2, toDisplayString(order.startTime), 1),
                createBaseVNode("div", _hoisted_9$2, toDisplayString(order.endTime), 1),
                createBaseVNode("div", _hoisted_10$2, [
                  _cache[6] || (_cache[6] = createBaseVNode("strong", null, "到達地點：", -1)),
                  createTextVNode(" " + toDisplayString(order.end), 1)
                ]),
                createBaseVNode("div", _hoisted_11$2, [
                  _cache[7] || (_cache[7] = createBaseVNode("strong", null, "行程終點：", -1)),
                  createTextVNode(" " + toDisplayString(order.end), 1)
                ]),
                createBaseVNode("div", _hoisted_12$2, [
                  _cache[8] || (_cache[8] = createBaseVNode("strong", null, "狀　態：", -1)),
                  createBaseVNode("span", {
                    class: normalizeClass(order.status === "已完成" ? "status-done" : "status-pending")
                  }, toDisplayString(order.status), 3)
                ])
              ], 10, _hoisted_3$2);
            }), 128))
          ]),
          createBaseVNode("div", { class: "bottom-btn-area" }, [
            createBaseVNode("button", {
              class: "btn btn-orange",
              onClick: refreshList
            }, "重新整理"),
            createBaseVNode("button", {
              class: "btn btn-blue",
              onClick: goItinerary
            }, "開始行程")
          ]),
          _cache[12] || (_cache[12] = createBaseVNode("img", {
            class: "bg-bottom",
            src: _imports_1,
            alt: "bg bottom"
          }, null, -1))
        ]),
        createVNode(HomeMenuPage, {
          modelValue: showDrawer.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => showDrawer.value = $event)
        }, null, 8, ["modelValue"])
      ], 64);
    };
  }
};
const DispatchList = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-9d75cef6"]]);
const apiUploadPhotoAsync = async (fileOrBlob) => {
  const formData = new FormData();
  const file = fileOrBlob instanceof File ? fileOrBlob : new File([fileOrBlob], "signature.png", { type: "image/png" });
  formData.append("file", file);
  return await request({
    url: "/api/FileUpload/UploadPhoto",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
const apiDownloadPhotoAsync = async (params) => {
  return await request({
    url: "/api/FileUpload/DownloadPhoto",
    method: "get",
    data: params
  });
};
const apiDownloadPhotoByParamAsync = async (isTemp, Guid) => {
  return await request({
    url: "/api/FileUpload/DownloadPhoto",
    method: "get",
    params: {
      IsTemp: isTemp,
      Guid
    }
  });
};
const useFileUploadStore = defineStore("fileUpload", {
  // 儲存資料
  state: () => ({
    uploadedFiles: [],
    uploadProgress: 0,
    isUploading: false
  }),
  // 動作
  actions: {
    async UploadPhoto(fileOrBlob) {
      return await apiUploadPhotoAsync(fileOrBlob);
    },
    async DownloadPhoto() {
      return await apiDownloadPhotoAsync();
    },
    async DownloadPhotoByParam(isTemp, scheduleId) {
      return await apiDownloadPhotoByParamAsync(isTemp, scheduleId);
    },
    clearFiles() {
      this.uploadedFiles = [];
    }
  }
});
const _hoisted_1$1 = { class: "dispatch-page" };
const _hoisted_2$1 = { class: "info" };
const _hoisted_3$1 = { class: "date-range" };
const _hoisted_4$1 = { class: "route" };
const _hoisted_5$1 = { class: "place" };
const _hoisted_6$1 = { class: "place" };
const _hoisted_7$1 = { class: "content-scroll" };
const _hoisted_8$1 = { class: "index" };
const _hoisted_9$1 = { class: "row" };
const _hoisted_10$1 = { class: "row" };
const _hoisted_11$1 = { class: "row" };
const _hoisted_12$1 = { class: "row" };
const _hoisted_13$1 = {
  key: 0,
  class: "sig-overlay"
};
const _hoisted_14$1 = { class: "sig-modal" };
const _hoisted_15 = { class: "sig-pad-wrap" };
const _hoisted_16 = { class: "sig-footer" };
const _hoisted_17 = ["disabled"];
const _sfc_main$1 = {
  __name: "OrderFinishedPage",
  setup(__props) {
    const router2 = useRouter();
    const OrderStore = useOrderStore();
    const UseFileUpload = useFileUploadStore();
    const appAuthStore = useAppAuthStore();
    const showDrawer = ref(false);
    const hasSigned = ref(false);
    const openDrawer = () => {
      showDrawer.value = true;
    };
    const apiBusy = ref(false);
    const current = computed(() => OrderStore.currentOrder);
    const startPoint = computed(() => current.value?.StartAddress ?? "—");
    const endPoint = computed(() => current.value?.TargetAddress ?? "—");
    const logs = computed(() => OrderStore.tripLogs ?? []);
    const dateRangeText = computed(() => {
      const start = current.value?.StartTime ?? current.value?.startTime;
      const end = current.value?.EndTime ?? current.value?.endTime;
      if (!start && !end) return "—";
      return `${start ?? "—"} ～ ${end ?? "—"}`;
    });
    onMounted(() => {
      if (!current.value) router2.replace("/ItriHomePage");
    });
    const showSignature = ref(false);
    const canvasRef = ref(null);
    let ctx = null;
    let drawing = false;
    let last = { x: 0, y: 0 };
    let resizeObserver = null;
    const openSignature = async () => {
      showSignature.value = true;
      hasSigned.value = false;
      await nextTick();
      setupCanvas();
      observeResize();
    };
    const closeSignature = () => {
      showSignature.value = false;
      hasSigned.value = false;
      unobserveResize();
    };
    const setupCanvas = () => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#111";
    };
    const getPoint = (e) => {
      const canvas = canvasRef.value;
      const rect = canvas.getBoundingClientRect();
      if (e.touches && e.touches[0]) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      }
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    const startDraw = (e) => {
      if (!ctx) return;
      drawing = true;
      hasSigned.value = true;
      last = getPoint(e);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
    };
    const moveDraw = (e) => {
      if (!drawing || !ctx) return;
      const p = getPoint(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
    };
    const endDraw = () => {
      drawing = false;
    };
    const clearCanvas = () => {
      const canvas = canvasRef.value;
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasSigned.value = false;
    };
    const hasSignature = () => {
      const canvas = canvasRef.value;
      if (!canvas) return false;
      const c = canvas.getContext("2d");
      const data = c.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] !== 0) return true;
      }
      return false;
    };
    const canvasToBlob = (canvas, type = "image/png", quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));
    const submitSignature = async () => {
      if (apiBusy.value) return;
      if (!hasSignature()) {
        appAuthStore.showWarning("請先簽名");
        return;
      }
      const guid = OrderStore.currentOrder?.Guid;
      const isTemp = OrderStore.currentOrder?.IsTemp ?? OrderStore.currentOrder?.isTemp ?? false;
      if (!guid) {
        appAuthStore.showWarning("找不到派車單 Guid");
        return;
      }
      try {
        apiBusy.value = true;
        const canvas = canvasRef.value;
        const blob = await canvasToBlob(canvas, "image/png");
        if (!blob) {
          appAuthStore.showWarning("簽名圖片產生失敗");
          return;
        }
        const uploadRes = await UseFileUpload.UploadPhoto(blob);
        const fileData = uploadRes?.FileData ?? uploadRes?.fileData;
        if (!fileData) {
          appAuthStore.showWarning("上傳檔案失敗：未取得 FileData");
          return;
        }
        const payload = {
          Guid: guid,
          Image: fileData,
          // ✅ 對應後端 byte[]
          IsTemp: isTemp
        };
        const res = await OrderStore.FinishOrder(payload);
        if (!res || res.Id < 1) {
          appAuthStore.showWarning(res?.Msg ?? "上傳失敗");
          return;
        }
        appAuthStore.showSuccess("完成");
        closeSignature();
        localStorage.removeItem("trip_logs");
        localStorage.removeItem("schedule_id");
        router2.push("/ItriHomePage");
      } catch (e) {
        appAuthStore.showWarning(e?.message ?? "上傳失敗");
      } finally {
        apiBusy.value = false;
      }
    };
    const observeResize = () => {
      const canvas = canvasRef.value;
      if (!canvas) return;
      resizeObserver = new ResizeObserver(() => {
        setupCanvas();
      });
      resizeObserver.observe(canvas);
    };
    const unobserveResize = () => {
      if (resizeObserver && canvasRef.value) {
        resizeObserver.unobserve(canvasRef.value);
        resizeObserver.disconnect();
      }
      resizeObserver = null;
    };
    const goBack = () => {
      router2.back();
    };
    onBeforeUnmount(() => {
      unobserveResize();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1$1, [
          createBaseVNode("div", { class: "header" }, [
            createBaseVNode("span", {
              class: "hamburger",
              onClick: openDrawer
            }, "☰"),
            _cache[1] || (_cache[1] = createBaseVNode("span", { class: "header-title" }, "派車行程", -1))
          ]),
          createBaseVNode("div", _hoisted_2$1, [
            _cache[3] || (_cache[3] = createBaseVNode("div", { class: "info-title" }, "行程資訊", -1)),
            _cache[4] || (_cache[4] = createBaseVNode("div", { class: "info-en" }, "Itinerary Information", -1)),
            createBaseVNode("div", _hoisted_3$1, toDisplayString(dateRangeText.value), 1),
            createBaseVNode("div", _hoisted_4$1, [
              createBaseVNode("div", _hoisted_5$1, toDisplayString(startPoint.value), 1),
              _cache[2] || (_cache[2] = createBaseVNode("img", {
                class: "arrows",
                src: _imports_0,
                alt: "↑↓"
              }, null, -1)),
              createBaseVNode("div", _hoisted_6$1, toDisplayString(endPoint.value), 1)
            ])
          ]),
          createBaseVNode("div", _hoisted_7$1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(logs.value, (item, index) => {
              return openBlock(), createElementBlock("div", {
                key: index,
                class: "log-card"
              }, [
                createBaseVNode("div", _hoisted_8$1, toDisplayString(index + 1), 1),
                createBaseVNode("div", _hoisted_9$1, [
                  _cache[5] || (_cache[5] = createBaseVNode("span", { class: "label" }, "上車時間：", -1)),
                  createTextVNode(toDisplayString(item.startTime), 1)
                ]),
                createBaseVNode("div", _hoisted_10$1, [
                  _cache[6] || (_cache[6] = createBaseVNode("span", { class: "label" }, "上車位置：", -1)),
                  createTextVNode(toDisplayString(item.startLocation), 1)
                ]),
                createBaseVNode("div", _hoisted_11$1, [
                  _cache[7] || (_cache[7] = createBaseVNode("span", { class: "label" }, "結束時間：", -1)),
                  createTextVNode(toDisplayString(item.endTime), 1)
                ]),
                createBaseVNode("div", _hoisted_12$1, [
                  _cache[8] || (_cache[8] = createBaseVNode("span", { class: "label" }, "下車位置：", -1)),
                  createTextVNode(toDisplayString(item.endLocation), 1)
                ])
              ]);
            }), 128))
          ]),
          createBaseVNode("div", { class: "footer" }, [
            createBaseVNode("button", {
              class: "btn cancel",
              onClick: goBack
            }, "取消"),
            createBaseVNode("button", {
              class: "btn confirm",
              onClick: openSignature
            }, "乘客簽認")
          ]),
          showSignature.value ? (openBlock(), createElementBlock("div", _hoisted_13$1, [
            createBaseVNode("div", _hoisted_14$1, [
              _cache[12] || (_cache[12] = createBaseVNode("div", { class: "sig-header" }, [
                createBaseVNode("div", { class: "sig-title" }, "乘客簽名(請以正楷書寫)"),
                createBaseVNode("div", { class: "sig-en" }, "Signature"),
                createBaseVNode("div", { class: "sig-warn" }, "請確認行程無誤")
              ], -1)),
              createBaseVNode("div", _hoisted_15, [
                createBaseVNode("canvas", {
                  ref_key: "canvasRef",
                  ref: canvasRef,
                  class: "sig-canvas",
                  onMousedown: startDraw,
                  onMousemove: moveDraw,
                  onMouseup: endDraw,
                  onMouseleave: endDraw,
                  onTouchstart: withModifiers(startDraw, ["prevent"]),
                  onTouchmove: withModifiers(moveDraw, ["prevent"]),
                  onTouchend: withModifiers(endDraw, ["prevent"])
                }, null, 544),
                _cache[9] || (_cache[9] = createBaseVNode("div", { class: "sig-line" }, null, -1))
              ]),
              createBaseVNode("div", _hoisted_16, [
                createBaseVNode("button", {
                  class: "sig-btn red",
                  onClick: closeSignature
                }, [..._cache[10] || (_cache[10] = [
                  createBaseVNode("span", { class: "icon" }, "✍", -1),
                  createTextVNode(" 檢視行程 ", -1)
                ])]),
                createBaseVNode("button", {
                  class: "sig-btn blue",
                  onClick: submitSignature,
                  disabled: apiBusy.value
                }, [..._cache[11] || (_cache[11] = [
                  createBaseVNode("span", { class: "icon" }, "✔", -1),
                  createTextVNode(" 確認上傳 ", -1)
                ])], 8, _hoisted_17)
              ]),
              hasSigned.value ? (openBlock(), createElementBlock("button", {
                key: 0,
                class: "sig-clear",
                onClick: clearCanvas
              }, " 清除 ")) : createCommentVNode("", true)
            ])
          ])) : createCommentVNode("", true),
          _cache[13] || (_cache[13] = createBaseVNode("img", {
            class: "bg-bottom",
            src: _imports_1,
            alt: "bg bottom"
          }, null, -1))
        ]),
        createVNode(HomeMenuPage, {
          modelValue: showDrawer.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => showDrawer.value = $event)
        }, null, 8, ["modelValue"])
      ], 64);
    };
  }
};
const OrderFinishedPage = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-b5f34ef6"]]);
const apiGetFreeWeatherDataAsync = async () => {
  return await request({
    url: "https://api.open-meteo.com/v1/forecast?latitude=35&longitude=139&hourly=temperature_2m",
    // 實際的 API End Point
    method: "get"
    // 請求方法
  });
};
const useFreeWeatherStore = defineStore("freeWeather", {
  state: () => ({
    dataList: null
    // 儲存取得的資料
  }),
  actions: {
    // 取得天氣資料
    async fetchWeatherDataAsync() {
      this.dataList = null;
      try {
        const data = await apiGetFreeWeatherDataAsync();
        this.dataList = data;
      } catch (err) {
        console.warn(`Store 捕捉到異常: ${err.type}`);
      } finally {
      }
    },
    // 取得天氣資料
    async fetchWeatherDataWithResponseAsync() {
      this.dataList = null;
      try {
        const data = await apiGetFreeWeatherDataAsync();
        this.dataList = data;
        return data;
      } catch (err) {
        console.warn(`Store 捕捉到異常: ${err.type}`);
      } finally {
      }
    }
  }
});
const showLoading = (message = "處理中，請稍候") => {
  const appAuthStore = useAppAuthStore();
  appAuthStore.showBlockLoading(message);
};
const hideLoading = () => {
  const appAuthStore = useAppAuthStore();
  appAuthStore.hideBlockLoading();
};
const withBlockLoading = async (task, message = "處理中，請稍候") => {
  const appAuthStore = useAppAuthStore();
  appAuthStore.showBlockLoading(message);
  try {
    if (typeof task === "function") {
      return await task();
    }
    return await task;
  } finally {
    appAuthStore.hideBlockLoading();
  }
};
const _hoisted_1 = { class: "page" };
const _hoisted_2 = { class: "card" };
const _hoisted_3 = { class: "field" };
const _hoisted_4 = { class: "field" };
const _hoisted_5 = { class: "card" };
const _hoisted_6 = { class: "api-row" };
const _hoisted_7 = { class: "result" };
const _hoisted_8 = { class: "api-row" };
const _hoisted_9 = { class: "result" };
const _hoisted_10 = { class: "card" };
const _hoisted_11 = { class: "api-row" };
const _hoisted_12 = { class: "result" };
const _hoisted_13 = { class: "api-row" };
const _hoisted_14 = { class: "result" };
const _sfc_main = {
  __name: "functionTestView",
  setup(__props) {
    const appAuthStore = useAppAuthStore();
    const freeWeatherStore = useFreeWeatherStore();
    const message = ref("");
    const messageType = ref("info");
    const apiNoReturnResult = ref("");
    const apiWithReturnResult = ref("");
    const manualLoadingStatus = ref("尚未測試");
    const wrapperLoadingStatus = ref("尚未測試");
    const triggerMessage = () => {
      const text = message.value || "這是測試訊息";
      if (messageType.value === "error") {
        appAuthStore.showError(text);
      } else if (messageType.value === "warning") {
        appAuthStore.showWarning(text);
      } else if (messageType.value === "success") {
        appAuthStore.showSuccess(text);
      } else {
        appAuthStore.showInfo(text);
      }
    };
    const openPrivacy = () => {
      appAuthStore.openPrivacyModal();
    };
    const testNoReturn = async () => {
      apiNoReturnResult.value = "測試中...";
      await freeWeatherStore.fetchWeatherDataAsync();
      apiNoReturnResult.value = freeWeatherStore.dataList ? "有取到值" : "未取到值";
    };
    const testWithReturn = async () => {
      apiWithReturnResult.value = "測試中...";
      const data = await freeWeatherStore.fetchWeatherDataWithResponseAsync();
      apiWithReturnResult.value = data ? "有取到值" : "未取到值";
    };
    const manualLoadingDemo = () => {
      manualLoadingStatus.value = "顯示中 (2 秒)";
      showLoading("展示 2 秒後自動關閉");
      setTimeout(() => {
        hideLoading();
        manualLoadingStatus.value = "已關閉";
      }, 2e3);
    };
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const wrapperLoadingDemo = async () => {
      wrapperLoadingStatus.value = "執行中...";
      try {
        await withBlockLoading(async () => {
          await delay(1500);
        }, "withBlockLoading 範例執行中...");
        wrapperLoadingStatus.value = "完成";
      } catch (error) {
        wrapperLoadingStatus.value = "發生錯誤";
        throw error;
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[9] || (_cache[9] = createBaseVNode("h2", null, "功能測試", -1)),
        createBaseVNode("section", _hoisted_2, [
          _cache[5] || (_cache[5] = createBaseVNode("h3", null, "訊息彈窗測試 (ErrorModal)", -1)),
          createBaseVNode("div", _hoisted_3, [
            _cache[2] || (_cache[2] = createBaseVNode("label", null, "內容", -1)),
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => message.value = $event),
              type: "text",
              placeholder: "請輸入要顯示的訊息"
            }, null, 512), [
              [vModelText, message.value]
            ])
          ]),
          createBaseVNode("div", _hoisted_4, [
            _cache[4] || (_cache[4] = createBaseVNode("label", null, "類型", -1)),
            withDirectives(createBaseVNode("select", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => messageType.value = $event)
            }, [..._cache[3] || (_cache[3] = [
              createBaseVNode("option", { value: "error" }, "error", -1),
              createBaseVNode("option", { value: "warning" }, "warning", -1),
              createBaseVNode("option", { value: "info" }, "info", -1),
              createBaseVNode("option", { value: "success" }, "success", -1)
            ])], 512), [
              [vModelSelect, messageType.value]
            ])
          ]),
          createBaseVNode("button", {
            class: "btn",
            onClick: triggerMessage
          }, "顯示訊息")
        ]),
        createBaseVNode("section", { class: "card" }, [
          _cache[6] || (_cache[6] = createBaseVNode("h3", null, "隱私權聲明 (PrivacyModal)", -1)),
          createBaseVNode("button", {
            class: "btn",
            onClick: openPrivacy
          }, "開啟隱私權聲明")
        ]),
        createBaseVNode("section", _hoisted_5, [
          _cache[7] || (_cache[7] = createBaseVNode("h3", null, "API 呼叫測試", -1)),
          createBaseVNode("div", _hoisted_6, [
            createBaseVNode("button", {
              class: "btn",
              onClick: testNoReturn
            }, "無回傳值請求"),
            createBaseVNode("span", _hoisted_7, toDisplayString(apiNoReturnResult.value), 1)
          ]),
          createBaseVNode("div", _hoisted_8, [
            createBaseVNode("button", {
              class: "btn",
              onClick: testWithReturn
            }, "有回傳值請求"),
            createBaseVNode("span", _hoisted_9, toDisplayString(apiWithReturnResult.value), 1)
          ])
        ]),
        createBaseVNode("section", _hoisted_10, [
          _cache[8] || (_cache[8] = createBaseVNode("h3", null, "全域 Loading 測試", -1)),
          createBaseVNode("div", _hoisted_11, [
            createBaseVNode("button", {
              class: "btn",
              onClick: manualLoadingDemo
            }, "顯示 2 秒後關閉"),
            createBaseVNode("span", _hoisted_12, toDisplayString(manualLoadingStatus.value), 1)
          ]),
          createBaseVNode("div", _hoisted_13, [
            createBaseVNode("button", {
              class: "btn",
              onClick: wrapperLoadingDemo
            }, "withBlockLoading 範例"),
            createBaseVNode("span", _hoisted_14, toDisplayString(wrapperLoadingStatus.value), 1)
          ])
        ])
      ]);
    };
  }
};
const FunctionTest = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-345e280b"]]);
const router = createRouter({
  // 使用 History 模式以支持 PWA
  history: createWebHistory("/"),
  routes: [
    { path: "/securityPage", component: SecurityPage },
    { path: "/login", component: Login },
    { path: "/loginAuthPage", component: LoginAuthPage },
    { path: "/itriHomePage", component: ItriHomePage },
    { path: "/signature", component: Signature },
    { path: "/dispatchList", component: DispatchList },
    { path: "/orderProcessPage", name: "orderProcessPage", component: OrderProcessPage },
    { path: "/orderFinishedPage", name: "orderFinishedPage", component: OrderFinishedPage },
    { path: "/functionTest", component: FunctionTest },
    { path: "/", redirect: "/securityPage" }
  ]
});
async function checkGpsAvailable() {
  if (!("geolocation" in navigator)) {
    return false;
  }
  try {
    if ("permissions" in navigator && navigator.permissions?.query) {
      const p = await navigator.permissions.query({ name: "geolocation" });
      if (p.state === "denied") {
        return false;
      }
    }
  } catch (e) {
  }
  const posOk = await new Promise((resolve) => {
    let done = false;
    const onSuccess = () => {
      if (done) return;
      done = true;
      resolve(true);
    };
    const onError = () => {
      if (done) return;
      done = true;
      resolve(false);
    };
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: false,
      timeout: 8e3,
      maximumAge: 0
    });
    setTimeout(() => {
      if (done) return;
      done = true;
      resolve(false);
    }, 9e3);
  });
  return posOk;
}
router.beforeEach(async (to, from, next) => {
  const appAuthStore = useAppAuthStore();
  appAuthStore.initAuthFromStorage();
  const { loggedIn, privacyAgreed } = appAuthStore;
  if (to.path === "/securityPage") return next();
  if (to.meta?.requireGps) {
    const ok = await checkGpsAvailable();
    if (!ok) {
      appAuthStore.setGpsDenied(true);
      return next("/securityPage");
    }
  }
  if (!privacyAgreed) return next("/securityPage");
  const publicPaths = ["/login", "/loginAuthPage"];
  if (!loggedIn) {
    if (publicPaths.includes(to.path)) return next();
    return next("/login");
  }
  return next();
});
const app = createApp(_sfc_main$a);
app.use(createPinia());
app.use(router);
app.mount("#app");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
});
window.addEventListener("appinstalled", () => {
});
const initWorkboxUpdates = async () => {
  if (!("serviceWorker" in navigator)) {
    console.warn("[PWA] 瀏覽器不支持 Service Worker");
    return;
  }
  try {
    const registration = await navigator.serviceWorker.ready;
    const CHECK_INTERVAL = 12 * 60 * 60 * 1e3;
    setInterval(async () => {
      try {
        await registration.update();
      } catch (err) {
      }
    }, CHECK_INTERVAL);
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          window.dispatchEvent(new CustomEvent("pwa-update-available", {
            detail: { registration, newWorker }
          }));
        }
      });
    });
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("[PWA] 新版本已激活，刷新頁面");
      window.location.reload();
    });
  } catch (err) {
    console.error("[PWA] Workbox 初始化失敗:", err);
  }
};
initWorkboxUpdates();
window.checkPWAUpdate = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  } catch (err) {
    console.error("[PWA] 手動檢查失敗:", err);
  }
};
window.applyPWAUpdate = () => {
  navigator.serviceWorker.ready.then((registration) => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  });
};
