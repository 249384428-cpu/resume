(function () {
  "use strict";

  // ---- toast
  var toast = document.querySelector(".toast");
  var timer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  // ---- 复制邮箱
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      var label = btn.textContent;
      var done = function () {
        btn.textContent = "已复制";
        btn.classList.add("done");
        showToast("已复制 " + value);
        setTimeout(function () {
          btn.textContent = label;
          btn.classList.remove("done");
        }, 1800);
      };
      var fallback = function () {
        var ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          var ok = document.execCommand("copy");
          if (ok) done();
          else showToast("复制失败，请手动选择邮箱");
        } catch (err) {
          showToast("复制失败，请手动选择邮箱");
        }
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(done).catch(fallback);
      } else {
        fallback();
      }
    });
  });

  // ---- 页内锚点平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });
})();
