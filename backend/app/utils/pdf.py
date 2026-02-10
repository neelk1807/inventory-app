from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO
from datetime import datetime


def generate_invoice(order, items, user):
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=30,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "Title",
        fontSize=18,
        spaceAfter=10,
        textColor=colors.black,
        alignment=0,
    )

    normal = styles["Normal"]
    bold = ParagraphStyle("Bold", parent=normal, fontName="Helvetica-Bold")

    elements = []

    # Header
    elements.append(Paragraph("<b>Your Company Name</b>", title_style))
    elements.append(Paragraph("Inventory Management System", normal))
    elements.append(Spacer(1, 10))

    # Invoice info
    elements.append(Paragraph(f"<b>Invoice #:</b> {order.id}", normal))
    elements.append(
        Paragraph(
            f"<b>Date:</b> {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            normal,
        )
    )
    elements.append(Paragraph(f"<b>User:</b> {user.username}", normal))
    elements.append(Spacer(1, 20))

    # Table data
    table_data = [
        ["Product", "Qty", "Unit Price", "Total"]
    ]

    grand_total = 0

    for item in items:
        line_total = item.quantity * item.price
        grand_total += line_total

        table_data.append(
            [
                item.product.name,
                str(item.quantity),
                f"${item.price:.2f}",
                f"${line_total:.2f}",
            ]
        )

    # Total row
    table_data.append(["", "", "Grand Total", f"${grand_total:.2f}"])

    table = Table(table_data, colWidths=[200, 60, 100, 100])

    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.black),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                ("ALIGN", (1, 1), (-1, -1), "CENTER"),
                ("BACKGROUND", (0, 1), (-1, -2), colors.whitesmoke),
                ("FONTNAME", (-2, -1), (-1, -1), "Helvetica-Bold"),
                ("BACKGROUND", (-2, -1), (-1, -1), colors.lightgrey),
            ]
        )
    )

    elements.append(table)
    elements.append(Spacer(1, 30))

    # Footer
    elements.append(
        Paragraph(
            "Thank you for your business!",
            ParagraphStyle(
                "Footer",
                fontSize=10,
                alignment=1,
                textColor=colors.grey,
            ),
        )
    )

    doc.build(elements)
    buffer.seek(0)
    return buffer
