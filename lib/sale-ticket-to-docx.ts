"use client";

import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    TextRun,
    ImageRun,
    Header,
    Footer,
    AlignmentType,
    BorderStyle,
    WidthType,
    ShadingType,
    convertMillimetersToTwip,
    type FileChild,
} from "docx";
import type { SaleResponse } from "@/lib/api/sale-ticket";

export interface CashReceiptDocLabels {
    title: string;
    label_date: string;
    label_customer: string;
    label_ticket_id: string;
    label_subtotal: string;
    discount: string;
    total_payable: string;
    header_hash: string;
    header_desc: string;
    header_unit: string;
    header_price: string;
    header_qty: string;
    header_discount: string;
    header_total: string;
    guest_customer: string;
    getUnitLabel: (unitType: string) => string;
}

export interface CashReceiptDocOptions {
    /** When true, paragraphs and table use RTL (for Arabic/Kurdish). */
    rtl?: boolean;
    /** Optional header image (e.g. from settings.headerA4). Caller should pass ArrayBuffer or use data URL. */
    headerImageData?: { data: ArrayBuffer; type: "png" | "jpg" | "gif" | "bmp" };
    /** Optional footer image (e.g. from settings.footerA4). */
    footerImageData?: { data: ArrayBuffer; type: "png" | "jpg" | "gif" | "bmp" };
}

const BORDER = {
    top: { style: BorderStyle.SINGLE, size: 1 },
    bottom: { style: BorderStyle.SINGLE, size: 1 },
    left: { style: BorderStyle.SINGLE, size: 1 },
    right: { style: BorderStyle.SINGLE, size: 1 },
};

/** A4 content width in pixels so header/footer images span full width. */
const FULL_CONTENT_WIDTH_PX = 650;

/** Small page margins (mm) so the document doesn't have too much margin. */
const PAGE_MARGIN_MM = 10;
const HEADER_FOOTER_MARGIN_MM = 5;

function cell(
    text: string,
    opts?: { bold?: boolean; shading?: { fill: string }; alignment?: (typeof AlignmentType)[keyof typeof AlignmentType] }
): TableCell {
    const align = opts?.alignment;
    return new TableCell({
        children: [
            new Paragraph({
                children: [new TextRun({ text, bold: opts?.bold ?? false })],
                alignment: align,
            }),
        ],
        borders: BORDER,
        shading: opts?.shading ? { fill: opts.shading.fill, type: ShadingType.CLEAR } : undefined,
    });
}

/**
 * Builds a Word document that matches the PrintCash (A4) receipt layout.
 * Supports RTL (Arabic/Kurdish), optional header image, and per-item discount column.
 */
export async function buildCashReceiptDoc(
    data: SaleResponse,
    labels: CashReceiptDocLabels,
    options: CashReceiptDocOptions = {}
): Promise<Blob> {
    const { receipt, items, customer } = data;
    const { rtl = false, headerImageData, footerImageData } = options;
    const finalAmount = receipt.final_amount;
    const discountTotal = receipt.discount_value || 0;
    const subtotal = finalAmount + discountTotal;

    const alignNum = rtl ? AlignmentType.LEFT : AlignmentType.RIGHT;
    const alignEnd = rtl ? AlignmentType.LEFT : AlignmentType.RIGHT;

    const headerShading = { fill: "E8EEF4" };

    const headerRow = new TableRow({
        children: [
            cell(labels.header_hash, { bold: true, shading: headerShading }),
            cell(labels.header_desc, { bold: true, shading: headerShading }),
            cell(labels.header_unit, { bold: true, shading: headerShading }),
            cell(labels.header_price, { bold: true, shading: headerShading, alignment: alignNum }),
            cell(labels.header_qty, { bold: true, shading: headerShading, alignment: alignNum }),
            cell(labels.header_discount, { bold: true, shading: headerShading, alignment: alignNum }),
            cell(labels.header_total, { bold: true, shading: headerShading, alignment: alignNum }),
        ],
    });

    const itemRows = items.map((item, idx) =>
        new TableRow({
            children: [
                cell(String(idx + 1)),
                cell(item.item_name),
                cell(labels.getUnitLabel(item.unit_type)),
                cell(item.price.toLocaleString(), { alignment: alignNum }),
                cell(String(item.quantity), { alignment: alignNum }),
                cell((item.discount_value ?? 0) > 0 ? `-${(item.discount_value ?? 0).toLocaleString()}` : "0", { alignment: alignNum }),
                cell(item.subtotal.toLocaleString(), { bold: true, alignment: alignNum }),
            ],
        })
    );

    const bodyChildren: FileChild[] = [];

    let docHeader: Header | undefined;
    if (headerImageData?.data?.byteLength) {
        try {
            const run = new ImageRun({
                type: headerImageData.type,
                data: headerImageData.data,
                transformation: { width: FULL_CONTENT_WIDTH_PX, height: 120 },
            });
            docHeader = new Header({
                children: [
                    new Paragraph({
                        children: [run],
                        alignment: AlignmentType.CENTER,
                    }),
                ],
            });
        } catch {
            // ignore image errors
        }
    }

    let docFooter: Footer | undefined;
    if (footerImageData?.data?.byteLength) {
        try {
            const run = new ImageRun({
                type: footerImageData.type,
                data: footerImageData.data,
                transformation: { width: FULL_CONTENT_WIDTH_PX, height: 100 },
            });
            docFooter = new Footer({
                children: [
                    new Paragraph({
                        children: [run],
                        alignment: AlignmentType.CENTER,
                    }),
                ],
            });
        } catch {
            // ignore image errors
        }
    }

    const marginTwip = (mm: number) => convertMillimetersToTwip(mm);

    bodyChildren.push(
        new Paragraph({
            children: [new TextRun({ text: `${labels.title} #${receipt.id}`, bold: true, size: 36 })],
            spacing: { after: 240 },
            bidirectional: rtl,
        }),
        new Paragraph({
            children: [
                new TextRun({ text: `${labels.label_date}: ` }),
                new TextRun({ text: new Date().toLocaleString(), bold: true }),
            ],
            spacing: { after: 160 },
            bidirectional: rtl,
        }),
        new Paragraph({
            children: [
                new TextRun({ text: `${labels.label_customer}: ` }),
                new TextRun({ text: customer?.name || labels.guest_customer, bold: true }),
            ],
            spacing: { after: 80 },
            bidirectional: rtl,
        }),
        new Paragraph({
            children: [
                new TextRun({ text: `${labels.label_ticket_id}: ` }),
                new TextRun({ text: `#${receipt.id}`, bold: true }),
            ],
            spacing: { after: 320 },
            bidirectional: rtl,
        }),
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: BORDER,
            visuallyRightToLeft: rtl,
            rows: [headerRow, ...itemRows],
        }),
        new Paragraph({ text: "", spacing: { after: 240 } }),
        new Paragraph({
            children: [
                new TextRun({ text: `${labels.label_subtotal}: `, bold: true }),
                new TextRun({ text: subtotal.toLocaleString() }),
            ],
            alignment: alignEnd,
            spacing: { after: 80 },
            bidirectional: rtl,
        })
    );

    if (discountTotal > 0) {
        bodyChildren.push(
            new Paragraph({
                children: [
                    new TextRun({ text: `${labels.discount}: `, bold: true }),
                    new TextRun({ text: `- ${discountTotal.toLocaleString()}` }),
                ],
                alignment: alignEnd,
                spacing: { after: 80 },
                bidirectional: rtl,
            })
        );
    }

    bodyChildren.push(
        new Paragraph({
            children: [
                new TextRun({ text: `${labels.total_payable}: `, bold: true }),
                new TextRun({ text: finalAmount.toLocaleString(), bold: true, size: 30 }),
            ],
            alignment: alignEnd,
            spacing: { before: 200, after: 400 },
            bidirectional: rtl,
        })
    );

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: marginTwip(PAGE_MARGIN_MM),
                            right: marginTwip(PAGE_MARGIN_MM),
                            bottom: marginTwip(PAGE_MARGIN_MM),
                            left: marginTwip(PAGE_MARGIN_MM),
                            header: marginTwip(HEADER_FOOTER_MARGIN_MM),
                            footer: marginTwip(HEADER_FOOTER_MARGIN_MM),
                            gutter: 0,
                        },
                    },
                },
                headers: docHeader ? { default: docHeader } : undefined,
                footers: docFooter ? { default: docFooter } : undefined,
                children: bodyChildren,
            },
        ],
    });

    return Packer.toBlob(doc);
}

/**
 * Builds the Word document and triggers a download in the browser.
 */
export async function downloadCashAsWord(
    data: SaleResponse,
    labels: CashReceiptDocLabels,
    options: CashReceiptDocOptions & { filename?: string } = {}
): Promise<void> {
    const { filename, ...docOptions } = options;
    const blob = await buildCashReceiptDoc(data, labels, docOptions);
    const name = filename || `sale-ticket-${data.receipt.id}-${Date.now()}.docx`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
