import json, sys, subprocess, os

TEMPLATE_DIR = r"C:\Users\Admin\.agents\skills\fireworks-tech-graph\scripts"
OUT_DIR = r"C:\Users\Admin\Desktop\Final Year Project\docs\diagrams"

W, H = 1920, 1080
STYLE = 1

def build(template, name, data):
    svg = os.path.join(OUT_DIR, f"{name}.svg")
    data.update({"style": STYLE, "width": W, "height": H, "template": template})
    inp = json.dumps(data)
    r = subprocess.run(
        ["py", "-3", os.path.join(TEMPLATE_DIR, "generate-from-template.py"), template, svg],
        input=inp, capture_output=True, text=True
    )
    if r.returncode != 0:
        print(f"FAIL {name}: {r.stderr or r.stdout}")
    else:
        print(f"OK {name}: {svg}")
    return r.returncode

# ─────────────────────────────────────────
# 1. Architecture Diagram
# ─────────────────────────────────────────
def diag_architecture():
    cw = 860  # column width
    gap = 40
    left_x = 40
    right_x = left_x + cw + gap
    row_h = 60
    row_gap = 20
    title_h = 80

    def row_y(idx):
        return title_h + idx * (row_h + row_gap)

    def container(id_, label, x, y, w, h, children):
        return {"id": id_, "label": label, "x": x, "y": y, "width": w, "height": h,
                "fill": "#f8fafc", "stroke": "#94a3b8", "stroke_dasharray": "6,3"}

    # Left column layers
    layers_left = [
        ("Entry Point", ["main.jsx", "App.jsx", "vite.config.js", "index.html"]),
        ("UI Components", ["Button", "Card", "Input", "Tabs", "NavigationMenu", "Label", "Textarea", "Resizable"]),
        ("Feature Pages", ["HomePage", "ProductCatalog", "ProductDetail", "CategoryPage",
                           "ComparePage", "ShoppingCart", "Checkout", "PaymentPage",
                           "LoginPage", "SignUpPage", "AdminOrders", "PCBuildPage"]),
        ("Feature API", ["catalog.js", "auth.js", "cart.js", "order.js", "builder.js", "admin.js", "user.js"]),
        ("State Mgmt", ["CartContext.jsx", "BuildContext.jsx", "useAuth.jsx"]),
        ("Core Library", ["supabase.js", "client.js", "utils.js", "currency.js", "categories.js"]),
        ("Database", ["users", "builds", "cart", "orders", "stock"]),
    ]
    layers_right = [
        ("Feature Components", ["Header", "Footer", "SearchPopover", "AdminLayout",
                                "ProductCard", "CategorySidebar", "ProtectedRoute"]),
        ("Styles", ["App.css", "index.css"]),
        ("Configuration", ["package.json", "eslint.config.js", "opencode.json", "jsconfig.json", "components.json"]),
        ("Documentation", ["README.md", "CHANGELOG.md", "task.md", "design.md", "FYP1.md", "ProjectLog.md"]),
        ("Scripts", ["cleanProductCatalog.cjs", "start_backend.py"]),
        ("Infrastructure", ["changelog.yml"]),
    ]

    containers = []
    nodes = []
    arrows = []
    node_id = 0

    def make_nodes(layers, base_x, col_w):
        nonlocal node_id
        res = []
        for li, (layer_name, items) in enumerate(layers):
            y = row_y(li)
            pad = 12
            item_h = 26
            item_gap = 4
            items_w = col_w - 2 * pad
            per_row = max(1, items_w // 140)
            rows_needed = -(-len(items) // per_row)  # ceil
            box_h = max(row_h, rows_needed * (item_h + item_gap) + pad * 2 - item_gap)
            c_id = f"c{li}"
            containers.append(container(c_id, layer_name, base_x, y, col_w, box_h + 18, items))
            # item boxes inside
            for ii, item in enumerate(items):
                r = ii // per_row
                c = ii % per_row
                ix = base_x + pad + c * (items_w / per_row)
                iy = y + 24 + pad + r * (item_h + item_gap)
                nid = f"n{node_id}"
                node_id += 1
                nodes.append({
                    "id": nid, "label": item, "x": ix, "y": iy,
                    "width": items_w / per_row - 4, "height": item_h,
                    "fill": "#eff6ff", "stroke": "#bfdbfe", "font_size": 11
                })
                res.append(nid)
        return res

    left_nodes = make_nodes(layers_left, left_x, cw)
    right_nodes = make_nodes(layers_right, right_x, cw)

    # Arrows: top-to-bottom data flow
    for i in range(len(layers_left) - 1):
        src_block = f"c{i}"
        tgt_block = f"c{i+1}"
        containers.append({
            "id": f"a{i}", "x": left_x + cw // 2 - 1, "y": row_y(i) + 60,
            "width": 2, "height": row_gap,
            "fill": "none", "stroke": "none"
        })
        # We need proper source/target node references for arrows
        # Use the first node in each layer as anchor
        src_id = left_nodes[i * 2] if i * 2 < len(left_nodes) else left_nodes[-1]
        tgt_id = left_nodes[(i + 1) * 2] if (i + 1) * 2 < len(left_nodes) else left_nodes[-1]
        arrows.append({
            "source": src_id, "target": tgt_id,
            "color": "#2563eb", "stroke_width": 2, "label": "depends on"
        })

    return {"title": "System Architecture — 13-Layer Overview",
            "containers": containers, "nodes": nodes, "arrows": arrows,
            "legend": [
                {"color": "#2563eb", "label": "Data flow / dependency"},
            ]}

# ─────────────────────────────────────────
# 2. Data Flow Diagram
# ─────────────────────────────────────────
def diag_dataflow():
    nodes = [
        {"id": "user", "label": "User Browser", "kind": "user_avatar", "x": 860, "y": 40,
         "width": 200, "height": 80, "fill": "#e0f2fe", "stroke": "#38bdf8"},
        {"id": "react", "label": "React App\n(App.jsx → Router)", "x": 860, "y": 180,
         "width": 200, "height": 70, "fill": "#f0fdf4", "stroke": "#4ade80"},
        {"id": "catalog", "label": "Catalog API\nsearchProducts()", "x": 100, "y": 340,
         "width": 200, "height": 70, "fill": "#eff6ff", "stroke": "#93c5fd"},
        {"id": "cart", "label": "Cart API\naddToCart() / checkout()", "x": 860, "y": 340,
         "width": 200, "height": 70, "fill": "#fef2f2", "stroke": "#fca5a5"},
        {"id": "auth", "label": "Auth API\nsignUp() / signIn()", "x": 1620, "y": 340,
         "width": 200, "height": 70, "fill": "#faf5ff", "stroke": "#c4b5fd"},
        {"id": "supabase", "label": "Supabase Backend\n(REST + PostgreSQL)", "x": 860, "y": 520,
         "width": 200, "height": 70, "fill": "#fffbeb", "stroke": "#fcd34d"},
    ]
    arrows = [
        {"source": "user", "target": "react", "label": "HTTP requests", "color": "#2563eb"},
        {"source": "react", "target": "catalog", "label": "GET /search", "color": "#2563eb"},
        {"source": "react", "target": "cart", "label": "POST /cart", "color": "#dc2626"},
        {"source": "react", "target": "auth", "label": "POST /auth", "color": "#9333ea"},
        {"source": "catalog", "target": "supabase", "label": "SQL queries", "color": "#16a34a"},
        {"source": "cart", "target": "supabase", "label": "SQL RPC", "color": "#16a34a"},
        {"source": "auth", "target": "supabase", "label": "Auth API", "color": "#16a34a"},
    ]
    return {"title": "Data Flow — Frontend → API → Supabase",
            "nodes": nodes, "arrows": arrows,
            "legend": [
                {"color": "#2563eb", "label": "Catalog search flow"},
                {"color": "#dc2626", "label": "Cart / Checkout flow"},
                {"color": "#9333ea", "label": "Authentication flow"},
                {"color": "#16a34a", "label": "Database queries"},
            ]}

# ─────────────────────────────────────────
# 3. ER Diagram
# ─────────────────────────────────────────
def diag_er():
    nodes = [
        {"id": "users", "label": "users", "kind": "database", "x": 60, "y": 80,
         "width": 200, "height": 120, "fill": "#eff6ff", "stroke": "#93c5fd",
         "sublabel": "id (PK) • email • name\ncreated_at"},
        {"id": "builds", "label": "builds", "kind": "database", "x": 320, "y": 80,
         "width": 200, "height": 140, "fill": "#f0fdf4", "stroke": "#4ade80",
         "sublabel": "id (PK) • user_id (FK)\nname • total_price\ncomponents (JSONB)\ncreated_at"},
        {"id": "cart", "label": "cart", "kind": "database", "x": 580, "y": 80,
         "width": 200, "height": 120, "fill": "#fef2f2", "stroke": "#fca5a5",
         "sublabel": "id (PK) • user_id (FK)\nproduct_id • quantity\ncreated_at"},
        {"id": "orders", "label": "orders", "kind": "database", "x": 840, "y": 80,
         "width": 200, "height": 140, "fill": "#faf5ff", "stroke": "#c4b5fd",
         "sublabel": "id (PK) • user_id (FK)\nstatus • total\nshipping_address\ncreated_at"},
        {"id": "order_items", "label": "order_items", "kind": "database", "x": 1100, "y": 80,
         "width": 200, "height": 100, "fill": "#fff7ed", "stroke": "#fdba74",
         "sublabel": "order_id (FK) • product_id\nquantity • price"},
        {"id": "stock", "label": "stock", "kind": "database", "x": 1360, "y": 80,
         "width": 200, "height": 120, "fill": "#f0fdfa", "stroke": "#2dd4bf",
         "sublabel": "id (PK) • product_id\nquantity • reserved\nupdated_at"},
    ]
    arrows = [
        {"source": "users", "target": "builds", "label": "1:N", "color": "#2563eb"},
        {"source": "users", "target": "cart", "label": "1:N", "color": "#2563eb"},
        {"source": "users", "target": "orders", "label": "1:N", "color": "#2563eb"},
        {"source": "orders", "target": "order_items", "label": "1:N", "color": "#2563eb"},
        {"source": "cart", "target": "stock", "label": "M:N", "color": "#dc2626"},
        {"source": "orders", "target": "stock", "label": "references", "color": "#16a34a"},
    ]
    return {"title": "Database ER Diagram — Supabase Tables",
            "nodes": nodes, "arrows": arrows,
            "legend": [
                {"color": "#2563eb", "label": "One-to-Many (FK)"},
                {"color": "#dc2626", "label": "Many-to-Many"},
                {"color": "#16a34a", "label": "References"},
            ]}

# ─────────────────────────────────────────
# 4. Sequence Diagram
# ─────────────────────────────────────────
def diag_sequence():
    nodes = [
        {"id": "user", "label": "User", "x": 80, "y": 60, "width": 80, "height": 40, "fill": "#e0f2fe", "stroke": "#38bdf8"},
        {"id": "browser", "label": "Browser", "x": 240, "y": 60, "width": 120, "height": 40, "fill": "#f8fafc", "stroke": "#94a3b8"},
        {"id": "catalog", "label": "Catalog Page", "x": 440, "y": 60, "width": 140, "height": 40, "fill": "#f0fdf4", "stroke": "#4ade80"},
        {"id": "api", "label": "API / Supabase", "x": 660, "y": 60, "width": 140, "height": 40, "fill": "#fffbeb", "stroke": "#fcd34d"},
        {"id": "cartctx", "label": "Cart Context", "x": 880, "y": 60, "width": 140, "height": 40, "fill": "#fef2f2", "stroke": "#fca5a5"},
        {"id": "checkout", "label": "Checkout Page", "x": 1100, "y": 60, "width": 140, "height": 40, "fill": "#faf5ff", "stroke": "#c4b5fd"},
    ]
    # sequence arrows with y positions
    arrows = [
        {"source": "user", "target": "browser", "x1": 120, "y1": 150, "x2": 300, "y2": 150, "label": "Browse catalog"},
        {"source": "browser", "target": "catalog", "x1": 300, "y1": 200, "x2": 510, "y2": 200, "label": "Select category / search"},
        {"source": "catalog", "target": "api", "x1": 510, "y1": 250, "x2": 730, "y2": 250, "label": "searchProducts(filters)"},
        {"source": "api", "target": "catalog", "x1": 730, "y1": 300, "x2": 510, "y2": 300, "label": "Return results", "dashed": True},
        {"source": "catalog", "target": "browser", "x1": 510, "y1": 350, "x2": 300, "y2": 350, "label": "Render spec table", "dashed": True},
        {"source": "user", "target": "browser", "x1": 120, "y1": 400, "x2": 300, "y2": 400, "label": "Click Add to Cart"},
        {"source": "browser", "target": "cartctx", "x1": 300, "y1": 450, "x2": 950, "y2": 450, "label": "dispatch({type: ADD})"},
        {"source": "cartctx", "target": "api", "x1": 950, "y1": 500, "x2": 730, "y2": 500, "label": "addToCart(productId)"},
        {"source": "user", "target": "browser", "x1": 120, "y1": 550, "x2": 300, "y2": 550, "label": "Proceed to Checkout"},
        {"source": "browser", "target": "checkout", "x1": 300, "y1": 600, "x2": 1170, "y2": 600, "label": "Navigate /checkout"},
        {"source": "checkout", "target": "api", "x1": 1170, "y1": 650, "x2": 730, "y2": 650, "label": "placeOrder(items)"},
        {"source": "checkout", "target": "browser", "x1": 1170, "y1": 700, "x2": 300, "y2": 700, "label": "Order Confirmation", "dashed": True},
    ]
    return {"title": "Purchase Flow — Browse → Cart → Checkout → Confirmation",
            "nodes": nodes, "arrows": arrows}

# ─────────────────────────────────────────
# 5. Use Case Diagram
# ─────────────────────────────────────────
def diag_usecase():
    nodes = [
        {"id": "user_actor", "label": "User", "kind": "user_avatar", "x": 40, "y": 300,
         "width": 80, "height": 80, "fill": "#e0f2fe", "stroke": "#38bdf8"},
        {"id": "admin_actor", "label": "Admin", "kind": "user_avatar", "x": 40, "y": 700,
         "width": 80, "height": 80, "fill": "#fef2f2", "stroke": "#fca5a5"},
    ]
    usecases = [
        "Browse Catalog", "Search Products", "Compare Products",
        "Add to Cart", "Checkout", "Build PC",
        "Manage Account", "View Wishlist",
        "Manage Products", "View Orders", "Update Order Status"
    ]
    cols, rows = 3, 4
    bx, by = 200, 120
    for i, uc in enumerate(usecases):
        c = i % cols
        r = i // cols
        nodes.append({
            "id": f"uc{i}", "label": uc,
            "kind": "ellipse", "x": bx + c * 320, "y": by + r * 100,
            "width": 260, "height": 60, "fill": "#f8fafc", "stroke": "#94a3b8"
        })
    # System boundary
    containers = [{"id": "sys", "label": "PC Builder E-Commerce System", "x": 180, "y": 80,
                   "width": 1200, "height": 850, "fill": "none", "stroke": "#64748b",
                   "stroke_dasharray": "8,4"}]
    arrows = [
        {"source": "user_actor", "target": "uc0", "color": "#2563eb"},
        {"source": "user_actor", "target": "uc1", "color": "#2563eb"},
        {"source": "user_actor", "target": "uc2", "color": "#2563eb"},
        {"source": "user_actor", "target": "uc3", "color": "#2563eb"},
        {"source": "user_actor", "target": "uc4", "color": "#2563eb"},
        {"source": "user_actor", "target": "uc5", "color": "#2563eb"},
        {"source": "user_actor", "target": "uc6", "color": "#2563eb"},
        {"source": "user_actor", "target": "uc7", "color": "#2563eb"},
        {"source": "admin_actor", "target": "uc8", "color": "#dc2626"},
        {"source": "admin_actor", "target": "uc9", "color": "#dc2626"},
        {"source": "admin_actor", "target": "uc10", "color": "#dc2626"},
    ]
    return {"title": "Use Case Diagram — Actors and Features",
            "nodes": nodes, "arrows": arrows, "containers": containers,
            "legend": [
                {"color": "#2563eb", "label": "User actions"},
                {"color": "#dc2626", "label": "Admin actions"},
            ]}

# ─────────────────────────────────────────
# 6. Activity / Flowchart — Purchase Flow
# ─────────────────────────────────────────
def diag_flowchart():
    nodes = [
        {"id": "start", "label": "Start", "kind": "circle", "x": 860, "y": 20, "width": 40, "height": 40, "fill": "#111827"},
        {"id": "browse", "label": "Browse Products", "kind": "process", "x": 780, "y": 100, "width": 200, "height": 50, "fill": "#eff6ff", "stroke": "#93c5fd"},
        {"id": "select", "label": "Select Product", "kind": "process", "x": 780, "y": 200, "width": 200, "height": 50, "fill": "#eff6ff", "stroke": "#93c5fd"},
        {"id": "addcart", "label": "Add to Cart", "kind": "process", "x": 780, "y": 300, "width": 200, "height": 50, "fill": "#f0fdf4", "stroke": "#4ade80"},
        {"id": "decide", "label": "Continue Shopping?", "kind": "decision", "x": 780, "y": 420, "width": 200, "height": 70, "fill": "#fefce8", "stroke": "#facc15"},
        {"id": "checkout", "label": "Proceed to Checkout", "kind": "process", "x": 780, "y": 560, "width": 200, "height": 50, "fill": "#fef2f2", "stroke": "#fca5a5"},
        {"id": "shipping", "label": "Enter Shipping Info", "kind": "process", "x": 780, "y": 660, "width": 200, "height": 50, "fill": "#fef2f2", "stroke": "#fca5a5"},
        {"id": "pay", "label": "Process Payment", "kind": "process", "x": 780, "y": 760, "width": 200, "height": 50, "fill": "#faf5ff", "stroke": "#c4b5fd"},
        {"id": "confirm", "label": "Order Confirmation", "kind": "process", "x": 780, "y": 860, "width": 200, "height": 50, "fill": "#f0fdf4", "stroke": "#4ade80"},
        {"id": "end", "label": "End", "kind": "circle", "x": 860, "y": 970, "width": 40, "height": 40, "fill": "#111827"},
    ]
    arrows = [
        {"source": "start", "target": "browse", "color": "#2563eb"},
        {"source": "browse", "target": "select", "color": "#2563eb"},
        {"source": "select", "target": "addcart", "color": "#2563eb"},
        {"source": "addcart", "target": "decide", "color": "#2563eb"},
        {"source": "decide", "target": "browse", "label": "Yes", "color": "#16a34a", "corridor_y": [200]},
        {"source": "decide", "target": "checkout", "label": "No", "color": "#dc2626"},
        {"source": "checkout", "target": "shipping", "color": "#2563eb"},
        {"source": "shipping", "target": "pay", "color": "#2563eb"},
        {"source": "pay", "target": "confirm", "color": "#2563eb"},
        {"source": "confirm", "target": "end", "color": "#2563eb"},
    ]
    return {"title": "Activity Diagram — Purchase Flow",
            "nodes": nodes, "arrows": arrows}

# ─────────────────────────────────────────
# 7. Component Diagram
# ─────────────────────────────────────────
def diag_component():
    nodes = [
        {"id": "app", "label": "App.jsx\n(Router)", "x": 860, "y": 40, "width": 200, "height": 60, "fill": "#e0f2fe", "stroke": "#38bdf8"},
        {"id": "header", "label": "Header (Navigation)", "x": 160, "y": 180, "width": 200, "height": 60, "fill": "#f8fafc", "stroke": "#94a3b8"},
        {"id": "footer", "label": "Footer", "x": 1560, "y": 180, "width": 200, "height": 60, "fill": "#f8fafc", "stroke": "#94a3b8"},
        {"id": "pages", "label": "Page Components", "x": 860, "y": 180, "width": 200, "height": 60, "fill": "#f0fdf4", "stroke": "#4ade80"},
        {"id": "catalog", "label": "Catalog Pages\n(ProductCatalog,\nCompare, Detail)", "x": 100, "y": 340, "width": 220, "height": 80, "fill": "#eff6ff", "stroke": "#93c5fd"},
        {"id": "cart", "label": "Cart Pages\n(ShoppingCart,\nCheckout, Payment)", "x": 380, "y": 340, "width": 220, "height": 80, "fill": "#fef2f2", "stroke": "#fca5a5"},
        {"id": "auth", "label": "Auth Pages\n(Login, SignUp,\nAccount)", "x": 660, "y": 340, "width": 220, "height": 80, "fill": "#faf5ff", "stroke": "#c4b5fd"},
        {"id": "admin", "label": "Admin Pages\n(Dashboard,\nOrders, Products)", "x": 940, "y": 340, "width": 220, "height": 80, "fill": "#fef2f2", "stroke": "#fca5a5"},
        {"id": "builder", "label": "Builder Pages\n(PCBuild,\nChooseComponent)", "x": 1220, "y": 340, "width": 220, "height": 80, "fill": "#fffbeb", "stroke": "#fcd34d"},
        {"id": "hooks", "label": "Contexts & Hooks\n(useCart, useAuth,\nuseBuild)", "x": 860, "y": 520, "width": 200, "height": 60, "fill": "#f0fdf4", "stroke": "#4ade80"},
        {"id": "api", "label": "API Modules\n(catalog, cart, auth,\norder, builder, admin)", "x": 860, "y": 660, "width": 200, "height": 60, "fill": "#f0fdf4", "stroke": "#4ade80"},
        {"id": "supabase", "label": "Supabase\n(Client SDK)", "x": 860, "y": 800, "width": 200, "height": 60, "fill": "#fffbeb", "stroke": "#fcd34d"},
    ]
    arrows = [
        {"source": "app", "target": "header", "color": "#2563eb"},
        {"source": "app", "target": "footer", "color": "#2563eb"},
        {"source": "app", "target": "pages", "color": "#2563eb"},
        {"source": "pages", "target": "catalog", "color": "#16a34a"},
        {"source": "pages", "target": "cart", "color": "#16a34a"},
        {"source": "pages", "target": "auth", "color": "#16a34a"},
        {"source": "pages", "target": "admin", "color": "#16a34a"},
        {"source": "pages", "target": "builder", "color": "#16a34a"},
        {"source": "catalog", "target": "hooks", "color": "#9333ea"},
        {"source": "cart", "target": "hooks", "color": "#9333ea"},
        {"source": "auth", "target": "hooks", "color": "#9333ea"},
        {"source": "builder", "target": "hooks", "color": "#9333ea"},
        {"source": "hooks", "target": "api", "color": "#2563eb"},
        {"source": "api", "target": "supabase", "color": "#2563eb"},
    ]
    return {"title": "Component Diagram — React Component Hierarchy",
            "nodes": nodes, "arrows": arrows,
            "legend": [
                {"color": "#2563eb", "label": "Composition / renders"},
                {"color": "#16a34a", "label": "Routing / navigation"},
                {"color": "#9333ea", "label": "State / context subscription"},
            ]}

# ─────────────────────────────────────────
# 8. Class / Data Model Diagram
# ─────────────────────────────────────────
def diag_class():
    nodes = [
        {"id": "product", "label": "Product", "kind": "class",
         "x": 60, "y": 80, "width": 280, "height": 200, "fill": "#eff6ff", "stroke": "#93c5fd",
         "sublabel": "- id: string\n- name: string\n- category: string\n- price: number\n- stock: number\n- specs: object\n+ getPrice(): number"},
        {"id": "cartitem", "label": "CartItem", "kind": "class",
         "x": 400, "y": 80, "width": 280, "height": 150, "fill": "#fef2f2", "stroke": "#fca5a5",
         "sublabel": "- userId: string\n- productId: string\n- quantity: number\n- price: number\n+ totalPrice(): number"},
        {"id": "order", "label": "Order", "kind": "class",
         "x": 740, "y": 80, "width": 280, "height": 180, "fill": "#faf5ff", "stroke": "#c4b5fd",
         "sublabel": "- id: string\n- userId: string\n- status: OrderStatus\n- total: number\n- shippingAddr: Address\n+ placeOrder(): void"},
        {"id": "orderitem", "label": "OrderItem", "kind": "class",
         "x": 1080, "y": 80, "width": 280, "height": 150, "fill": "#fff7ed", "stroke": "#fdba74",
         "sublabel": "- orderId: string\n- productId: string\n- quantity: number\n- price: number"},
        {"id": "build", "label": "PC Build", "kind": "class",
         "x": 60, "y": 380, "width": 280, "height": 170, "fill": "#f0fdf4", "stroke": "#4ade80",
         "sublabel": "- id: string\n- userId: string\n- name: string\n- components: BuildItem[]\n- totalPrice: number\n+ checkCompatibility(): bool"},
        {"id": "stockitem", "label": "StockItem", "kind": "class",
         "x": 400, "y": 380, "width": 280, "height": 150, "fill": "#f0fdfa", "stroke": "#2dd4bf",
         "sublabel": "- productId: string\n- quantity: number\n- reserved: number\n+ available(): number\n+ reserve(n): void"},
        {"id": "user", "label": "User", "kind": "class",
         "x": 740, "y": 380, "width": 280, "height": 170, "fill": "#e0f2fe", "stroke": "#38bdf8",
         "sublabel": "- id: string\n- email: string\n- name: string\n- createdAt: Date\n+ getOrders(): Order[]"},
        {"id": "address", "label": "Address", "kind": "class",
         "x": 1080, "y": 380, "width": 280, "height": 130, "fill": "#f8fafc", "stroke": "#94a3b8",
         "sublabel": "- street: string\n- city: string\n- state: string\n- zip: string"},
    ]
    arrows = [
        {"source": "user", "target": "order", "label": "1:N", "color": "#2563eb"},
        {"source": "order", "target": "orderitem", "label": "1:N", "color": "#2563eb"},
        {"source": "order", "target": "address", "label": "1:1", "color": "#16a34a"},
        {"source": "user", "target": "build", "label": "1:N", "color": "#2563eb"},
        {"source": "user", "target": "cartitem", "label": "1:N", "color": "#2563eb"},
        {"source": "product", "target": "cartitem", "label": "1:N", "color": "#9333ea"},
        {"source": "product", "target": "stockitem", "label": "1:1", "color": "#16a34a"},
    ]
    return {"title": "Class / Data Model Diagram",
            "nodes": nodes, "arrows": arrows,
            "legend": [
                {"color": "#2563eb", "label": "One-to-Many (FK)"},
                {"color": "#16a34a", "label": "One-to-One"},
                {"color": "#9333ea", "label": "Association"},
            ]}

# ─────────────────────────────────────────
# Main
# ─────────────────────────────────────────
os.makedirs(OUT_DIR, exist_ok=True)

diagrams = [
    ("architecture", "01-architecture", diag_architecture()),
    ("data-flow", "02-dataflow", diag_dataflow()),
    ("er-diagram", "03-er-diagram", diag_er()),
    ("sequence", "04-sequence", diag_sequence()),
    ("use-case", "05-usecase", diag_usecase()),
    ("flowchart", "06-activity-flowchart", diag_flowchart()),
    ("architecture", "07-component-diagram", diag_component()),
    ("class", "08-class-diagram", diag_class()),
]

failures = 0
for tmpl, name, data in diagrams:
    rc = build(tmpl, name, data)
    if rc != 0:
        failures += 1

if failures:
    print(f"\n{ failures } diagram(s) FAILED")
else:
    print("\nAll 8 diagrams generated successfully!")
