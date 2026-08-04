import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def create_attendance_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    story = []
    styles = getSampleStyleSheet()

    # Custom Palette - Don Guto Warm Coffee Branding
    DARK_BROWN = colors.HexColor('#2C1810')
    GOLD_ACCENT = colors.HexColor('#C69214')
    WARM_BG = colors.HexColor('#FDFBF7')
    TABLE_HEADER = colors.HexColor('#3D2314')
    ROW_EVEN = colors.HexColor('#FFFFFF')
    ROW_ODD = colors.HexColor('#F8F4EE')
    TEXT_DARK = colors.HexColor('#1F140E')
    BORDER_COLOR = colors.HexColor('#E2D7C7')
    SUCCESS_COLOR = colors.HexColor('#15803D')
    WARN_COLOR = colors.HexColor('#B45309')

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=DARK_BROWN,
        alignment=TA_LEFT
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=GOLD_ACCENT,
        alignment=TA_LEFT
    )

    normal_style = ParagraphStyle(
        'NormalText',
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=TEXT_DARK
    )

    bold_label = ParagraphStyle(
        'BoldLabel',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=DARK_BROWN
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white,
        alignment=TA_CENTER
    )

    table_cell_center = ParagraphStyle(
        'CellCenter',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=TEXT_DARK,
        alignment=TA_CENTER
    )

    table_cell_bold_center = ParagraphStyle(
        'CellBoldCenter',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=DARK_BROWN,
        alignment=TA_CENTER
    )

    badge_success = ParagraphStyle(
        'BadgeSuccess',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=SUCCESS_COLOR,
        alignment=TA_CENTER
    )

    badge_warn = ParagraphStyle(
        'BadgeWarn',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=WARN_COLOR,
        alignment=TA_CENTER
    )

    # 1. HEADER SECTION
    header_data = [
        [
            Paragraph("DON GUTO COFFEE COMPANY", title_style),
            Paragraph("REPORTE OFICIAL DE ASISTENCIA<br/><font color='#C69214'><b>MES DE JULIO 2026</b></font>", ParagraphStyle('HRight', parent=subtitle_style, alignment=TA_RIGHT, fontSize=12, leading=15))
        ]
    ]
    header_table = Table(header_data, colWidths=[300, 240])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))

    story.append(HRFlowable(width="100%", thickness=2.5, color=GOLD_ACCENT, spaceAfter=12, spaceBefore=2))

    # 2. PERSONAL METADATA & SUMMARY BOX
    meta_content = [
        [
            Paragraph("<b>Colaborador:</b> Ariana Olivos", normal_style),
            Paragraph("<b>Días Laborados:</b> 15 Días", normal_style),
        ],
        [
            Paragraph("<b>ID Biométrico:</b> 147242", normal_style),
            Paragraph("<b>Total Marcajes:</b> 29 Perforaciones", normal_style),
        ],
        [
            Paragraph("<b>Cargo / Rol:</b> Servicio / Auditoría", normal_style),
            Paragraph("<b>Rango de Fechas:</b> 01/07/2026 al 31/07/2026", normal_style),
        ],
        [
            Paragraph("<b>Sede:</b> 28 de Julio Miraflores / Multitienda", normal_style),
            Paragraph("<b>Estado General:</b> <font color='#15803D'><b>Conforme / Verificado</b></font>", normal_style),
        ]
    ]

    meta_table = Table(meta_content, colWidths=[270, 270])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), ROW_ODD),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # 3. DETAILED TABLE HEADER
    story.append(Paragraph("<b>DETALLE DIARIO DE MARCAJES BIOMÉTRICOS</b>", subtitle_style))
    story.append(Spacer(1, 6))

    table_data = [
        [
            Paragraph("#", table_header_style),
            Paragraph("Día", table_header_style),
            Paragraph("Fecha", table_header_style),
            Paragraph("Hora Entrada", table_header_style),
            Paragraph("Hora Salida", table_header_style),
            Paragraph("Perforaciones", table_header_style),
            Paragraph("Estado", table_header_style)
        ]
    ]

    raw_rows = [
        ("01", "Miércoles", "01/07/2026", "05:44 PM (17:44)", "11:06 PM (23:06)", "2", "Completo", True),
        ("02", "Jueves", "02/07/2026", "02:32 PM (14:32)", "10:28 PM (22:28)", "2", "Completo", True),
        ("03", "Sábado", "04/07/2026", "02:35 PM (14:35)", "10:30 PM (22:30)", "2", "Completo", True),
        ("04", "Miércoles", "08/07/2026", "02:34 PM (14:34)", "10:17 PM (22:17)", "2", "Completo", True),
        ("05", "Jueves", "09/07/2026", "--", "10:17 PM (22:17)", "1", "Salida Única", False),
        ("06", "Viernes", "10/07/2026", "02:30 PM (14:30)", "10:30 PM (22:30)", "2", "Completo", True),
        ("07", "Miércoles", "15/07/2026", "02:25 PM (14:25)", "10:56 PM (22:56)", "2", "Completo", True),
        ("08", "Jueves", "16/07/2026", "02:35 PM (14:35)", "11:06 PM (23:06)", "2", "Completo", True),
        ("09", "Viernes", "17/07/2026", "02:35 PM (14:35)", "10:45 PM (22:45)", "2", "Completo", True),
        ("10", "Miércoles", "22/07/2026", "02:31 PM (14:31)", "10:11 PM (22:11)", "2", "Completo", True),
        ("11", "Jueves", "23/07/2026", "02:27 PM (14:27)", "10:17 PM (22:17)", "2", "Completo", True),
        ("12", "Viernes", "24/07/2026", "05:48 PM (17:48)", "10:30 PM (22:30)", "2", "Completo", True),
        ("13", "Miércoles", "29/07/2026", "02:32 PM (14:32)", "10:55 PM (22:55)", "2", "Completo", True),
        ("14", "Jueves", "30/07/2026", "02:34 PM (14:34)", "10:28 PM (22:28)", "2", "Completo", True),
        ("15", "Viernes", "31/07/2026", "02:27 PM (14:27)", "11:00 PM (23:00)", "2", "Completo", True),
    ]

    for item in raw_rows:
        num, dia, fecha, entrada, salida, perf, estado, is_ok = item
        status_p = Paragraph(f"<b>{estado}</b>", badge_success if is_ok else badge_warn)
        table_data.append([
            Paragraph(num, table_cell_center),
            Paragraph(dia, table_cell_center),
            Paragraph(fecha, table_cell_bold_center),
            Paragraph(entrada, table_cell_center),
            Paragraph(salida, table_cell_center),
            Paragraph(perf, table_cell_bold_center),
            status_p
        ])

    att_table = Table(table_data, colWidths=[25, 65, 70, 110, 110, 70, 90])
    
    table_styles = [
        ('BACKGROUND', (0,0), (-1,0), TABLE_HEADER),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('PADDING', (0,0), (-1,-1), 5),
    ]

    for i in range(1, len(table_data)):
        bg = ROW_EVEN if i % 2 != 0 else ROW_ODD
        table_styles.append(('BACKGROUND', (0, i), (-1, i), bg))

    att_table.setStyle(TableStyle(table_styles))
    story.append(att_table)
    story.append(Spacer(1, 16))

    # 4. FOOTER & SIGNATURE SECTION
    footer_data = [
        [
            Paragraph("<b>Emitido por:</b> Intranet Operativa Don Guto Coffee", normal_style),
            Paragraph("<b>Firma Auditoría / Operaciones:</b>", normal_style)
        ],
        [
            Paragraph("<b>Fecha de Impresión:</b> 04 de Agosto de 2026", normal_style),
            Paragraph("__________________________________________", normal_style)
        ]
    ]

    footer_table = Table(footer_data, colWidths=[300, 240])
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    
    story.append(KeepTogether([
        HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=10, spaceBefore=4),
        footer_table
    ]))

    doc.build(story)
    print(f"PDF successfully created: {filename}")

if __name__ == '__main__':
    desktop_pdf = r"c:\Users\mario\Desktop\DON GUTO OPERATIVO\Reporte_Asistencia_Ariana_Olivos_Julio_2026.pdf"
    artifact_pdf = r"C:\Users\mario\.gemini\antigravity\brain\41e04aa0-e8b3-4aba-8d83-726a74598423\Reporte_Asistencia_Ariana_Olivos_Julio_2026.pdf"
    
    create_attendance_pdf(desktop_pdf)
    create_attendance_pdf(artifact_pdf)
