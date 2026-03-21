from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PNG_PATH = OUTPUT_DIR / "shenzhen_e_invoice_guide_optimized.png"
PDF_PATH = OUTPUT_DIR / "shenzhen_e_invoice_guide_optimized.pdf"

WIDTH, HEIGHT = 1240, 1754  # A4 portrait at roughly 150 DPI
MARGIN = 84

FONT_PATH = "/System/Library/Fonts/Hiragino Sans GB.ttc"


def load_font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_PATH, size=size)


TITLE_FONT = load_font(56)
SUBTITLE_FONT = load_font(24)
SECTION_FONT = load_font(28)
BODY_FONT = load_font(24)
SMALL_FONT = load_font(20)
STEP_NUM_FONT = load_font(28)
STEP_TITLE_FONT = load_font(27)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font, max_width: int):
    lines = []
    current = ""
    for ch in text:
        probe = current + ch
        if draw.textbbox((0, 0), probe, font=font)[2] <= max_width:
            current = probe
        else:
            if current:
                lines.append(current)
            current = ch
    if current:
        lines.append(current)
    return lines


def draw_paragraph(draw, text, x, y, font, fill, max_width, line_gap=12):
    lines = wrap_text(draw, text, font, max_width)
    line_height = draw.textbbox((0, 0), "测试", font=font)[3] + line_gap
    for line in lines:
        draw.text((x, y), line, font=font, fill=fill)
        y += line_height
    return y


def rounded_box(draw, box, fill, outline=None, radius=28, width=2):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def main():
    image = Image.new("RGB", (WIDTH, HEIGHT), "#F6F7FB")
    draw = ImageDraw.Draw(image)

    # Background accents
    draw.ellipse((WIDTH - 340, -120, WIDTH + 120, 260), fill="#E6F4FF")
    draw.ellipse((-180, HEIGHT - 340, 220, HEIGHT + 100), fill="#EAF6EC")

    # Header
    rounded_box(draw, (MARGIN, 54, WIDTH - MARGIN, 270), fill="#0F172A", radius=40)
    draw.text((MARGIN + 42, 88), "自然人在线开具电子发票", font=TITLE_FONT, fill="#FFFFFF")
    draw.text((MARGIN + 44, 162), "深圳税务微信端简版操作指引", font=SUBTITLE_FONT, fill="#C7D2FE")
    draw.text((WIDTH - 330, 90), "优化版", font=SUBTITLE_FONT, fill="#93C5FD")
    draw.text((WIDTH - 330, 130), "更短 · 更清楚 · 更好找", font=SMALL_FONT, fill="#BFDBFE")

    # Preparation box
    prep_top = 318
    rounded_box(draw, (MARGIN, prep_top, WIDTH - MARGIN, prep_top + 190), fill="#FFFFFF", outline="#DCE3F0", radius=32)
    draw.text((MARGIN + 34, prep_top + 26), "提前准备", font=SECTION_FONT, fill="#0F172A")
    prep_items = [
        "1. 本人实名认证微信账号",
        "2. 购买方公司名称和税号",
        "3. 开票项目名称、金额和服务内容",
    ]
    y = prep_top + 76
    for item in prep_items:
        draw.text((MARGIN + 36, y), item, font=BODY_FONT, fill="#334155")
        y += 36

    # Steps
    steps = [
        ("进入入口", "关注“深圳税务”微信订阅号，打开【我要办】并进入【@深税】。"),
        ("完成登录", "以“个人”身份完成实名认证并登录系统。"),
        ("进入开票模块", "在【发票】模块中选择【自然人代开发票】。"),
        ("新增申请", "进入“待申请”页面后点【新增】，领取方式选“线上开具（电子发票）”。"),
        ("填写信息", "销方填写自然人本人信息，购买方填写公司信息，再补充货物或服务信息。"),
        ("提交并下载", "核对系统自动计算的税款，点击【确定】和【提交】；开具成功后到“已办结”中查看或下载 PDF。"),
    ]

    step_top = 548
    card_height = 146
    gap = 20
    for idx, (title, desc) in enumerate(steps, start=1):
        top = step_top + (idx - 1) * (card_height + gap)
        rounded_box(draw, (MARGIN, top, WIDTH - MARGIN, top + card_height), fill="#FFFFFF", outline="#DCE3F0", radius=30)
        draw.rounded_rectangle((MARGIN + 24, top + 24, MARGIN + 108, top + 108), radius=24, fill="#DBEAFE")
        num_w = draw.textbbox((0, 0), str(idx), font=STEP_NUM_FONT)[2]
        draw.text((MARGIN + 66 - num_w / 2, top + 46), str(idx), font=STEP_NUM_FONT, fill="#1D4ED8")
        draw.text((MARGIN + 136, top + 28), title, font=STEP_TITLE_FONT, fill="#0F172A")
        draw_paragraph(
            draw,
            desc,
            MARGIN + 136,
            top + 68,
            BODY_FONT,
            "#475569",
            WIDTH - MARGIN - 170,
            line_gap=8,
        )

    # Tips
    tip_top = 1480
    rounded_box(draw, (MARGIN, tip_top, WIDTH - MARGIN, HEIGHT - 84), fill="#EEF6FF", outline="#BFDBFE", radius=32)
    draw.text((MARGIN + 34, tip_top + 24), "注意事项", font=SECTION_FONT, fill="#0F172A")
    tips = [
        "购买方名称、税号、金额要先核对，避免重填。",
        "系统会自动算税，提交前重点看金额和税款是否正确。",
        "开具完成后，记得在“已办结”页面下载 PDF 留存。",
    ]
    y = tip_top + 76
    for tip in tips:
        draw.text((MARGIN + 36, y), "• " + tip, font=BODY_FONT, fill="#334155")
        y += 40

    image.save(PNG_PATH)
    image.save(PDF_PATH, "PDF", resolution=150.0)

    print(PNG_PATH)
    print(PDF_PATH)


if __name__ == "__main__":
    main()
