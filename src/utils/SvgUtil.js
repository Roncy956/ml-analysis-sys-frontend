/**
 * 增强版 SVG 处理函数：移除所有硬编码颜色，强制所有图形元素使用 currentColor
 * @param {string} svgString 原始 SVG 内容
 * @param {string} className Tailwind 尺寸类，如 "h-7 w-5"
 * @returns {string} 处理后的 SVG 字符串
 */
export const processSvg = (svgString, className = "h-7 w-5") => {
    // 1. 移除 XML 声明（如有）
    let cleaned = svgString.replace(/^<\?xml.*?\?>/, "");

    // 2. 处理 <svg> 根元素：添加 class 和 fill="currentColor"，移除原有宽高和 fill
    cleaned = cleaned.replace(/<svg\b([^>]*)>/, (match, attrs) => {
        let newAttrs = attrs
            .replace(/\b(width|height|fill)="[^"]*"/g, "")
            .replace(/\bstyle="[^"]*"/g, ""); // 移除内联样式，防止覆盖颜色
        return `<svg class="${className}" fill="currentColor" ${newAttrs}>`;
    });

    // 3. 移除所有元素上的 fill 属性（包括简写形式）
    cleaned = cleaned.replace(/\s+fill="[^"]*"/g, "");
    // 4. 移除所有元素内联样式中的 fill 定义
    cleaned = cleaned.replace(/\s+style="[^"]*fill:[^;"]*;?/g, "");
    // 5. 为所有可能绘制图形的元素显式添加 fill="currentColor"（若已存在则替换）
    const graphicTags = ["path", "circle", "rect", "ellipse", "polygon", "polyline", "line"];
    for (const tag of graphicTags) {
        const regexOpen = new RegExp(`<${tag}\\b([^>]*?)>`, "g");
        cleaned = cleaned.replace(regexOpen, (match, attrs) => {
            if (attrs.includes('fill="currentColor"')) return match;
            if (attrs.includes("fill=")) {
                // 将已有 fill 替换为 currentColor
                return match.replace(/\bfill="[^"]*"/, 'fill="currentColor"');
            } else {
                // 无 fill 则添加
                return `<${tag}${attrs} fill="currentColor">`;
            }
        });
    }
    return cleaned;
};