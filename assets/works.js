/* 作品页交互：样本标签页 / 猜数字 / 知识图。没有依赖。 */
(function () {
  "use strict";

  /* ---------------------------------------------------- 样本标签页 */
  var tabs = document.querySelectorAll(".mtab");
  var panes = document.querySelectorAll(".mpane");
  tabs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabs.forEach(function (b) { b.classList.remove("is-on"); });
      panes.forEach(function (p) { p.classList.remove("is-on"); });
      btn.classList.add("is-on");
      var pane = document.querySelector('.mpane[data-pane="' + btn.dataset.tab + '"]');
      if (pane) pane.classList.add("is-on");
    });
  });

  /* ---------------------------------------------------- 猜数字 */
  var msg = document.getElementById("gMsg");
  var input = document.getElementById("gIn");
  var go = document.getElementById("gGo");
  var re = document.getElementById("gRe");
  var cntEl = document.getElementById("gCnt");
  var listEl = document.getElementById("gList");
  var hintEl = document.getElementById("gHint");

  if (msg && input && go) {
    var secret = 0;
    var count = 0;
    var over = false;

    function reset(focus) {
      secret = Math.floor(Math.random() * 100) + 1;
      count = 0;
      over = false;
      cntEl.textContent = "0";
      listEl.innerHTML = '<span class="gs-none">还没有</span>';
      hintEl.textContent = "";
      msg.className = "game-msg";
      msg.textContent = "心里想好了一个 1 到 100 的整数，你来猜。";
      input.value = "";
      input.disabled = false;
      go.disabled = false;
      if (focus) input.focus();
    }

    function addChip(v, dir, label) {
      var none = listEl.querySelector(".gs-none");
      if (none) none.remove();
      var s = document.createElement("span");
      s.className = "gs-chip " + dir;
      s.textContent = v + (label ? " " + label : "");
      listEl.appendChild(s);
    }

    function guess() {
      if (over) return;
      var v = parseInt(input.value, 10);
      if (!v || v < 1 || v > 100) {
        msg.className = "game-msg is-bad";
        msg.textContent = "只能填 1 到 100 的整数。";
        return;
      }
      count += 1;
      cntEl.textContent = String(count);
      input.value = "";
      if (v === secret) {
        over = true;
        msg.className = "game-msg is-ok";
        msg.textContent = "猜对了，用了 " + count + " 次。";
        addChip(v, "ok", "对");
        hintEl.textContent = "按「再玩一次」重开";
        input.disabled = true;
        go.disabled = true;
        return;
      }
      if (v > secret) {
        msg.className = "game-msg is-bad";
        msg.textContent = "大了。";
        addChip(v, "down", "大");
      } else {
        msg.className = "game-msg is-up";
        msg.textContent = "小了。";
        addChip(v, "up", "小");
      }
      input.focus();
    }

    go.addEventListener("click", guess);
    re.addEventListener("click", function () { reset(true); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") guess();
    });
    reset(false);

    /* 截图 / 演示用：?demo=1 时摆一局进行中的样子 */
    if (location.search.indexOf("demo=1") > -1) {
      secret = 37;
      count = 4;
      cntEl.textContent = "4";
      listEl.innerHTML = "";
      [
        [50, "down", "大"],
        [25, "up", "小"],
        [44, "down", "大"],
        [33, "up", "小"]
      ].forEach(function (x) { addChip(x[0], x[1], x[2]); });
      msg.className = "game-msg is-up";
      msg.textContent = "小了。";
      hintEl.textContent = "还剩 4 次以内就有戏";
    }
  }

  /* ---------------------------------------------------- 知识图 */
  var kgData = document.getElementById("kgData");
  if (kgData) {
    var data = JSON.parse(kgData.textContent);
    var kT = document.getElementById("kgT");
    var kD = document.getElementById("kgD");
    var kK = document.getElementById("kgK");
    var kKids = document.getElementById("kgKids");
    var nodes = document.querySelectorAll(".kg-n");

    function showK(key) {
      var d = data[key];
      if (!d) return;
      kK.textContent = key === "root" ? "中心" : key.charAt(1) === "1" || key.charAt(1) === "2" || key.charAt(1) === "3"
        ? (key.charAt(0) === "b" ? "主线 " + key.charAt(1) : "主线 " + key.charAt(1) + " · 节点 " + key.charAt(2))
        : key;
      kT.textContent = d.t;
      kD.textContent = d.d;
      if (kKids) {
        kKids.textContent = d.kids && d.kids.length ? "往下有：" + d.kids.join(" / ") : "";
        kKids.style.display = d.kids && d.kids.length ? "block" : "none";
      }
      nodes.forEach(function (n) {
        n.classList.toggle("is-on", n.dataset.k === key);
      });
    }

    nodes.forEach(function (n) {
      n.addEventListener("click", function () { showK(n.dataset.k); });
    });
    showK("b2");
  }

  /* 只看一个作品：works.html?only=w2 只留这一块，方便单独截图或单独发链接 */
  var only = new URLSearchParams(location.search).get("only");
  if (only) {
    document.querySelectorAll("main > section").forEach(function (sec) {
      if (sec.id !== only) sec.style.display = "none";
    });
    var hm = document.querySelector(".hero-anim");
    if (hm) hm.style.animation = "none";
    window.scrollTo(0, 0);
  }
})();
