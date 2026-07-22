/* ============================================================================
   REMEMBRANCE RINGS — SIZE RENDERER
   Draws visual size chips on product pages and populates the order-form size
   selector. Reads ONLY from window.RR_INVENTORY (assets/js/inventory.js).
   Load order: inventory.js BEFORE this file.

   IMPORTANT: while RR_INVENTORY.verified === false, NO quantity or stock state
   is published as fact. Chips show the size range only, in a neutral "pending"
   state, and the order form offers those sizes without any "1 remaining" /
   "sold out" claims. The four truthful states (Available / 1 remaining /
   Sold out / Not produced) light up ONLY after verified is set to true.
============================================================================ */
(function () {
  var INV = window.RR_INVENTORY;
  if (!INV) return;

  var VERIFIED = INV.verified === true;

  var PENDING_NOTE =
    "Size availability is confirmed personally when you order — we verify your exact size before anything is finalised.";
  var VERIFIED_NOTE =
    "Only the sizes shown as available remain. Once a size is gone from this original production, it cannot be restocked.";

  /* ---- 1. Product-page chips ------------------------------------------- */
  function renderChips(host) {
    var design = host.getAttribute("data-size-chips");
    var items = INV.get(design);
    if (!items) { host.hidden = true; return; }

    var genders = ["Men's", "Women's"];
    var html = "";

    genders.forEach(function (g) {
      var group = items.filter(function (i) { return i.gender === g; });
      if (!group.length) return;
      html += '<div class="size-chip-row">';
      html += '<span class="size-chip-label">' + g + "</span>";
      html += '<ul class="size-chips" role="list">';
      group.forEach(function (i) {
        if (VERIFIED) {
          var state = INV.stateOf(i);
          html +=
            '<li role="listitem" class="size-chip is-' + state + '">' +
              '<span class="size-chip-size">' + i.size + "</span>" +
              '<span class="size-chip-state">' + INV.label(i) + "</span>" +
              '<span class="sr-only">' + INV.srLabel(i) + "</span>" +
            "</li>";
        } else {
          html +=
            '<li role="listitem" class="size-chip is-pending">' +
              '<span class="size-chip-size">' + i.size + "</span>" +
              '<span class="sr-only">' + i.gender + " size " + i.size +
                ", availability confirmed at order</span>" +
            "</li>";
        }
      });
      html += "</ul></div>";
    });

    html += '<p class="size-chip-note">' + (VERIFIED ? VERIFIED_NOTE : PENDING_NOTE) + "</p>";
    host.innerHTML = html;
  }

  document.querySelectorAll("[data-size-chips]").forEach(renderChips);

  /* ---- 2. Order-form size selector ------------------------------------- */
  var ringSelect = document.getElementById("ring-selection");
  var sizeSelect = document.querySelector("[data-size-select]");

  if (ringSelect && sizeSelect) {
    function fillSizes() {
      var items = INV.get(ringSelect.value);
      if (!items) {
        sizeSelect.innerHTML = '<option value="">Select a ring first</option>';
        return;
      }
      var opts = ['<option value="">Select size</option>'];
      items.forEach(function (i) {
        var value = i.gender + " " + i.size;
        if (!VERIFIED) {
          opts.push('<option value="' + value + '">' + value + "</option>");
          return;
        }
        if (INV.selectable(i)) {
          var suffix = INV.stateOf(i) === "low" ? " \u2014 1 remaining" : "";
          opts.push('<option value="' + value + '">' + value + suffix + "</option>");
        } else {
          var tag = INV.stateOf(i) === "sold-out" ? "sold out" : "not produced";
          opts.push('<option value="" disabled>' + value + " \u2014 " + tag + "</option>");
        }
      });
      sizeSelect.innerHTML = opts.join("");
    }
    ringSelect.addEventListener("change", fillSizes);
    fillSizes();
    window.addEventListener("load", fillSizes);
  }
})();
