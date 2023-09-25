// @ts-nocheck
import { createCanvas } from "canvas";
var seedrandom = require("seedrandom");

export type ImageFrame = {
  orig: string
  descrambled: string
  width: number
  height: number
} 



function baseRange(b, c, d, e) {
  var h = -1,
    k = Math.max(Math.ceil((c - b) / (d || 1)), 0);
  const l = new Array(k);
  for (; k--; ) {
    l[e ? k : ++h] = b;
    b += d;
  }
  return l;
}

function toFinite(m) {
  return m
    ? (m = toNumber(m)) !== 1e400 && m !== -1e400
      ? m == m
        ? m
        : 0
      : 1.7976931348623157e308 * (m < 0 ? -1 : 1)
    : 0 === m
    ? m
    : 0;
}

function toNumber(n) {
  const o = parseInt;
  if ("number" == typeof n) {
    return n;
  }
  if (isSymbol(n)) {
    return NaN;
  }
  if (
    "string" !=
    typeof (n = isObject(n)
      ? isObject((p = "function" == typeof n.valueOf ? n.valueOf() : n))
        ? "" + p
        : p
      : n)
  ) {
    return 0 === n ? n : +n;
  }
  n = n.replace(/^\s+|\s+$/g, "");
  var p = /^0b[01]+$/i.test(n);
  return p || /^0o[0-7]+$/i.test(n)
    ? o(n.slice(2), p ? 2 : 8)
    : /^[-+]0x[0-9a-f]+$/i.test(n)
    ? NaN
    : +n;
}

function isObject(q) {
  var r = typeof q;
  return null != q && ("object" == r || "function" == r);
}

function isSymbol(t) {
  var u = typeof t;
  return (
    "symbol" == u ||
    ("object" == u && null != t && "[object Symbol]" == getTag(t))
  );
}

function createRange(w, z, aa) {
  return (
    (w = toFinite(w)),
    void 0 === z ? ((z = w), (w = 0)) : (z = toFinite(z)),
    baseRange(
      w,
      z,
      (aa = void 0 === aa ? (w < z ? 1 : -1) : toFinite(aa)),
      false
    )
  );
}

function getColsInGroup(ab) {
  if (1 === ab.length) {
    return 1;
  }
  for (var ae, af = 0; af < ab.length; af++) {
    if ((ae = void 0 === ae ? ab[af].y : ae) !== ab[af].y) {
      return af;
    }
  }
  return af;
}

function getGroup(ag) {
  const ah = {
    slices: ag.length,
    cols: getColsInGroup(ag),
  };
  return (
    (ah.rows = ag.length / ah.cols), (ah.x = ag[0].x), (ah.y = ag[0].y), ah
  );
}

function extractSeed(ai) {
  return !/(number|string)/i.test(
    Object.prototype.toString.call(ai).match(/^\[object (.*)\]$/)[1]
  ) && isNaN(ai)
    ? Number(
        String((this.strSeed = ai))
          .split("")
          .map(function (aj) {
            return aj.charCodeAt(0);
          })
          .join("")
      )
    : ai;
}

function seedRand(ak, al, am) {
  return Math.floor(ak() * (am - al + 1)) + al;
}

function unShuffle(an, ao) {
  if (!Array.isArray(an)) {
    return null;
  }
  Math.seedrandom && (seedrandom = Math.seedrandom);
  ao = extractSeed(ao) || "none";
  var ap = an.length,
    aq = seedrandom(ao);
  const ar = [],
    as = [];
  for (var at = 0; at < ap; at++) {
    ar.push(null);
    as.push(at);
  }
  for (at = 0; at < ap; at++) {
    var au = seedRand(aq, 0, as.length - 1),
      av = as[au];
    as.splice(au, 1);
    ar[av] = an[at];
  }
  console.log(as)
  return ar;
}

  


function loadImage(src):Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = function () {
      resolve(image);
    };

    image.onerror = function () {
      reject(new Error("Failed to load image"));
    };

    // Set crossOrigin attribute
    image.crossOrigin = "anonymous";

    image.src = src;
  });
}

async function imgReverser(dn, dp = 200, dq = "stay") {

    const dx = await loadImage(dn);
    const du = createCanvas(dx.width, dx.height);
    const imageOriginal = createCanvas(dx.width, dx.height);
    const dv = du.getContext("2d");
    const imageOriginalCanvas = imageOriginal.getContext("2d");
    imageOriginalCanvas.drawImage(dx, 0, 0)
    
      var dy = Math.ceil(dx.width / dp) * Math.ceil(dx.height / dp);
      du.width = dx.width;
      du.height = dx.height;
      var dz = Math.ceil(dx.width / dp);
      const ea = [];
      for (var eb = 0; eb <= dy; eb++) {
        var ec = parseInt(eb / dz);
        const ed = {
          x: (eb - ec * dz) * dp,
          y: ec * dp,
        };
        ed.width = dp - (ed.x + dp <= dx.width ? 0 : ed.x + dp - dx.width);
        ed.height = dp - (ed.y + dp <= dx.height ? 0 : ed.y + dp - dx.height);
        ea[ed.width + "-" + ed.height] || (ea[ed.width + "-" + ed.height] = []);
        ea[ed.width + "-" + ed.height].push(ed);
      }
      for (const ee in ea) {
        var ef,
          eg,
          eh = unShuffle(createRange(0, ea[ee].length), dq),
          ei = getGroup(ea[ee]);
        for ([ef, eg] of ea[ee].entries()) {
          var ej = eh[ef],
            ek = parseInt(ej / ei.cols),
            ej = (ej - ek * ei.cols) * eg.width,
            ek = ek * eg.height;
          dv.drawImage(
            dx,
            ei.x + ej,
            ei.y + ek,
            eg.width,
            eg.height,
            eg.x,
            eg.y,
            eg.width,
            eg.height
          );
        }
    };
    const data : ImageFrame = {descrambled: du.toDataURL("image/jpeg", 1), orig: imageOriginal.toDataURL("image/jpeg", 1), height: dx.height, width: dx.width}
    return data
    
    // dx.src = dn;
  }




export default async function decryptImage(imgPath) {
  try {

    const descrambledData = await imgReverser(
      `https://server.flamindemigod.com/image-proxy?url=${encodeURIComponent(
        imgPath
      )}`
    );
    return descrambledData;
  } catch (error) {
    console.error("Error descrambling image:", error);
  }
}
