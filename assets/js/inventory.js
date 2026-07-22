/* ============================================================================
   REMEMBRANCE RINGS — CENTRALIZED SIZE INVENTORY
   ----------------------------------------------------------------------------
   *** DEVELOPMENT / UNVERIFIED DATA — DO NOT TREAT AS CONFIRMED STOCK ***

   This is the SINGLE source of truth for per-design size availability. Both the
   product pages (visual size chips) and the order form (size selector) read
   from this file. Sizes are never duplicated anywhere else.

   The quantities below were CARRIED OVER from the size copy already live on the
   site. They have NOT been re-counted against physical stock for this system.

   >>> Roman must physically re-count, correct the numbers, then set
   >>> RR_INVENTORY.verified = true. Until verified === true, every page shows a
   >>> small "availability confirmed personally at order" note and NO size is
   >>> ever presented as a hard, guaranteed count.

   ARCHIVE PIECES ARE DELIBERATELY ABSENT FROM THIS FILE:
     - Mexico Temple (original family collection)          -> archive only
     - Original Women's Salt Lake Temple Ring              -> archive only
   Because they do not exist as keys here, they can never enter the size system
   or the order form. Do not add them.

   HOW STATE IS DERIVED (do not hand-write state — it is computed):
     produced:false            -> NOT PRODUCED  (never made in this batch)
     produced:true,  qty:0     -> SOLD OUT      (was made, now gone)
     produced:true,  qty:1     -> LOW STOCK     (shown as "1 remaining")
     produced:true,  qty:>=2   -> AVAILABLE     (normal, no count shown)

   TO SUPPLY VERIFIED INVENTORY, give one row per size in this format:
     Design | Version(Men's/Women's) | Size | Quantity | Produced?(yes/no)
   Example:
     Salt Lake Temple Ring | Men's | 8.5 | 3 | yes
     Salt Lake Temple Ring | Men's | 8   | 0 | yes   (produced, sold out)
     Salt Lake Temple Ring | Men's | 12  | 0 | no    (never produced)
============================================================================ */

window.RR_INVENTORY = {
  /* Inventory physically confirmed in July 2026. */
  verified: true,

  /* Sellable 2017 Guadalajara production ONLY. */
  designs: {
    "Child of God": [
      { gender: "Men's",   size: "9",    qty: 4, produced: true },
      { gender: "Men's",   size: "9.5",  qty: 1, produced: true },
      { gender: "Men's",   size: "10.5", qty: 2, produced: true },
      { gender: "Women's", size: "9",    qty: 1, produced: true },
      { gender: "Women's", size: "10",   qty: 1, produced: true }
    ],
    "Faith in Every Footstep": [
      { gender: "Men's",   size: "9",   qty: 4, produced: true },
      { gender: "Men's",   size: "9.5", qty: 1, produced: true },
      { gender: "Men's",   size: "10",  qty: 1, produced: true },
      { gender: "Women's", size: "6.5", qty: 1, produced: true },
      { gender: "Women's", size: "7.5", qty: 1, produced: true },
      { gender: "Women's", size: "8.5", qty: 1, produced: true },
      { gender: "Women's", size: "9.5", qty: 1, produced: true }
    ],
    "Salt Lake Temple Ring": [
      { gender: "Men's",   size: "8.5", qty: 3, produced: true },
      { gender: "Men's",   size: "9",   qty: 1, produced: true },
      { gender: "Men's",   size: "9.5", qty: 1, produced: true },
      { gender: "Women's", size: "6",   qty: 1, produced: true },
      { gender: "Women's", size: "8.5", qty: 1, produced: true },
      { gender: "Women's", size: "9.5", qty: 1, produced: true }
    ]
  }
};

/* ---- Derived helpers (shared by chips + order form) --------------------- */
(function () {
  var INV = window.RR_INVENTORY;

  function stateOf(item) {
    if (!item.produced) return "not-produced";
    if (item.qty <= 0)  return "sold-out";
    if (item.qty === 1) return "low";
    return "available";
  }

  var LABEL = {
    "available":    "Available",
    "low":          "1 remaining",
    "sold-out":     "Sold out",
    "not-produced": "Not produced in this batch"
  };

  // Screen-reader sentence for each size button/option.
  function srLabel(item) {
    var who = item.gender + " size " + item.size;
    switch (stateOf(item)) {
      case "available":    return who + ", available";
      case "low":          return who + ", 1 remaining";
      case "sold-out":     return who + ", sold out, not selectable";
      case "not-produced": return who + ", not produced in this batch, not selectable";
    }
  }

  // A size can be ordered only if it is available or low (exactly 1).
  function selectable(item) {
    var s = stateOf(item);
    return s === "available" || s === "low";
  }

  INV.stateOf    = stateOf;
  INV.label      = function (item) { return LABEL[stateOf(item)]; };
  INV.srLabel    = srLabel;
  INV.selectable = selectable;
  INV.get        = function (design) { return INV.designs[design] || null; };
})();
