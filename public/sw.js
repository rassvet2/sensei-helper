if(!self.define){let e,i={};const n=(n,a)=>(n=new URL(n+".js",a).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,s)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let r={};const u=e=>n(e,c),m={module:{uri:c},exports:r,require:u};i[c]=Promise.all(a.map((e=>m[e]||u(e)))).then((e=>(s(...e),r)))}}define(["./workbox-6a1bf588"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/bOeSH-OMlLkg_pn-OUs8y/_buildManifest.js",revision:"ef6a4cf6054b06d8938b2171fb7f1f8b"},{url:"/_next/static/bOeSH-OMlLkg_pn-OUs8y/_ssgManifest.js",revision:"5352cb582146311d1540f6075d1f265e"},{url:"/_next/static/chunks/20-ade9ca0d4c783a88.js",revision:"ade9ca0d4c783a88"},{url:"/_next/static/chunks/framework-9b5d6ec4444c80fa.js",revision:"9b5d6ec4444c80fa"},{url:"/_next/static/chunks/main-b2616eea889b0f38.js",revision:"b2616eea889b0f38"},{url:"/_next/static/chunks/pages/404-b065204f9f408630.js",revision:"b065204f9f408630"},{url:"/_next/static/chunks/pages/500-4ce1ac0304fedd85.js",revision:"4ce1ac0304fedd85"},{url:"/_next/static/chunks/pages/_app-8ca674dd4d8e86f0.js",revision:"8ca674dd4d8e86f0"},{url:"/_next/static/chunks/pages/_error-7397496ca01950b1.js",revision:"7397496ca01950b1"},{url:"/_next/static/chunks/pages/about-a202fed2f605abfa.js",revision:"a202fed2f605abfa"},{url:"/_next/static/chunks/pages/index-4db003388b032b47.js",revision:"4db003388b032b47"},{url:"/_next/static/chunks/pages/privacy-83fa9ab032e8b6ab.js",revision:"83fa9ab032e8b6ab"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-71eb4fcc773b358e.js",revision:"71eb4fcc773b358e"},{url:"/_next/static/css/a8b06208282f3bf2.css",revision:"a8b06208282f3bf2"},{url:"/_next/static/css/cc2096637c21e816.css",revision:"cc2096637c21e816"},{url:"/data/campaigns.json",revision:"e2404dccf8190478a72c1029a289e7e4"},{url:"/data/equipments.json",revision:"4ac156668dddba7d0e96b3c12340023c"},{url:"/favicon.ico",revision:"f08914a7651544b09e4450789bdd9a58"},{url:"/favicon.png",revision:"aeda4e01099b835cd1730b60bd13457c"},{url:"/icons/android-chrome-192x192.png",revision:"a0798bc97b5c8db282fe3fec6bd9a33f"},{url:"/icons/android-chrome-384x384.png",revision:"70ccd83102cae625b93a196325eeb6c9"},{url:"/icons/android-chrome-512x512.png",revision:"10c9a0b5ed0279e3877e4549d4cbca2b"},{url:"/icons/apple-180x180.png",revision:"b2497e0b67708dca328880874d202690"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier1.png",revision:"26857180214176e6b6db2260e0ff557a"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier2.png",revision:"8887d031474ce4a00deb3a1b2ee8e219"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier2_Piece.png",revision:"59af7db930797ce7148238f4ad210124"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier3.png",revision:"90a3c75f17f642a06c8d7940e91ff829"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier3_Piece.png",revision:"9e4b1b98d955237b4cdc6cbb4d89352c"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier4.png",revision:"6a4ae0a50b3b7671514c3b1f8d3959b4"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier4_Piece.png",revision:"035e3843faf30a584f030e49c3654887"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier5.png",revision:"56b2964599133ef2842117f95f44b9e7"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier5_Piece.png",revision:"ae0a57eda48142dd68bbf69575975b71"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier6.png",revision:"ae6b22212fb503d59a3cb17ad918a60e"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier6_Piece.png",revision:"b5dec3eda52d3180f4116b35871ae80f"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier7.png",revision:"54350c43b539b131fb3504f9ea2c54c1"},{url:"/images/equipments/@0.5/Equipment_Icon_Badge_Tier7_Piece.png",revision:"abcb74ab078dba0a84b65e0a36432287"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier1.png",revision:"17801d4e9a3148ac825832fbbd6890a5"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier2.png",revision:"615ae375ea45487a164638565ed9b811"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier2_Piece.png",revision:"031110775f18b61871a2d9bd3a90f60c"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier3.png",revision:"dc2e0a924e87e6c246fb64da929206d7"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier3_Piece.png",revision:"7d4d789eb62aec06d2fc731916f1cba1"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier4.png",revision:"181752b3162b2c672b38a0f013520ebc"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier4_Piece.png",revision:"2abc1bc2875ac18750a0af53316c98ab"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier5.png",revision:"10d889d32b5a93d888cb4a171ad271de"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier5_Piece.png",revision:"4dd405d6f43f285951884a729954d2e9"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier6.png",revision:"28dea7b1a156cdf14107edf9635967fd"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier6_Piece.png",revision:"99a5928e90e866e4e802d6f6b4559f52"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier7.png",revision:"c794b6a4b069328ee8e7fb7d9a98cbba"},{url:"/images/equipments/@0.5/Equipment_Icon_Bag_Tier7_Piece.png",revision:"512c7392ac05a3a7247a56e442a7f646"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier1.png",revision:"b2f4c7419e7060c09e74130c00c240e5"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier2.png",revision:"a4b538092ad8c58651fd1557cc55d3d3"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier2_Piece.png",revision:"9e3b822a27c9a8ffbde2778d32ef8fc7"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier3.png",revision:"9dcf07c03fa97d5e71f66b1c36f6bbf9"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier3_Piece.png",revision:"c67ff86fb0fde91b02d7073f0c30b9b9"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier4.png",revision:"f19b114cd5a99e6b2fdfcbe1588849fd"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier4_Piece.png",revision:"b7cdc36038589bcde5839ee6b10736fe"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier5.png",revision:"af1d0a2731f944668a16adb24c37e4bf"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier5_Piece.png",revision:"594e2f3f2ac44cade243a63dd65eff99"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier6.png",revision:"01a8569341d9e930ed3d16bb464ab037"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier6_Piece.png",revision:"d203d41c91dcdc5f1b408c1053f258ef"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier7.png",revision:"fa4123e4ea6ccadac86c0b26d16d20b0"},{url:"/images/equipments/@0.5/Equipment_Icon_Charm_Tier7_Piece.png",revision:"9189e77b390f42070230c4b9a97e9b90"},{url:"/images/equipments/@0.5/Equipment_Icon_Error.png",revision:"f1d4504aec753734fddc9390b543e612"},{url:"/images/equipments/@0.5/Equipment_Icon_Exp_0.png",revision:"a1a836285c4518be8cf3c952a99e5acf"},{url:"/images/equipments/@0.5/Equipment_Icon_Exp_1.png",revision:"93a85c3280602dca37a320a3e079b7f3"},{url:"/images/equipments/@0.5/Equipment_Icon_Exp_2.png",revision:"7ea0fc19371e8568fef2cc58af1a69c9"},{url:"/images/equipments/@0.5/Equipment_Icon_Exp_3.png",revision:"f6606c3f3fd59196262b31dcccd5e2a9"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier1.png",revision:"d91613f1d0da44019f6e6697c9590b32"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier2.png",revision:"c02101577b9a55cf334e5382302763e7"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier2_Piece.png",revision:"5c127c49a6acc5f2e6f5e7e6596b0d76"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier3.png",revision:"4eb397356bf80c1c70a531f702df66d2"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier3_Piece.png",revision:"9bdff118ee8d78091f637180da4308cf"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier4.png",revision:"c95e448225315e5f0cb291a8bfd63932"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier4_Piece.png",revision:"62be9b099d22b5853341079ead1405bb"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier5.png",revision:"9ce06d6cbe0b28b129455932c29ccf56"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier5_Piece.png",revision:"b8ab79a06ad87281015b591270015e40"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier6.png",revision:"20435f11598fae0fcf220b56fbcb6f01"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier6_Piece.png",revision:"3f181ba1bfcdca4df0703ac59aa5ed74"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier7.png",revision:"b663f74e577efc912237d8bc6b789c2b"},{url:"/images/equipments/@0.5/Equipment_Icon_Gloves_Tier7_Piece.png",revision:"1a5964b7eb04dc72dd8b26178e5a24a9"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier1.png",revision:"9de68670272830c9879ec02832bab94e"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier2.png",revision:"298ade71e1c978b123b5eaaa7e062816"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier2_Piece.png",revision:"91b994d1faf7c5e362a5837154aa5768"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier3.png",revision:"5c5129c2d59d1e5af6ee9ce85ba659f1"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier3_Piece.png",revision:"473a19032b8e081d98cdb18d9f767b55"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier4.png",revision:"9c382f7678a7f11a61ff97fa98e0d6b8"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier4_Piece.png",revision:"fc2181d0d883a3d78418152b92535e3a"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier5.png",revision:"78acebc5ef965a22c443cab7f3597268"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier5_Piece.png",revision:"94c1591767cce6f520f5a8645f9a4148"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier6.png",revision:"66e758fc6c2c4f6a988200ebcfa86602"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier6_Piece.png",revision:"af3446bab8d8a32d7ec9fcba3cca8df7"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier7.png",revision:"1789d8cde4650d932bfc92b1c084de69"},{url:"/images/equipments/@0.5/Equipment_Icon_Hairpin_Tier7_Piece.png",revision:"912a6c91e0f3003f77787c2a0ee957eb"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier1.png",revision:"0ff30337b02adbbf4baf46413748a35c"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier2.png",revision:"511784f429485a533de3e4d119294b83"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier2_Piece.png",revision:"88c9edae3157066af5b1c8fa5eee889f"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier3.png",revision:"a510ed48b4f65c2e0e4fe46d825b44af"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier3_Piece.png",revision:"a7c9c5c3318d1f971b934b3b95e48940"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier4.png",revision:"3c8b04ceeb38cf50b382e0123950a1ac"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier4_Piece.png",revision:"0d4e16c433c92e0cc073e053f52b9efc"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier5.png",revision:"773f4a54bbaf69291c06522b9ac7bfc1"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier5_Piece.png",revision:"6edcc7bb41bd3c8219feb2b22f5278bd"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier6.png",revision:"589db13468e4853bfff6ba143da6f0d2"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier6_Piece.png",revision:"e294f67af3eaf4fb191e8ce88cd0b71c"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier7.png",revision:"7079836027c224cbd542d8ded5c19565"},{url:"/images/equipments/@0.5/Equipment_Icon_Hat_Tier7_Piece.png",revision:"66ea2f27dcd8cec3a98072bf767fe659"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier1.png",revision:"d429ac6e6d7918e8ee1a1b6030b90896"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier2.png",revision:"3a8c74967e52d1c59f9d42da32eb4151"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier2_Piece.png",revision:"58355255197de8583832eb7df9b19abc"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier3.png",revision:"c6e4868a3175900244b3739e8698e7b5"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier3_Piece.png",revision:"1f4225268e72249f771df00f000f8f31"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier4.png",revision:"ddc385b63fda4b2e1afc6be89eb8adc5"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier4_Piece.png",revision:"09a3ca05f993d369ade4b736bbd1df5f"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier5.png",revision:"d24a40dbafdd80079de1b9d8b61bf5f7"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier5_Piece.png",revision:"fe6bef292e0ece3d40d503711448679b"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier6.png",revision:"6b325e54f0298157460100baecfbf2bd"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier6_Piece.png",revision:"0b9cd439386b38953c74e3398fda37c3"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier7.png",revision:"a276a44cddb8d93fd618738e71a65264"},{url:"/images/equipments/@0.5/Equipment_Icon_Necklace_Tier7_Piece.png",revision:"2be01cf463c36f74aee94c6ad3e72c0d"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier1.png",revision:"3c53415676855d905236b4e6fa4406ba"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier2.png",revision:"5e0956e5781e4b2b8e674488a19bba08"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier2_Piece.png",revision:"6a3ba5cccde44f136e77987f23b97774"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier3.png",revision:"093739c1319843ff310de41b29b3a3b7"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier3_Piece.png",revision:"e07a33b8a89c5d7a952d89b667683ac0"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier4.png",revision:"e85433d4f56d66e9c8744e3c3d457ebf"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier4_Piece.png",revision:"1db718d6530d4506de35a866769917a6"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier5.png",revision:"4fb7fe45ec1502268a5a6c57adbc6dbb"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier5_Piece.png",revision:"be466954323228d5cbf1e056e31e9a2d"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier6.png",revision:"48622c3e8708c6fe1986c42b90a4f734"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier6_Piece.png",revision:"ba6cd46f98cd28fb9fd2aa371a35b2bc"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier7.png",revision:"0b24672b3eef421a15491cf36262aee6"},{url:"/images/equipments/@0.5/Equipment_Icon_Shoes_Tier7_Piece.png",revision:"54d37c6e0658387d519a7b0863812699"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier1.png",revision:"e545460c22247b0ffff097292ded133d"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier2.png",revision:"73f8ec120f9536fe54019ca7f5a1580b"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier2_Piece.png",revision:"98f4f86dfcaa55eaa09257b433a301a5"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier3.png",revision:"73cbe1f38ce641d20c7ab6e2360f7a19"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier3_Piece.png",revision:"8078b2cd9a56892b0cd0a3a5d6a58602"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier4.png",revision:"a0e4488fd3bfcaa8cb6f60655c05c152"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier4_Piece.png",revision:"b50a8fad55d2c39b810f644a3b4c697a"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier5.png",revision:"77ef854ef5997188a1ba86cbd429f17b"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier5_Piece.png",revision:"8dcb70f71253537f74a423b7072c0337"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier6.png",revision:"a4d6016cc2d8a0405009ab32747bbaa9"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier6_Piece.png",revision:"2124414b54e96e1cd73f825702187b20"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier7.png",revision:"61714517ca49d82c16392f0f22c17db9"},{url:"/images/equipments/@0.5/Equipment_Icon_Watch_Tier7_Piece.png",revision:"2d40ecad99f7fc03af87664f1bb617af"},{url:"/locales/cn/about.json",revision:"d2b330fac3af5e5908b4248269b2e343"},{url:"/locales/cn/common.json",revision:"55743877f3ffd5fc834e97bc43a6e7bd"},{url:"/locales/cn/home.json",revision:"dbb0ff5918bbb42695bde92267ff1696"},{url:"/locales/en/about.json",revision:"ef044e2f1ff2974aa06df9a28385086f"},{url:"/locales/en/common.json",revision:"55743877f3ffd5fc834e97bc43a6e7bd"},{url:"/locales/en/home.json",revision:"b303625b8eac1555ebac4e22d7926dbe"},{url:"/locales/jp/about.json",revision:"401ea4c871719893d2aa98e94d94872e"},{url:"/locales/jp/common.json",revision:"55743877f3ffd5fc834e97bc43a6e7bd"},{url:"/locales/jp/home.json",revision:"44cd96822044c97780afad83e620295b"},{url:"/manifest.json",revision:"ef4b747d6a905bbf68e86fa86b4f0951"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:i,event:n,state:a})=>i&&"opaqueredirect"===i.type?new Response(i.body,{status:200,statusText:"OK",headers:i.headers}):i}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const i=e.pathname;return!i.startsWith("/api/auth/")&&!!i.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
