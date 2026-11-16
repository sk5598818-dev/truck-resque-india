import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def create_truck_rescue_excel():
    wb = openpyxl.Workbook()
    # Remove default sheet
    wb.remove(wb.active)

    # Styles
    header_fill_orange = PatternFill(start_color="EA580C", end_color="EA580C", fill_type="solid")
    header_fill_dark = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
    header_fill_green = PatternFill(start_color="059669", end_color="059669", fill_type="solid")
    header_fill_blue = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
    header_fill_cyan = PatternFill(start_color="0E7490", end_color="0E7490", fill_type="solid")
    
    zebra_fill = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
    white_font_bold = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    title_font = Font(name="Calibri", size=16, bold=True, color="0F172A")
    subtitle_font = Font(name="Calibri", size=11, italic=True, color="475569")
    regular_font = Font(name="Calibri", size=10, color="1E293B")
    bold_font = Font(name="Calibri", size=10, bold=True, color="0F172A")

    thin_border = Border(
        left=Side(style='thin', color="CBD5E1"),
        right=Side(style='thin', color="CBD5E1"),
        top=Side(style='thin', color="CBD5E1"),
        bottom=Side(style='thin', color="CBD5E1")
    )

    def style_sheet(ws, title_text, headers, rows, header_fill):
        # Title block
        ws.append([title_text])
        ws.cell(row=1, column=1).font = title_font
        ws.append(["TRUCK RESCUE INDIA — 24x7 Heavy Commercial Vehicle Service Network Platform"])
        ws.cell(row=2, column=1).font = subtitle_font
        ws.append([]) # Empty row

        # Header row
        header_row_idx = 4
        ws.append(headers)
        for col_idx in range(1, len(headers) + 1):
            cell = ws.cell(row=header_row_idx, column=col_idx)
            cell.fill = header_fill
            cell.font = white_font_bold
            cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
            cell.border = thin_border

        # Data rows
        for r_idx, row_data in enumerate(rows, start=header_row_idx + 1):
            ws.append(row_data)
            is_zebra = (r_idx % 2 == 0)
            for col_idx in range(1, len(row_data) + 1):
                cell = ws.cell(row=r_idx, column=col_idx)
                cell.font = regular_font
                cell.border = thin_border
                if is_zebra:
                    cell.fill = zebra_fill
                # Alignment & Highlights
                val = str(cell.value or '')
                if val in ["Yes", "Active", "Verified", "100% Free", "HIGH", "CRITICAL", "Live", "State", "Active Coverage", "Guaranteed Free"]:
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                    if val in ["Yes", "Active", "Verified", "100% Free", "Live", "Active Coverage", "Guaranteed Free"]:
                        cell.font = Font(name="Calibri", size=10, bold=True, color="047857")
                    elif val in ["HIGH", "CRITICAL"]:
                        cell.font = Font(name="Calibri", size=10, bold=True, color="B91C1C")
                elif any(char.isdigit() for char in val) and len(val) <= 12 and not val.startswith('+'):
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                else:
                    cell.alignment = Alignment(horizontal="left", vertical="center")

        # Auto-adjust column widths
        for col in ws.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                if cell.row < 4:
                    continue
                if cell.value:
                    val_str = str(cell.value)
                    max_len = max(max_len, len(val_str))
            ws.column_dimensions[col_letter].width = min(max(max_len + 4, 12), 52)

    # ----------------------------------------------------
    # SHEET 1: Platform Overview
    # ----------------------------------------------------
    ws1 = wb.create_sheet(title="Platform Overview")
    ws1.views.sheetView[0].showGridLines = True
    ws1.append(["TRUCK RESCUE INDIA — PLATFORM ARCHITECTURE & EXECUTIVE SUMMARY"])
    ws1.cell(row=1, column=1).font = title_font
    ws1.append(["Master system configuration, environment parameters, and central operations infrastructure."])
    ws1.cell(row=2, column=1).font = subtitle_font
    ws1.append([])

    overview_data = [
        ["Platform Parameter", "Configuration Value / Details", "Production Status"],
        ["Application Name", "TRUCK RESCUE INDIA", "Active"],
        ["Industry Sector", "Heavy Commercial Vehicles (HCV), Multi-Axle Trucks, Trailers & Freight Logistics", "Active"],
        ["Official Website", "https://truckrescueindia.in", "Configured"],
        ["Central Toll-Free Helpline", "1800-889-988 (24x7 Operations Room)", "Live"],
        ["NHAI Highway Emergency Desk", "1033 (National Highway Authority of India)", "Live"],
        ["WhatsApp Highway Assistance", "+91 98201 23456", "Live"],
        ["Grievance & Ops Email", "support@truckrescueindia.in", "Active"],
        ["Frontend Tech Stack", "Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons", "Production Ready"],
        ["Mobile Tech Stack", "Flutter 3.x, Dart, Clean Architecture, Material 3 Dark Theme", "Production Ready"],
        ["Database Architecture", "Cloud Firestore (geohashes, real-time reactive streams)", "Production Ready"],
        ["Authentication Architecture", "Firebase Phone Auth (+91 Indian Mobiles, 60s auto-resend OTP)", "Production Ready"],
        ["Payment Gateway", "Razorpay Payment Gateway (UPI, Cards, NetBanking, HMAC-SHA256)", "Integrated"],
        ["AI Diagnostic Engine", "Bilingual (Hindi / English) SPN, FMI, P-Code Analysis, DPF & NOx Guidance", "Production Ready"],
        ["PWA & Offline Resilience", "Service Worker (sw.js), Cache-First Assets, Offline Highway Fallback", "Production Ready"],
        ["Partner Registration Policy", "100% Free Lifetime Registration for Mechanics, Electricians & Garages", "Guaranteed Free"],
        ["Phase 11 Network Coverage", "All 28 Indian States + 8 Union Territories (36 Total Covered)", "Live & Active"],
        ["Growth & Referral Engine", "Standardized TRI-STATE-XXXX Viral WhatsApp Invitations & Rewards", "Live & Active"],
        ["Anti-Fraud Engine", "Strict Self-Referral Prevention (Phone, UID, Duplication Guard)", "Active"],
        ["Automated Test Coverage", "179 / 179 Tests Passed (100% Verification Rate)", "Verified"],
        ["Total Static Pages Built", "52 Pre-rendered App Router Pages", "Compiled"],
        ["Total Dynamic APIs", "22 Secure Server-Side Next.js API Routes", "Compiled"],
    ]

    for r_idx, row in enumerate(overview_data, start=4):
        ws1.append(row)
        is_header = (r_idx == 4)
        for c_idx in range(1, len(row) + 1):
            cell = ws1.cell(row=r_idx, column=c_idx)
            cell.border = thin_border
            if is_header:
                cell.fill = header_fill_dark
                cell.font = white_font_bold
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.font = regular_font
                if row[2] in ["Active", "Live", "Production Ready", "Guaranteed Free", "Verified", "Compiled", "Live & Active"]:
                    if c_idx == 3:
                        cell.font = Font(name="Calibri", size=10, bold=True, color="047857")
                        cell.alignment = Alignment(horizontal="center", vertical="center")
                if r_idx % 2 == 0:
                    cell.fill = zebra_fill

    for col in ws1.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            if cell.row < 4: continue
            if cell.value: max_len = max(max_len, len(str(cell.value)))
        ws1.column_dimensions[col_letter].width = min(max(max_len + 4, 15), 52)

    # ----------------------------------------------------
    # SHEET 2: Verified Garages Network
    # ----------------------------------------------------
    ws2 = wb.create_sheet(title="Garages & Network")
    ws2.views.sheetView[0].showGridLines = True
    garage_headers = [
        "Garage ID", "Workshop Name", "Owner Name", "Mobile Phone", "WhatsApp", 
        "City", "State", "Highway Corridor", "Latitude", "Longitude",
        "Primary Services", "Brands Handled", "24x7 Service", "Roadside Van", 
        "Rating", "Total Reviews", "Verification Status", "Subscription Tier"
    ]
    garage_rows = [
        ["GAR-001", "Bhiwandi Highway Heavy Truck Clinic", "Mohammad Imran Ansari", "+91 98201 11222", "+91 98201 11222", "Bhiwandi", "Maharashtra", "NH 48 / Mankoli Bypass", 19.2969, 73.0631, "Heavy Engine, BS6 Scanner, SCR AdBlue", "Tata, Ashok Leyland, BharatBenz", "Yes", "Yes", 4.9, 128, "Verified", "Featured"],
        ["GAR-002", "Kalamboli Trailer & Crane Recovery", "Gurmeet Singh Sandhu", "+91 98192 33444", "+91 98192 33444", "Navi Mumbai", "Maharashtra", "JNPT Port / NH 48 / E-way", 19.0330, 73.1020, "50-Ton Underlift Crane, Kamani, Trailer", "Tata, Leyland, Volvo, Scania", "Yes", "Yes", 4.8, 94, "Verified", "Premium"],
        ["GAR-003", "Sanjay Gandhi Transport Nagar Auto Lab", "Rajesh Sharma", "+91 98110 55666", "+91 98110 55666", "Delhi", "Delhi NCR", "NH 44 (GT Karnal Road)", 28.7520, 77.1350, "ECM Flashing, Wiring Harness, Laptop Scan", "Tata Signa, Leyland AVTR, Eicher Pro", "Yes", "Yes", 4.9, 215, "Verified", "Premium"],
        ["GAR-004", "Kundli Border Commercial Truck Hub", "Satnam Singh Dhillon", "+91 98120 77888", "+91 98120 77888", "Sonipat", "Haryana", "NH 44 / KMP Expressway", 28.8780, 77.1210, "Air Brake, Radial Tyre Puncture, Battery", "All Multi-Axle Trailers", "Yes", "Yes", 4.7, 82, "Verified", "Free"],
        ["GAR-005", "Kanpur Transport Nagar Diesel & ECM", "Santosh Tiwari", "+91 94150 22334", "+91 94150 22334", "Kanpur", "Uttar Pradesh", "NH 19 (GT Road Corridor)", 26.4499, 80.3319, "CRDI Pump, Injector, NOx Sensor Repair", "Tata, Leyland, Mahindra Blazo", "Yes", "Yes", 4.8, 160, "Verified", "Featured"],
        ["GAR-006", "Agra Expressway 24x7 Rescue Point", "Virender Yadav", "+91 94120 88990", "+91 94120 88990", "Agra", "Uttar Pradesh", "Yamuna Expressway / Agra-Lucknow", 27.1767, 78.0081, "Emergency Towing, Radiator Heating, Tyre", "Tata, BharatBenz, Eicher", "Yes", "Yes", 4.6, 75, "Verified", "Free"],
        ["GAR-007", "Chakan Auto Corridor Heavy Clinic", "Prashant Patil", "+91 98220 44556", "+91 98220 44556", "Pune", "Maharashtra", "NH 60 / Pune Industrial Belt", 18.7606, 73.8636, "Clutch Overhaul, Alternator, Self Starter", "Tata Prima, BharatBenz, Volvo", "Yes", "Yes", 4.7, 110, "Verified", "Featured"],
        ["GAR-008", "Nagpur Zero Mile Transport Solutions", "Devendra Deshmukh", "+91 98230 66778", "+91 98230 66778", "Nagpur", "Maharashtra", "NH 44 / Samruddhi Mahamarg", 21.1458, 79.0882, "BS6 AdBlue, DPF Forced Regen, Electrical", "Tata, Ashok Leyland, Eicher", "Yes", "Yes", 4.8, 142, "Verified", "Premium"],
        ["GAR-009", "Jaipur Highway Radial Tyre & Spares", "Ramkishan Gurjar", "+91 94140 11234", "+91 94140 11234", "Jaipur", "Rajasthan", "NH 48 (Delhi-Jaipur Expressway)", 26.9124, 75.7873, "295/90 R20 Radial Tyres, Rim Alignment", "All Heavy Trucks & Trailers", "Yes", "Yes", 4.9, 98, "Verified", "Featured"],
        ["GAR-010", "Durgapur Steel Corridor Truck Hospital", "Bikash Mukherjee", "+91 94340 55678", "+91 94340 55678", "Durgapur", "West Bengal", "NH 19 (Kolkata Freight Corridor)", 23.5204, 87.3119, "Kamani Welding, Chassis Alignment, Brake", "Tata, Ashok Leyland", "Yes", "No", 4.6, 67, "Verified", "Free"],
        ["GAR-011", "Nelamangala Heavy Vehicle Diagnostic", "K. S. Manjunath", "+91 98450 33221", "+91 98450 33221", "Bangalore", "Karnataka", "NH 48 / Nelamangala Toll", 13.0995, 77.3934, "Cummins Inline, Bosch Diagnostic, ECM", "Tata, Leyland, BharatBenz, Volvo", "Yes", "Yes", 4.8, 134, "Verified", "Featured"],
        ["GAR-012", "Madhavaram Chennai Container Assistance", "R. Murugan", "+91 98400 99887", "+91 98400 99887", "Chennai", "Tamil Nadu", "NH 16 / Chennai Port Corridor", 13.1489, 80.2307, "Hydraulic Crane, Air Pressure Leak, Tyre", "Container Trailers, Multi-Axle", "Yes", "Yes", 4.7, 89, "Verified", "Free"],
    ]
    style_sheet(ws2, "VERIFIED HIGHWAY GARAGES & SERVICE PROVIDER DIRECTORY", garage_headers, garage_rows, header_fill_orange)

    # ----------------------------------------------------
    # SHEET 3: Emergency Breakdown Rates
    # ----------------------------------------------------
    ws3 = wb.create_sheet(title="Breakdown Rates")
    ws3.views.sheetView[0].showGridLines = True
    rate_headers = [
        "Issue Category", "Common Fault Symptoms", "Applicable Truck Spec", 
        "Labor Charge Est. (₹)", "Roadside Van Fee (₹)", "Typical Parts Replaced", "Avg Time (Mins)"
    ]
    rate_rows = [
        ["Engine / Not Starting", "Cranking but no start, battery dead, 24V drop", "BS4 / BS6 Commercial", "₹800 - ₹1,500", "₹500 - ₹1,000", "24V Battery terminal, Starter relay, Fuse", "45 mins"],
        ["BS6 AdBlue / SCR Failure", "SCR doser crystalized, NOx sensor communication timeout", "BS6 Diesel (Tata/Leyland)", "₹1,200 - ₹2,500", "₹800 - ₹1,500", "AdBlue DEF Filter, Doser nozzle, NOx Sensor", "60 mins"],
        ["DPF Soot Level 4 Choke", "DPF regeneration lamp blinking, severe engine derate", "BS6 Commercial Trucks", "₹1,500 - ₹3,000", "₹800 - ₹1,200", "DPF differential sensor, Manual forced regen", "90 mins"],
        ["Electrical & Wiring Harness", "Short circuit, wiring burning smell, cluster lights off", "All Heavy Vehicles", "₹1,000 - ₹2,200", "₹500 - ₹1,000", "Wiring splice, 70A mega fuses, relay kit", "60 mins"],
        ["Starter Motor / Alternator", "Click sound on ignition, no charge, battery draining", "12V / 24V Commercial", "₹900 - ₹1,800", "₹600 - ₹1,000", "Carbon brush, Bendix gear, Alternator belt", "60 mins"],
        ["Radial Tyre Burst / Puncture", "Flat tyre on highway, bead broken, rim puncture", "295/90 R20, 10.00 R20", "₹400 - ₹800", "₹500 - ₹800", "Cold cure patch, Heavy tube, Valve pin", "30 mins"],
        ["Air Brake Pressure Failure", "Pressure drop below 6 bar, spring brake locked", "Dual Circuit Air Brake", "₹800 - ₹1,800", "₹600 - ₹1,000", "Unloader valve, Brake chamber diaphragm, Hose", "45 mins"],
        ["CRDI Fuel Injection Lock", "Air lock after running dry, high pressure leak", "Common Rail CRDI Pumps", "₹1,000 - ₹2,000", "₹600 - ₹1,000", "Fuel feed hand primer, Primary diesel filter", "40 mins"],
        ["Kamani / Leaf Spring Broken", "Truck tilted, leaf spring main patta broken", "Multi-Axle HCV / Trailers", "₹1,200 - ₹2,500", "₹800 - ₹1,500", "Main patta, Kamani bush, U-bolt, Center bolt", "90 mins"],
        ["Hydraulic Towing (50 km)", "Engine seized, highway collision, chassis damage", "Trailers up to 55 Tons", "₹5,000 - ₹12,000", "Included in quote", "Heavy Underlift Crane, Winch recovery", "120 mins"],
    ]
    style_sheet(ws3, "HIGHWAY EMERGENCY ROADSIDE SERVICE RATE CARD (ESTIMATED)", rate_headers, rate_rows, header_fill_green)

    # ----------------------------------------------------
    # SHEET 4: AI Fault Codes & Diagnostics
    # ----------------------------------------------------
    ws4 = wb.create_sheet(title="AI Diagnostic Codes")
    ws4.views.sheetView[0].showGridLines = True
    diag_headers = [
        "Fault Code", "Vehicle System", "Manufacturer", "English Diagnostic Meaning", 
        "Hindi Meaning (हिंदी)", "Severity Level", "Recommended Highway Action"
    ]
    diag_rows = [
        ["SPN 3226 FMI 9", "NOx Sensor / Exhaust", "Tata / Cummins / Leyland", "Outlet NOx Sensor Abnormal Update Rate / CAN Timeout", "साइलेंसर आउटलेट NOx सेंसर संचार त्रुटि (AdBlue)", "HIGH", "Check 4-wire CAN harness. Measure 60 Ohms across CAN H & CAN L. Verify 24V supply."],
        ["SPN 4334 FMI 2", "AdBlue DEF Doser", "BharatBenz / Tata / Leyland", "AFT 1 DEF Doser Absolute Pressure Data Erratic", "AdBlue यूरिया डोजर प्रेशर अनियमित / नोजल चोक", "HIGH", "Inspect urea line for crystallization. Perform DEF doser quantity test via scanner."],
        ["SPN 3719 FMI 16", "DPF System", "All BS6 Commercial HCV", "DPF Soot Load Level 3 - Above Normal Operating Range", "DPF साइलेंसर में कालिख (Soot) अत्यधिक जमाव", "HIGH", "Park safely on highway shoulder, engage neutral & handbrake, hold DPF switch for 3s."],
        ["SPN 3719 FMI 0", "DPF System", "All BS6 Commercial HCV", "DPF Soot Load Level 4 - Critical Engine Derate Active", "DPF साइलेंसर पूरी तरह चोक (गाड़ी 20 किमी/घंटा स्पीड लॉक)", "CRITICAL", "Do not drive. Requires stationary laptop forced regeneration or DPF core wash."],
        ["SPN 639 FMI 9", "CAN Backbone Bus", "Tata Motors / Ashok Leyland", "J1939 Network #1 Primary CAN Communication Interrupted", "मुख्य CAN वायरिंग संचार बाधित (सभी मॉड्यूल डिस्कनेक्ट)", "CRITICAL", "Turn ignition OFF. Test resistance between Pin 6 & Pin 14 of OBD port (target 60 Ohms)."],
        ["P0087", "Fuel Rail CRDI", "Bosch / Cummins / Denso", "Fuel Rail / System Pressure Too Low (Pressure Drop)", "डीजल कॉमन रेल प्रेशर कम (इंजन स्टार्ट नहीं या मिसिंग)", "CRITICAL", "Check primary & secondary fuel filters. Inspect low pressure supply line for air lock."],
        ["P20EE", "SCR Catalytic Converter", "All BS6 Commercial HCV", "SCR NOx Catalyst Conversion Efficiency Below Threshold", "SCR यूरिया कनवर्टर कार्यक्षमता कम (यूरिया मिलावटी)", "HIGH", "Test AdBlue concentration with optical refractometer. Target: 32.5% urea concentration."],
        ["SPN 789 FMI 1", "Wabco / Knorr ABS", "Multi-Axle Trailers", "Wheel Speed Sensor Front Axle Left Air Gap Too Large", "ABS व्हील स्पीड सेंसर एयर गैप अधिक / ढीला", "MEDIUM", "Push sensor head firmly against exciter ring. Wabco spring clip auto-sets correct air gap."],
        ["SPN 168 FMI 1", "Electrical Battery", "Commercial 24V Dual Battery", "Electrical Potential (Voltage) Below Normal Critical", "24V बैटरी वोल्टेज बहुत कम (अल्टरनेटर चार्ज नहीं कर रहा)", "HIGH", "Check alternator belt tension, battery terminal cleanliness, and terminal voltage under load."],
        ["SPN 110 FMI 0", "Cooling System", "All Heavy Commercial HCV", "Engine Coolant Temperature Critically High (Overheating)", "इंजन कूलेंट अत्यधिक गर्म (रेडिएटर हीटिंग)", "CRITICAL", "Stop engine immediately. Check coolant level after cooling. Inspect fan belt & radiator cap."],
    ]
    style_sheet(ws4, "HEAVY COMMERCIAL VEHICLE FAULT CODES & INSPECTION MATRIX", diag_headers, diag_rows, header_fill_blue)

    # ----------------------------------------------------
    # SHEET 5: Highway Corridors Coverage
    # ----------------------------------------------------
    ws5 = wb.create_sheet(title="Corridors Coverage")
    ws5.views.sheetView[0].showGridLines = True
    corridor_headers = [
        "Corridor Code", "Highway Name", "Terminal Route", "Distance (KM)", 
        "Key Freight Belts Covered", "Major Expressways Connected", "Mobile Vans Deployed", "Status"
    ]
    corridor_rows = [
        ["NH-44", "NH 44 (North-South Corridor)", "Srinagar to Kanyakumari", "3,745 km", "SGTN Delhi, Kundli, Karnal, Nagpur, Hyderabad, Bangalore", "KMP, KGP, Bundelkhand, Hyderabad ORR", "380+ Vans", "Active"],
        ["NH-48", "NH 48 (Golden Quadrilateral West)", "Delhi to Chennai via Mumbai", "2,807 km", "Gurugram, Jaipur, Ahmedabad, Vadodara, Bhiwandi, Pune", "Delhi-Mumbai E-Way (NE-4), Mumbai-Pune E-Way", "420+ Vans", "Active"],
        ["NH-19", "NH 19 (Historic Grand Trunk Road)", "Delhi to Kolkata", "1,435 km", "Faridabad, Mathura, Agra, Kanpur, Varanasi, Durgapur", "Yamuna E-Way, Agra-Lucknow E-Way, Purvanchal", "290+ Vans", "Active"],
        ["NH-27", "NH 27 (East-West Freight Corridor)", "Porbandar to Silchar", "3,507 km", "Rajkot, Udaipur, Kota, Jhansi, Kanpur, Muzaffarpur, Guwahati", "Chittorgarh Bypass, Lucknow Outer Ring", "260+ Vans", "Active"],
        ["NH-52", "NH 52 (Central North-South)", "Punjab to Karnataka", "2,317 km", "Hisar, Jaipur, Kota, Indore, Dhule, Aurangabad, Bijapur", "Indore Bypass, Samruddhi Mahamarg Crossing", "180+ Vans", "Active"],
        ["NE-4", "Delhi - Mumbai Expressway", "Sohna (Delhi) to JNPT (Mumbai)", "1,386 km", "Dausa, Sawai Madhopur, Kota, Ratlam, Vadodara, Virar", "High-speed 120 km/h access-controlled greenfield", "140+ Vans", "Active"],
        ["S-MM", "Samruddhi Mahamarg (NE-1)", "Mumbai to Nagpur", "701 km", "Igatpuri, Sinnar, Shirdi, Aurangabad, Jalna, Wardha", "Fast link between JNPT port & MIHAN multimodal hub", "95+ Vans", "Active"],
        ["ALE", "Agra - Lucknow & Purvanchal", "Agra to Ghazipur via Lucknow", "643 km", "Shikohabad, Etawah, Kannauj, Lucknow Transport Nagar", "Connects Western UP industrial belts to Eastern UP/Bihar", "110+ Vans", "Active"],
    ]
    style_sheet(ws5, "PAN-INDIA FREIGHT CORRIDORS & LOGISTICS HIGHWAYS", corridor_headers, corridor_rows, header_fill_orange)

    # ----------------------------------------------------
    # SHEET 6: Subscriptions & Revenue Plans
    # ----------------------------------------------------
    ws6 = wb.create_sheet(title="Revenue & Plans")
    ws6.views.sheetView[0].showGridLines = True
    sub_headers = [
        "Plan Name", "Target Partner", "Fee Structure", "Radar Priority", 
        "Verified Badge", "Emergency SOS Access", "Free Invoicing", "Support SLA"
    ]
    sub_rows = [
        ["Free Lifetime Partner", "All Indian Garages & Mobile Mechanics", "₹0 / Free Forever", "Standard GPS Distance", "Green Verified (After Check)", "Unlimited SOS Alerts", "Included", "Standard Email"],
        ["Featured Corridor Partner", "Established Highway Workshops & Tyre Centers", "₹1,499 / Month (or ₹14,999/yr)", "Top 3 Ranked in 50km Radar", "Featured Gold Badge", "Instant Priority SOS Alert", "Automated GST Invoices", "24x7 Phone Support"],
        ["Premium Heavy Hub", "Multi-bay Workshops, 50-Ton Cranes, ECM Labs", "₹3,999 / Month (or ₹39,999/yr)", "#1 Guaranteed in 100km Radar", "Crown Premium Platinum Badge", "Direct Driver SOS Dispatch", "Full CRM & Invoicing", "Dedicated Account Mgr"],
        ["Fleet Enterprise AMC", "Commercial Transporters & Fleet Operators (10+ Trucks)", "₹199 / Truck / Month", "Dedicated SOS Response Van", "Enterprise Corporate Badge", "Sub-30 Min SOS Guarantee", "Consolidated Monthly GST", "Dedicated Hotline Desk"],
    ]
    style_sheet(ws6, "GARAGE PARTNERSHIP TIERS & REVENUE SUBSCRIPTION MATRIX", sub_headers, sub_rows, header_fill_green)

    # ----------------------------------------------------
    # SHEET 7: Platform Routes & App Screens
    # ----------------------------------------------------
    ws7 = wb.create_sheet(title="Routes & App Screens")
    ws7.views.sheetView[0].showGridLines = True
    route_headers = [
        "Route / Screen Path", "Platform Target", "Target User Role", "Key Features & Capabilities", "Status"
    ]
    route_rows = [
        ["/", "Web (Next.js)", "Public / Driver / Fleet", "Homepage, Hero, Emergency SOS CTA, Radar Search, Helpline", "Live"],
        ["/nearby", "Web & Mobile", "Drivers & Operators", "GPS Distance Radar (5-100km), Verified First Sorting, Scanner/BS6 Chips", "Live"],
        ["/register", "Web & Mobile", "Garages & Mechanics", "Cascading State->District Onboarding, Category Selection, Viral Referral Code", "Live"],
        ["/emergency/new", "Web & Mobile", "Stranded Drivers", "1-Tap Breakdown SOS Dispatch, GPS Pinpoint, Truck Brand & Issue", "Live"],
        ["/emergency/[requestId]", "Web & Mobile", "Driver & Mechanic", "Real-Time Pipeline Tracking (Searching -> Accepted -> Arrived)", "Live"],
        ["/ai-diagnostic", "Web & Mobile", "Drivers & Mechanics", "AI Heavy Vehicle Diagnostic Assistant (Hindi & English SPN/FMI/Codes)", "Live"],
        ["/join", "Web", "Garages & Mechanics", "Central Free Onboarding Gateway with 7 Trade Specializations", "Live"],
        ["/garage-dashboard", "Web & Mobile", "Garage Owners", "Refer & Grow Module, Viral WhatsApp Invite, Counter QR, SOS Radar", "Live"],
        ["/garage/[id]", "Web & Mobile", "Drivers & Fleets", "Public Profile, Printable QR Modal, Direct Call (tel:), WhatsApp & Maps", "Live"],
        ["/admin", "Web & Mobile", "Platform Admins", "Growth Dashboard across 36 States/UTs, Approvals, Disputes & Logs", "Live"],
        ["/api/admin/growth", "Server API", "Admin Operations", "Pan-India Network Analytics & Aggregated Metrics API", "Live"],
        ["/india", "Web (SEO)", "National Drivers", "National Freight Corridor Overview (NH 44, NH 48, NH 19, NH 27)", "Live"],
        ["/maharashtra", "Web (SEO)", "Regional Drivers", "Bhiwandi, JNPT, Pune Chakan, Nagpur MIHAN, Samruddhi Corridor", "Live"],
        ["/mumbai", "Web (SEO)", "Regional Drivers", "Nhava Sheva Port, Kalamboli Steel Market, Thane Ghodbunder", "Live"],
        ["/delhi", "Web (SEO)", "Regional Drivers", "Sanjay Gandhi Transport Nagar (SGTN), Kundli, KMP/KGP Bypass", "Live"],
        ["/uttar-pradesh", "Web (SEO)", "Regional Drivers", "Kanpur Transport Nagar, Agra-Lucknow Expressway, Varanasi", "Live"],
        ["/about", "Web", "General Public", "Platform Mission, Golden Quadrilateral Goals, Operations Room", "Live"],
        ["/contact", "Web", "General Public", "24x7 Operations Helpline (1800-889-988), WhatsApp, Regional Hubs", "Live"],
        ["/privacy", "Web", "Statutory Compliance", "DPDPA 2023 & IT Act 2000 Privacy Policy, Strict Document Privacy", "Live"],
        ["/terms", "Web", "Statutory Compliance", "Terms and Conditions of Use for Highway Roadside Assistance", "Live"],
        ["/refund-policy", "Web", "Statutory Compliance", "Subscription Refund and Dispute Resolution Guidelines", "Live"],
        ["/disclaimer", "Web", "Statutory Compliance", "Road Safety Mandatory Rules, Warning Triangles, AI Advisory", "Live"],
        ["flutter_app/ (Native)", "Android Mobile", "Drivers & Garages", "Native Flutter Android APK/Bundle with GPS, Camera & Calling", "Built"],
    ]
    style_sheet(ws7, "FULL WEB ROUTES & MOBILE APPLICATION SCREENS INVENTORY", route_headers, route_rows, header_fill_dark)

    # ----------------------------------------------------
    # SHEET 8: Pan-India 36 States & Union Territories (Phase 11)
    # ----------------------------------------------------
    ws8 = wb.create_sheet(title="36 States & UTs Hierarchy")
    ws8.views.sheetView[0].showGridLines = True
    geo_headers = [
        "State / UT Name", "Code", "Type", "Major Commercial Freight Hubs", 
        "Primary Expressways & Corridors", "Districts Covered", "Network Status"
    ]
    geo_rows = [
        # 28 States
        ["Andhra Pradesh", "AP", "State", "Vijayawada, Visakhapatnam, Tirupati, Guntur, Kurnool", "NH 16, NH 44, Chennai-Kolkata Corridor", 26, "Active Coverage"],
        ["Arunachal Pradesh", "AR", "State", "Itanagar, Pasighat, Bhalukpong, Naharlagun", "NH 415, Trans-Arunachal Highway", 25, "Active Coverage"],
        ["Assam", "AS", "State", "Guwahati (Beltola), Silchar, Dibrugarh, Bongaigaon", "NH 27 (East-West Corridor), NH 37", 35, "Active Coverage"],
        ["Bihar", "BR", "State", "Patna, Muzaffarpur, Gaya, Bhagalpur, Begusarai", "NH 19 (GT Road), NH 27, Purvanchal E-way Link", 38, "Active Coverage"],
        ["Chhattisgarh", "CG", "State", "Raipur, Bilaspur, Durg-Bhilai, Korba Mining Belt", "NH 53 (Mumbai-Kolkata), NH 30", 33, "Active Coverage"],
        ["Goa", "GA", "State", "Panaji, Margao, Vasco da Gama, Mapusa", "NH 66 (Mumbai-Goa-Kochi Coastal Corridor)", 2, "Active Coverage"],
        ["Gujarat", "GJ", "State", "Ahmedabad, Surat, Vadodara, Rajkot, Gandhidham, Mundra Port", "NH 48, NE-1 (Vadodara E-Way), Delhi-Mumbai E-Way", 33, "Active Coverage"],
        ["Haryana", "HR", "State", "Gurugram, Faridabad, Panipat, Ambala, Kundli (KMP)", "NH 44, NH 48, KMP & KGP Western Peripheral", 22, "Active Coverage"],
        ["Himachal Pradesh", "HP", "State", "Baddi Industrial Belt, Solan, Shimla, Kala Amb, Una", "NH 5, NH 21, Chandigarh-Manali Highway", 12, "Active Coverage"],
        ["Jharkhand", "JH", "State", "Ranchi, Jamshedpur Steel Hub, Dhanbad Coal Corridor", "NH 19 (GT Road), NH 33, NH 20", 24, "Active Coverage"],
        ["Karnataka", "KA", "State", "Bengaluru (Nelamangala), Hubballi, Belagavi, Mangaluru Port", "NH 48, NH 44, Bengaluru-Mysuru Expressway", 31, "Active Coverage"],
        ["Kerala", "KL", "State", "Kochi Port, Thiruvananthapuram, Kozhikode, Palakkad", "NH 66, NH 544 (Salem-Kochi Highway)", 14, "Active Coverage"],
        ["Madhya Pradesh", "MP", "State", "Indore-Pithampur Auto Hub, Bhopal, Gwalior, Jabalpur", "NH 44, NH 52, Delhi-Mumbai E-Way (NE-4)", 52, "Active Coverage"],
        ["Maharashtra", "MH", "State", "Bhiwandi, JNPT Port, Pune-Chakan, Nagpur MIHAN, Dhule", "NH 48, NH 52, Samruddhi Mahamarg (NE-1), Mumbai-Pune", 36, "Active Coverage"],
        ["Manipur", "MN", "State", "Imphal, Moreh Indo-Myanmar Border, Churachandpur", "NH 2, Asian Highway AH-1", 16, "Active Coverage"],
        ["Meghalaya", "ML", "State", "Shillong, Byrnihat Industrial Belt, Tura, Jowai", "NH 6 (Guwahati-Shillong-Silchar)", 12, "Active Coverage"],
        ["Mizoram", "MZ", "State", "Aizawl, Lunglei, Champhai, Kolasib", "NH 306, Kaladan Multi-Modal Project", 11, "Active Coverage"],
        ["Nagaland", "NL", "State", "Dimapur Freight Railway Hub, Kohima, Mokokchung", "NH 29, Dimapur Bypass Corridor", 16, "Active Coverage"],
        ["Odisha", "OD", "State", "Bhubaneswar, Cuttack, Paradeep Port, Rourkela, Jharsuguda", "NH 16, Biju Expressway, Mineral Freight Corridors", 30, "Active Coverage"],
        ["Punjab", "PB", "State", "Ludhiana Transport Hub, Amritsar, Jalandhar, Bathinda", "NH 44, Delhi-Amritsar-Katra Expressway", 23, "Active Coverage"],
        ["Rajasthan", "RJ", "State", "Jaipur, Jodhpur, Kota, Udaipur, Bhiwadi, Alwar, Bhilwara", "NH 48, Delhi-Mumbai E-Way (NE-4), Amritsar-Jamnagar", 50, "Active Coverage"],
        ["Sikkim", "SK", "State", "Gangtok, Rangpo Entry Hub, Singtam, Jorethang", "NH 10 (Siliguri-Gangtok Highway)", 6, "Active Coverage"],
        ["Tamil Nadu", "TN", "State", "Chennai Port, Coimbatore Auto Hub, Namakkal Truck Capital, Salem", "NH 44, NH 48, Chennai Outer Ring Road", 38, "Active Coverage"],
        ["Telangana", "TS", "State", "Hyderabad Outer Ring Road (ORR), Warangal, Nizamabad", "NH 44, NH 65 (Hyderabad-Vijayawada)", 33, "Active Coverage"],
        ["Tripura", "TR", "State", "Agartala, Dharmanagar Rail Hub, Udaipur, Ambassa", "NH 8 (Tripura Lifeline Corridor)", 8, "Active Coverage"],
        ["Uttar Pradesh", "UP", "State", "Kanpur Transport Nagar, Agra, Varanasi, Lucknow, Ghaziabad", "NH 19, Yamuna E-Way, Agra-Lucknow, Purvanchal E-Way", 75, "Active Coverage"],
        ["Uttarakhand", "UK", "State", "Dehradun, Haridwar-SIDCUL, Rudrapur-Pantnagar Auto Belt", "NH 7, All-Weather Chardham Highway", 13, "Active Coverage"],
        ["West Bengal", "WB", "State", "Kolkata (Dankuni), Durgapur, Siliguri Gateway, Kharagpur", "NH 19 (GT Road), NH 16, NH 27 Corridor", 23, "Active Coverage"],
        # 8 Union Territories
        ["Andaman and Nicobar Islands", "AN", "UT", "Port Blair, Haddo Wharf Maritime Terminal", "Great Andaman Trunk Road (NH 4)", 3, "Active Coverage"],
        ["Chandigarh", "CH", "UT", "Chandigarh Transport Area, Industrial Area Phase 1 & 2", "NH 5, Himalayan Expressway Link", 1, "Active Coverage"],
        ["Dadra and Nagar Haveli and Daman and Diu", "DN", "UT", "Silvassa Industrial Zone, Daman Coastal Freight", "NH 48 Industrial Arterial Link", 3, "Active Coverage"],
        ["Delhi NCR", "DL", "UT", "Sanjay Gandhi Transport Nagar (SGTN), Azadpur, Okhla", "NH 44, NH 48, NH 9, DND Flyway, Urban Extension-II", 11, "Active Coverage"],
        ["Jammu and Kashmir", "JK", "UT", "Jammu (Narwal Yard), Srinagar (Parimpora), Udhampur", "NH 44 (Kashmir Valley Lifeline)", 20, "Active Coverage"],
        ["Ladakh", "LA", "UT", "Leh Logistics Point, Kargil, Drass Strategic Corridor", "NH 1 (Srinagar-Leh), Leh-Manali Highway", 2, "Active Coverage"],
        ["Lakshadweep", "LD", "UT", "Kavaratti Port, Agatti Island Hub", "Island Coastal Maritime Link", 1, "Active Coverage"],
        ["Puducherry", "PY", "UT", "Puducherry Port, Karaikal Deepwater Port", "East Coast Road (ECR), NH 332", 4, "Active Coverage"]
    ]
    style_sheet(ws8, "ALL 36 INDIAN STATES & UNION TERRITORIES GEOGRAPHIC COVERAGE", geo_headers, geo_rows, header_fill_cyan)

    # ----------------------------------------------------
    # SHEET 9: Growth & Viral Referral Engine (Phase 11)
    # ----------------------------------------------------
    ws9 = wb.create_sheet(title="Growth & Referrals")
    ws9.views.sheetView[0].showGridLines = True
    growth_headers = [
        "Feature / Engine Spec", "Implementation Architecture", "Anti-Fraud Safeguard", 
        "Partner Incentive", "Target Highway Route", "Production Status"
    ]
    growth_rows = [
        ["Standardized Referral Code", "TRI-{STATE_CODE}-{RANDOM_4_ALPHANUM} e.g. TRI-MH-8291", "Regex format check, unique Firestore index", "Official referral attribution & tracking", "All 36 States & UTs", "Active"],
        ["Viral WhatsApp Share", "1-Tap wa.me link with pre-filled Hindi+English invite", "URL sanitization, dynamic code injection", "Automatic network growth for workshop", "National Freight Corridors", "Active"],
        ["Shop Counter QR Code", "240px printable/downloadable QR code linking to garage profile", "Direct canonical link, SSL-encrypted target", "Drivers scan & call without manual typing", "All Workshop Counters & Vans", "Active"],
        ["Self-Referral Prevention", "Strict phone & Firebase UID equality validation", "Blocks duplicate phone / same account referrals", "Prevents false gaming of referral rewards", "Global Platform Rule", "Active"],
        ["30-Day Featured Boost Reward", "Awarded upon 2 verified referee garage registrations", "Manual/automated admin verification check", "Top 3 placement in 50km geospatial radar", "All Registered Garages", "Active"],
        ["Provider Category Support", "Workshop, Mobile Van, Individual Mechanic, Towing, Spares", "Validated enum on register & update", "Specialized category badge on public profile", "All 36 States & UTs", "Active"],
        ["Verified-First Discovery", "Geospatial search sorts verified garages ahead of unverified", "verificationStatus === 'verified' rank boost", "Drivers get trusted, authenticated mechanics first", "Nearby Search Page (/nearby)", "Active"],
        ["Specialist Quick Filters", "Dedicated chips: Scanner/OBD, Truck Electrician, BS6 Expert", "Instant client/server service filtering", "Drivers quickly find exact emergency capability", "Nearby Search Page (/nearby)", "Active"],
        ["Confidential Document Guard", "Aadhaar, GST & Trade docs strictly excluded from public API", "Server-only collection & strict Firestore rules", "100% Owner Privacy & DPDPA compliance", "Platform-Wide Security", "Active"],
    ]
    style_sheet(ws9, "VIRAL GROWTH ENGINE, REFERRALS & ANTI-FRAUD SPECIFICATIONS", growth_headers, growth_rows, header_fill_orange)

    # Save to project folder
    output_path = "TRUCK_RESCUE_INDIA_PLATFORM_MASTER.xlsx"
    wb.save(output_path)
    print(f"Excel workbook created successfully at: {os.path.abspath(output_path)}")

    # Also save a copy on Desktop if Desktop exists
    desktop_path = os.path.expanduser(r"~\Desktop")
    if os.path.exists(desktop_path):
        desktop_file = os.path.join(desktop_path, "TRUCK_RESCUE_INDIA_PLATFORM_MASTER.xlsx")
        wb.save(desktop_file)
        print(f"Excel workbook also copied to Desktop: {desktop_file}")

if __name__ == "__main__":
    create_truck_rescue_excel()
